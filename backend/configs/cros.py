from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class CrosConfig(BaseSettings):
    CORS_ALLOW_ORIGINS: List[str] = Field(default=["*"], description="List of allowed origins")

    CORS_ALLOW_CREDENTIALS: bool = Field(default=True, description="Allow credentials")

    CORS_ALLOW_METHODS: List[str] = Field(default=["*"], description="List of allowed methods")

    CORS_ALLOW_HEADERS: List[str] = Field(default=["*"], description="List of allowed headers")
