# services/account_service.py
import secrets

from fastapi import Request, status
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import (
    ActivateAccountVerifyRequest,
    ForgotPasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
    SignupRequest,
    SignupVerifyRequest,
)
from app.errors.common import CommonErrorCode
from app.errors.user import UserErrorCode
from app.models.user import Account, AccountStatus
from database import RedisRateLimiter
from tasks.email_tasks import (
    send_activate_account_email_task,
    send_reset_password_verification_email_task,
    send_signup_verification_email_task,
)
from utils.datatime import utcnow
from utils.security import create_access_token, get_user_id_from_token
from utils.token_manager import AccountTokenManager, AccountTokenType

token_manager = AccountTokenManager()


class AccountService:
    """Account service for managing user accounts"""
    
    # Rate limiters
    reset_password_limit = RedisRateLimiter(
        prefix="reset_password_redis_rate_limit", max_attempts=1, time_window=60 * 1
    )
    signup_email_verification_limit = RedisRateLimiter(
        prefix="signup_email_verification_rate_limit", max_attempts=1, time_window=60 * 1
    )
    activate_account_limit = RedisRateLimiter(
        prefix="activate_account_rate_limit", max_attempts=1, time_window=60 * 1
    )
    LOGIN_MAX_ERROR_LIMITS = 5

    # region Account Registration
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
            language=payload.language or 'en',
            status=AccountStatus.PENDING,
            last_login_ip=request.client.host,
        )
            
        account.set_password(payload.password)
        await account.save(session)
    
        token = await AccountService.send_sign_up_verification_email(account)
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
            raise CommonErrorCode.EMAIL_VERIFICATION_CODE_EXPIRED.exception(
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
            raise CommonErrorCode.EMAIL_VERIFICATION_TOO_FREQUENT.exception(
                 data={"email": account.email}, 
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        token = await token_manager.generate_signup_email_verification_token(account.email, code)
        send_signup_verification_email_task.delay(
            language=account.language or 'en',
            to=account.email,
            code=code,
        )
        await AccountService.signup_email_verification_limit.record_attempt(account.email)
        return token
    # endregion

    # region Authentication
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
    # endregion
    
    # region Account Management
    @staticmethod
    async def update_account(session: AsyncSession, account: Account, data: dict):
        """Update account details."""
        for key, value in data.items():
            if hasattr(account, key):
                setattr(account, key, value)
        await session.commit()
        return account
    
    @staticmethod
    async def send_activate_account_email(account: Account) -> str:
        """
        Send an account activation email with a verification code.
        :param account: Account object
        :return: Verification token
        """
        if (await AccountService.activate_account_limit.check_limit_exceeded(account.email)):
            raise CommonErrorCode.EMAIL_VERIFICATION_TOO_FREQUENT.exception(
                data={"email": account.email},
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )

        code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        token = await token_manager.generate_activate_account_token(account.email, code)
        send_activate_account_email_task.delay(
            language=account.language or 'en',
            to=account.email,
            code=code,
        )
        await AccountService.activate_account_limit.record_attempt(account.email)
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
        token = await AccountService.send_activate_account_email(account)
        return token
    
    # endregion

    # region Password Management
    @staticmethod
    async def send_reset_password_email(session: AsyncSession, payload: ForgotPasswordRequest) -> str:
        """Send password reset email with verification code."""
        # Check rate limiting
        if (await AccountService.reset_password_limit.check_limit_exceeded(payload.email)):
            raise CommonErrorCode.EMAIL_VERIFICATION_TOO_FREQUENT.exception(
                data={"email": payload.email},
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )
            
        # Find account
        result = await session.execute(
            Account.select().where(Account.email == payload.email)
        )
        account: Account | None = result.scalars().one_or_none()
        
        if not account:
            raise UserErrorCode.EMAIL_NOT_REGISTERED.exception(
                data={"email": payload.email},
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Generate verification code and token
        code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        token = await token_manager.generate_reset_password_token(account.email, code)
        
        # Send email
        send_reset_password_verification_email_task.delay(
            language=account.language or 'en',
            to=account.email,
            code=code,
        )
        
        await AccountService.reset_password_limit.record_attempt(account.email)
        return token

    @staticmethod
    async def reset_password(session: AsyncSession, payload: ResetPasswordRequest) -> str:
        """Reset password using verification code."""
        # Verify token and code
        token_data = await token_manager.get_reset_password_verification_data(payload.token)
        if not token_data:
            raise CommonErrorCode.EMAIL_VERIFICATION_CODE_EXPIRED.exception(
                status_code=status.HTTP_400_BAD_REQUEST
            )
            
        email = token_data.get("email")
        if token_data.get("code") != payload.code:
            raise CommonErrorCode.INVALID_VERIFICATION_CODE.exception(
                data={"email": email},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Find and update account
        result = await session.execute(
            Account.select().where(Account.email == email)
        )
        account: Account | None = result.scalars().one_or_none()
        
        if not account:
            raise UserErrorCode.EMAIL_NOT_REGISTERED.exception(
                data={"email": email},
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Update password
        account.set_password(payload.new_password)
        await account.save(session)
        
        # Revoke token and return new access token
        await token_manager.revoke_reset_password_token(email)
        return create_access_token({"aid": str(account.id)})
    # endregion

    @staticmethod
    async def resend_verification_code(session: AsyncSession, email: str, code_type: AccountTokenType) -> str:
        """
        Resend verification code based on type.
        :param session: Database session
        :param email: Email address
        :param code_type: Type of verification code to send
        :return: New verification token
        """
        # Find account
        result = await session.execute(
            Account.select().where(Account.email == email)
        )
        account: Account | None = result.scalars().one_or_none()
        
        if not account:
            raise UserErrorCode.EMAIL_NOT_REGISTERED.exception(
                data={"email": email},
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Send verification code based on type
        if code_type == AccountTokenType.SIGNUP_EMAIL:
            return await AccountService.send_sign_up_verification_email(account)
        elif code_type == AccountTokenType.ACTIVATE_ACCOUNT_EMAIL:
            return await AccountService.send_activate_account_email(account)
        elif code_type == AccountTokenType.RESET_PASSWORD_EMAIL:
            return await AccountService.send_reset_password_email(session, ForgotPasswordRequest(email=email))
    # endregion

    @staticmethod
    async def activate_account_verify(
        session: AsyncSession, 
        payload: ActivateAccountVerifyRequest, 
        request: Request
    ) -> str:
        """
        Verify account activation using the provided verification code.
        """
        # Verify token and code
        token_data = await token_manager.get_activate_account_verification_data(payload.token)
        if not token_data:
            raise CommonErrorCode.EMAIL_VERIFICATION_CODE_EXPIRED.exception(
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        email = token_data.get("email")
        if token_data.get("code") != payload.code:
            raise CommonErrorCode.INVALID_VERIFICATION_CODE.exception(
                data={"email": email},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Find and update account
        result = await session.execute(
            Account.select().where(Account.email == email)
        )
        account: Account | None = result.scalars().one_or_none()
        
        if not account:
            raise UserErrorCode.EMAIL_NOT_REGISTERED.exception(
                data={"email": email},
                status_code=status.HTTP_404_NOT_FOUND
            )

        # Update account status
        account.status = AccountStatus.ACTIVE
        account.last_login_at = utcnow().replace(tzinfo=None)
        account.last_login_ip = request.client.host
        await account.save(session)
        
        # Revoke token and return new access token
        await token_manager.revoke_signup_email_verification_token(email)
        return create_access_token({"aid": str(account.id)})

    @staticmethod
    async def get_account_info(session: AsyncSession, request: Request) -> Account:
        """
        Get account information from JWT token.
        :param session: Database session
        :param request: Request object
        :return: Account object
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise UserErrorCode.ACCOUNT_NOT_FOUND.exception(
                status_code=status.HTTP_404_NOT_FOUND
            )
            
        access_token = auth_header.split(" ")[1]
        account_id = get_user_id_from_token(access_token)
        if not account_id:
            raise UserErrorCode.ACCOUNT_NOT_FOUND.exception(
                status_code=status.HTTP_404_NOT_FOUND
            )
        result = await session.execute(
            Account.select().where(Account.id == account_id)
        )
        return result.scalars().one_or_none()