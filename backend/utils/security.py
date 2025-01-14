import datetime
from datetime import timedelta
from typing import Optional, Tuple

from fastapi import Request, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.errors.account import AccountErrorCode
from app.errors.common import CommonErrorCode
from configs import funiq_ai_config

from .datatime import utcnow

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
ALGORITHM = "HS256"


# -------- Password Hashing --------


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against its hash.
    """
    return pwd_context.verify(plain_password, hashed_password)


# -------- JWT Token Handling --------


def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """
    Create a JSON Web Token (JWT) with an optional expiration time.

    Args:
        data (dict): The payload data to encode into the token.
        expires_delta (Optional[datetime.timedelta]): Optional expiration time.

    Returns:
        str: The encoded JWT.
    """
    to_encode = data.copy()
    expire = utcnow() + (expires_delta or datetime.timedelta(minutes=funiq_ai_config.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, funiq_ai_config.SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decode and verify a JWT token.

    Args:
        token (str): The JWT token to decode.

    Returns:
        dict: The decoded payload.

    Raises:
        JWTError: If the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, funiq_ai_config.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Invalid or expired token") from JWTError


# -------- Utility Functions --------


def get_account_id_from_token(token: str) -> str:
    """
    Extract the user ID from the JWT payload.

    Args:
        token (str): The JWT token.

    Returns:
        str: The user ID from the token.
    """
    payload = decode_access_token(token)
    return str(payload.get("aid"))  # 'aid' is commonly used to store user ID


def get_account_id_from_request(request: Request) -> str:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    return get_account_id_from_token(token)


def create_token_pair(data: dict) -> Tuple[str, str]:
    """Create both access and refresh tokens."""
    # Create access token (short-lived)
    access_token = create_access_token(
        data=data, expires_delta=timedelta(minutes=funiq_ai_config.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    # Create refresh token (long-lived)
    refresh_data = {"aid": data["aid"], "type": "refresh", "exp": (utcnow() + timedelta(days=7)).timestamp()}
    refresh_token = jwt.encode(refresh_data, funiq_ai_config.SECRET_KEY, algorithm=ALGORITHM)

    return access_token, refresh_token


def verify_refresh_token(refresh_token: str) -> str:
    """Verify refresh token and return account ID."""
    try:
        payload = jwt.decode(refresh_token, funiq_ai_config.SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED)
        return str(payload.get("aid"))
    except JWTError as e:
        raise AccountErrorCode.REFRESH_TOKEN_EXPIRED.exception() from e


def refresh_access_token(refresh_token: str) -> str:
    """Create new access token from refresh token."""
    account_id = verify_refresh_token(refresh_token)
    return create_access_token({"aid": account_id})
