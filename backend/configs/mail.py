from pydantic import Field
from pydantic_settings import BaseSettings


class MailConfig(BaseSettings):
    """
    Mail-related configuration
    """

    MAIL_DEFAULT_SEND_FROM: str = Field(..., description="Default sender email address")
    SMTP_SERVER: str = Field(..., description="SMTP server address")
    SMTP_PORT: int = Field(..., description="SMTP server port")
    SMTP_USERNAME: str = Field(..., description="SMTP username")
    SMTP_PASSWORD: str = Field(..., description="SMTP password")
    SMTP_USE_TLS: bool = Field(True, description="Enable TLS for SMTP")
    SMTP_OPPORTUNISTIC_TLS: bool = Field(
        False, description="Enable opportunistic TLS for SMTP"
    )