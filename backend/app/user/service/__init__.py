# services/account_service.py
import secrets

from celery import shared_task
from fastapi import Request, status
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import LoginRequest, SignupRequest, SignupVerifyRequest
from app.errors.common import CommonErrorCode
from app.errors.user import UserErrorCode
from app.models.user import Account, AccountStatus
from database import RedisRateLimiter
from services.email_service import email_service
from tasks.email_tasks import send_signup_verification_email_task
from utils.datatime import utcnow
from utils.security import create_access_token
from utils.token_manager import AccountTokenManager

token_manager = AccountTokenManager()


class AccountService:
    reset_password_limit = RedisRateLimiter(
        prefix="reset_password_redis_rate_limit", max_attempts=1, time_window=60 * 1
    )
    signup_email_verification_limit = RedisRateLimiter(
        prefix="signup_email_verification_rate_limit", max_attempts=1, time_window=60 * 1
    )
    LOGIN_MAX_ERROR_LIMITS = 5

    @staticmethod
    async def signup(session: AsyncSession, payload: SignupRequest, request: Request) -> str:
        """Register a new account."""
        
        # Check if the email/name is already registered
        result = await session.execute(
            Account.select().where(or_(Account.email == payload.email, Account.name == payload.name))
        )
        
        existing_account: Account | None = result.scalars().one_or_none()
        if existing_account:
            if existing_account.email == payload.email:
                raise UserErrorCode.EMAIL_ALREADY_REGISTERED.exception(
                    data={"email": payload.email}, 
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            elif existing_account.name == payload.name:
                raise UserErrorCode.NAME_ALREADY_REGISTERED.exception(
                    data={"name": payload.name}, 
                    status_code=status.HTTP_400_BAD_REQUEST
                )
                
        # Create new account
        account = Account(
            name=payload.name,
            email=payload.email,
            language=payload.language,
            status=AccountStatus.PENDING,
            last_login_ip=request.client.host,
        )
            
        account.set_password(payload.password)
        await account.save(session)
    
        token = await AccountService.send_sign_up_verification_email(account)
        return token

    @staticmethod
    async def activate_account(session: AsyncSession, payload: SignupRequest) -> str:
        """
        Activate an account by verifying email/name and send a verification email.
        :param session: Database session
        :param payload: SignupRequest schema with email and name
        :return: Verification token
        """
        result = await session.execute(Account.select().where(Account.email == payload.email))
            
        account: Account | None = result.scalars().one_or_none()
        if not account:
            raise UserErrorCode.EMAIL_NOT_REGISTERED.exception(
                    data={"email": payload.email}, 
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        elif account.status == AccountStatus.ACTIVE:
            raise UserErrorCode.ACCOUNT_ALREADY_ACTIVE.exception(
                 data={"email": payload.email}, 
                status_code=status.HTTP_400_BAD_REQUEST
            )
        token = await AccountService.send_sign_up_verification_email(account)
        return token

    # TODO - Add invite code support
    # async def signup_by_invite_code() -> Account:
    # TODO - Support login by username or oauth in the futrue
    @staticmethod
    async def login(session: AsyncSession, payload: LoginRequest, request: Request) -> str:
        """Authenticate an account and return a JWT token."""
        # Find the account
        result = await session.execute(
            Account.select().where(Account.email == payload.email)
        )
        
        account: Account | None = result.scalars().one_or_none()

        if not account or not account.verify_password(payload.password):
            raise UserErrorCode.INVALID_EMAIL_PASSWORD.exception(status_code=status.HTTP_401_UNAUTHORIZED)

        if account.status != AccountStatus.ACTIVE:
            raise UserErrorCode.ACCOUNT_NOT_ACTIVE.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Generate JWT token
        account.last_login_at = utcnow().replace(tzinfo=None)
        account.last_login_ip = request.client.host
        await account.save(session)
        token = create_access_token({"aid": str(account.id)})
        return token
    
    @staticmethod
    async def sign_up_email_verify(session: AsyncSession, payload: SignupVerifyRequest, request: Request) -> str:
        """
        Verify the email using the provided verification code.
        :param session: Database session
        :param token: 
        :param code: Verification code provided by the user
        :return: Whether the verification was successful
        """
        # Retrieve the token data
        token_data = await token_manager.get_signup_email_verification_data(payload.token)
        if not token_data:
            raise UserErrorCode.SIGNUP_EMAIL_VERIFICATION_CODE_EXPIRED.exception(
                status_code=status.HTTP_400_BAD_REQUEST
            )
            
        email = token_data.get("email")

        # Check the provided code against the token data
        if token_data.get("code") != payload.code:
            raise CommonErrorCode.INVALID_VERIFICATION_CODE.exception(
                data={"email": email},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Mark the account as active if the verification succeeds
        result = await session.execute(
            Account.select().where(Account.email == email)
        )
        account: Account | None = result.scalars().one_or_none()

        if not account:
            raise UserErrorCode.EMAIL_NOT_REGISTERED.exception(
                data={"email": email},
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Update account status to active
        account.status = AccountStatus.ACTIVE
        account.last_login_at = utcnow().replace(tzinfo=None)
        account.last_login_ip = request.client.host
        await account.save(session)

        # Remove the token after successful verification
        await token_manager.revoke_signup_email_verification_token(email)
        access_token = create_access_token({"aid": str(account.id)})
        return access_token
    
    @staticmethod
    async def send_sign_up_verification_email(account: Account) -> str:
        """
        Send a signup verification email with a verification token.
        :param account: Account object
        :return: Verification token
        """
        if (await AccountService.signup_email_verification_limit.check_limit_exceeded(account.email)):
            raise UserErrorCode.SIGNUP_EMAIL_VERIFICATION_TOO_FREQUENT.exception(
                 data={"email": account.email}, 
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        token = await token_manager.generate_signup_email_verification_token(account.email, code)
        send_signup_verification_email_task.delay(
            language=account.language,
            to=account.email,
            code=code,
        )
        await AccountService.signup_email_verification_limit.record_attempt(account.email)
        return token

    @staticmethod
    async def update_account(session: AsyncSession, account: Account, data: dict):
        """Update account details."""
        for key, value in data.items():
            if hasattr(account, key):
                setattr(account, key, value)
        await session.commit()
        return account