from pydantic import Field
from pydantic_settings import BaseSettings


class PackageInfo(BaseSettings):
    """
    Package build information
    """

    CURRENT_VERSION: str = Field(
        description="FuniqAI version",
        default="0.1.0",
    )

    COMMIT_SHA: str = Field(
        description="SHA-1 checksum of the git commit used to build the app",
        default="",
    )
