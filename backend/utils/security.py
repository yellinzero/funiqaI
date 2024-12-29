import datetime
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

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

def get_user_id_from_token(token: str) -> str:
    """
    Extract the user ID from the JWT payload.
    
    Args:
        token (str): The JWT token.
        
    Returns:
        str: The user ID from the token.
    """
    payload = decode_access_token(token)
    return payload.get("sub")  # 'sub' is commonly used to store user ID
