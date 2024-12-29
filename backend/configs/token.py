from pydantic import Field
from pydantic_settings import BaseSettings


class TokenConfig(BaseSettings):
    """
    Token expiration-related configuration
    """

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, description="Access token expiry time in minutes")
    SIGNUP_EMAIL_VERIFICATION_TOKEN_EXPIRY_MINUTES: int = Field(
        10, description="Signup Email verification token expiry time in minutes"
    )