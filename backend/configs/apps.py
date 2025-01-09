from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class AppsConfig(BaseSettings):
    """
    Application modules configuration
    """
    
    INSTALLED_APPS: List[str] = Field(
        default=[
            "app.auth",      # Authentication module
            "app.account",   # Account management module
        ],
        description="List of installed application modules"
    )