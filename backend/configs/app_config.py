from pydantic_settings import SettingsConfigDict

from configs.package import PackageInfo


class FuniqAIConfigSettings(
    # Packaging info
    PackageInfo,
):
    model_config = SettingsConfigDict(
        # read from dotenv format config file
        env_file=".env",
        env_file_encoding="utf-8",
        frozen=True,
        # ignore extra attributes
        extra="ignore",
    )
