# services/account_service.py
from fastapi import Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import LoginRequest, SignupRequest
from app.errors.user import UserErrorCode
from app.models.user import Account, AccountStatus
from utils.security import create_access_token


class AccountService:
    @staticmethod
    async def signup(session: AsyncSession, payload: SignupRequest, request: Request) -> Account:
        """Register a new account."""
        # Check if the email/name is already registered
        result = await session.execute(
            Account.select().where(Account.email == payload.email | Account.name == payload.name)
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
        # TODO: Set to PENDING by default, and update to ACTIVE once verified in the code.
        account = Account(
            name=payload.name,
            email=payload.email,
            status=AccountStatus.ACTIVE,
            last_login_ip=request.client.host,
        )
            
        account.set_password(payload.password)
        account.save()
        return account
    
    # TODO - Add invite code support
    # async def signup_by_invite_code() -> Account:

    # TODO - Support login by username or oauth in the futrue
    @staticmethod
    async def login(session: AsyncSession, payload: LoginRequest) -> str:
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
        token = create_access_token({"sub": account.id})
        return token

    @staticmethod
    async def update_account(session: AsyncSession, account: Account, data: dict):
        """Update account details."""
        for key, value in data.items():
            if hasattr(account, key):
                setattr(account, key, value)
        await session.commit()
        return account
