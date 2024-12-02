# services/account_service.py
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schemas import LoginRequest, SignupRequest
from app.user.models import Account, AccountStatus
from utils.security import create_access_token, hash_password, verify_password


class AccountService:
    @staticmethod
    async def signup(session: AsyncSession, payload: SignupRequest) -> Account:
        """Register a new account."""
        # Check if the email is already registered
        existing_account = await session.execute(
            Account.select().where(Account.email == payload.email)
        )
        if existing_account.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered.",
            )

        # Create new account
        account = Account(
            email=payload.email,
            password_hash=hash_password(payload.password),
            status=AccountStatus.PENDING,
        )
        session.add(account)
        await session.commit()
        return account

    @staticmethod
    async def login(session: AsyncSession, payload: LoginRequest) -> str:
        """Authenticate an account and return a JWT token."""
        # Find the account
        account = await session.execute(
            Account.select().where(Account.email == payload.email)
        )
        account = account.scalar_one_or_none()

        if not account or not verify_password(payload.password, account.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if account.status != AccountStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active.",
            )

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
