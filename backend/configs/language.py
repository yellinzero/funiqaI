
from pydantic import Field
from pydantic_settings import BaseSettings


class LanguageConfig(BaseSettings):
    """
    Configuration for language
    """

    DEFAULT_LOCALE: str = Field(
        'en',
        description="Default language code",
    )
    
    LANGUAGE_HEADER_NAME: str = Field(
        'X-LANGUAGE',
        description="Language cookie name",
    )
    
    LOCALES_PATH: str = Field(
        'locales',
        description="Path to locales",
    )
