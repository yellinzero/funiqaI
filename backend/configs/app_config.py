from pydantic_settings import SettingsConfigDict

from configs.package import PackageInfo


class FuniqAIConfigSettings(
    # Packaging info
    PackageInfo,
):
    DEBUG: bool
    SECRET_KEY: str
    SYNC_DATABASE_URL: str
    DATABASE_ECHO: bool = False
    SYNC_DATABASE_POOL_SIZE: int = 5
    ASYNC_DATABASE_URL: str
    ASYNC_DATABASE_POOL_SIZE: int = 5
    REDIS_URL: str
    REDIS_MAX_CONNECTIONS: int = 5
    
    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        frozen=True,
        # ignore extra attributes
        extra="ignore",
    )
