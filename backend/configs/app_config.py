from pydantic_settings import SettingsConfigDict

from .apps import AppsConfig
from .celery import CeleryConfig
from .cros import CrosConfig
from .database import DatabaseConfig, RedisConfig
from .mail import MailConfig
from .package import PackageInfo
from .token import TokenConfig


class FuniqAIConfigSettings(
    PackageInfo, MailConfig, DatabaseConfig, RedisConfig, TokenConfig, CeleryConfig, AppsConfig, CrosConfig
):
    DEBUG: bool
    SECRET_KEY: str
    REFRESH_TOKEN_COOKIE_NAME: str

    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        frozen=True,
        # ignore extra attributes
        extra="ignore",
    )
