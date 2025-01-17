from pydantic import Field
from pydantic_settings import BaseSettings


class TokenConfig(BaseSettings):
    """
    Token expiration-related configuration
    """

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, description="Access token expiry time in minutes")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(7, description="Refresh token expiry time in days")
    SIGNUP_EMAIL_TOKEN_EXPIRY_MINUTES: int = Field(10, description="Signup Email token expiry time in minutes")
    ACTIVATE_ACCOUNT_EMAIL_TOKEN_EXPIRY_MINUTES: int = Field(
        10, description="Activate Account Email token expiry time in minutes"
    )
    RESET_PASSWORD_EMAIL_TOKEN_EXPIRY_MINUTES: int = Field(
        10, description="Reset Password Email token expiry time in minutes"
    )
