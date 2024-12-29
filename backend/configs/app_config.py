from pydantic_settings import SettingsConfigDict

from .celery import CeleryConfig
from .database import DatabaseConfig, RedisConfig
from .mail import MailConfig
from .package import PackageInfo
from .token import TokenConfig


class FuniqAIConfigSettings(
    PackageInfo,
    MailConfig,
    DatabaseConfig,
    RedisConfig,
    TokenConfig,
    CeleryConfig
):
    DEBUG: bool
    SECRET_KEY: str
    
    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        frozen=True,
        # ignore extra attributes
        extra="ignore",
    )
