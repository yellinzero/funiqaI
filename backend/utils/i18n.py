from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable, ClassVar

import yaml
from babel.core import Locale as BabelLocale
from babel.support import LazyProxy, NullTranslations, Translations
from loguru import logger

from configs import funiq_ai_config
from utils.context import ContextStorage

all_domains = ["templates"]


class TranslationRegistry:
    """
    A registry that manages translations for multiple domains (e.g., messages, email, model_providers).
    Handles loading and storing translations for different languages and domains.
    """
    _translations: ClassVar[dict[str, dict[str, NullTranslations]]] = {}  # domain -> language -> translations
    _default_locale: ClassVar[str] = funiq_ai_config.DEFAULT_LOCALE
    _supported_locales: ClassVar[set[str]] = set()
    _locales_path: ClassVar[str] = funiq_ai_config.LOCALES_PATH

    @property
    def translations(self) -> dict[str, dict[str, NullTranslations]]:
        """Returns all loaded translations across all domains and languages."""
        return self._translations

    @property
    def supported_locales(self) -> set[str]:
        """Returns set of all supported locale codes."""
        return self._supported_locales

    @property
    def default_locale(self) -> str:
        """Returns the default locale code."""
        return self._default_locale

    def load_translations(self, domain: str = "messages") -> None:
        """
        Load translations for a specific domain from the locales directory.
        Updates the supported locales set based on available translations.
        
        Args:
            domain: The translation domain to load (e.g., 'messages', 'email')
        """
        if domain not in self._translations:
            self._translations[domain] = {}
            
        for lang in os.listdir(self._locales_path):
            if os.path.isfile(os.path.join(self._locales_path, lang)):
                continue
            try:
                translation = Translations.load(self._locales_path, [lang], domain)
                if lang in self._translations[domain]:
                    self._translations[domain][lang].merge(translation)
                else:
                    self._translations[domain][lang] = translation
            except Exception as e:
                logger.error(f"Cannot load translation for '{lang}' in domain '{domain}': {e!s}")
                continue

        # Update supported locales based on all domains
        all_locales = set()
        for domain_translations in self._translations.values():
            all_locales.update(domain_translations.keys())
        self._supported_locales = all_locales
        self._supported_locales.add(self.default_locale)
        logger.info(f"Supported locales for domain '{domain}': {sorted(self._supported_locales)}")

    def register_domains(self, domains: list[str]) -> None:
        """
        Register and load translations for multiple domains at once.
        
        Args:
            domains: List of domain names to register (e.g., ['messages', 'email', 'model_providers'])
        """
        for domain in domains:
            self.load_translations(domain)
            logger.info(f"Registered translations for domain: {domain}")


# Global translation registry instance
translation_registry = TranslationRegistry()


@dataclass
class LocaleTranslator:
    """
    Handles locale-specific translations and stores locale information.
    Wraps Babel's Locale functionality with translation capabilities.
    """
    language: str
    translations: NullTranslations
    territory: str | None = None
    script: str | None = None
    variant: str | None = None
    modifier: str | None = None

    @classmethod
    def get(cls, locale_code: str) -> LocaleTranslator:
        """
        Create a LocaleTranslator instance for the given locale code.
        Falls back to default locale if the requested locale is not supported.
        
        Args:
            locale_code: The locale code (e.g., 'en', 'zh-CN')
        
        Returns:
            LocaleTranslator instance for the requested or default locale
        """
        if locale_code not in translation_registry.supported_locales:
            locale_code = translation_registry.default_locale

        babel_locale = BabelLocale.parse(locale_code)
        default_translations = translation_registry.translations.get('messages', {}).get(
            locale_code, 
            NullTranslations()
        )
        
        return cls(
            language=babel_locale.language,
            translations=default_translations,
            territory=babel_locale.territory,
            script=babel_locale.script,
            variant=babel_locale.variant,
            modifier=babel_locale.modifier,
        )

    def translate(
        self,
        message: str,
        plural_message: str | None = None,
        count: int | None = None,
        domain: str = 'messages',
        **kwargs: str,
    ) -> str:
        """
        Translate a message using the loaded translations for the specified domain.
        """
        locale_code = self.language
        if self.territory:
            locale_code = f"{self.language}_{self.territory}"
        
        translations = translation_registry.translations.get(domain, {}).get(
            locale_code,
            NullTranslations()
        )
        
        if plural_message is not None and count is not None:
            message = translations.ungettext(message, plural_message, count)
            format_kwargs = {'count': str(count), **kwargs}  # Create new dict with count, preserving user's kwargs
        else:
            message = translations.ugettext(message)
            format_kwargs = kwargs

        return message.format(**format_kwargs) if format_kwargs else message


class LocaleContext(ContextStorage):
    """
    Context manager for handling locale information in the current context.
    Provides thread-local storage for the current locale.
    """
    DEFAULT_VALUE = LocaleTranslator.get(funiq_ai_config.DEFAULT_LOCALE)
    CONTEXT_KEY_NAME = "locale"


# Global locale context instance
_locale_ctx = LocaleContext()


def create_lazy_translator(translation_func: Callable) -> Callable:
    """
    Create a lazy translation function that defers actual translation until the string is used.
    
    Args:
        translation_func: The function to use for actual translation
    
    Returns:
        A function that creates LazyProxy objects for delayed translation
    """
    def lazy_translator(
        string: LazyProxy | str,
        *args: Any,
        locale: str | None = None,
        **kwargs: Any,
    ) -> LazyProxy | str:
        if isinstance(string, LazyProxy):
            return string

        if "enable_cache" not in kwargs:
            kwargs["enable_cache"] = False

        return LazyProxy(translation_func, string, *args, locale=locale, **kwargs)

    return lazy_translator


def _translate(
    message: str,
    plural_message: str | None = None,
    count: int | None = None,
    **kwargs: Any,
):
    """
    Internal translation function that handles the actual translation process.
    
    Args:
        message: The message to translate
        plural_message: Optional plural form of the message
        count: Optional count for plural forms
        **kwargs: Additional translation parameters
    """
    locale_code = kwargs.pop("locale", None)
    domain = kwargs.pop("domain", "messages")
    locale = LocaleTranslator.get(locale_code) if locale_code else _locale_ctx.get()
    return locale.translate(message, plural_message, count, domain=domain, **kwargs)


# Create global lazy translation function
gettext_lazy = create_lazy_translator(_translate)


# Utility functions for managing translations and locales
def load_domain_translations(domain: str) -> None:
    """Load translations for a specific domain."""
    translation_registry.load_translations(domain)


def register_translation_domains(domains: list[str]) -> None:
    """Register and load translations for multiple domains at once."""
    translation_registry.register_domains(domains)


def set_current_locale(locale_code: str) -> None:
    """Set the current locale in the context."""
    locale = LocaleTranslator.get(locale_code)
    _locale_ctx.set(locale)


def get_current_locale_translator() -> LocaleTranslator:
    """Get the current locale from the context."""
    locale: LocaleTranslator = _locale_ctx.get()
    return locale


def get_current_locale_code() -> str:
    """Get the language code of the current locale."""
    return str(get_current_locale_translator().language)


def get_current_territory() -> str:
    """Get the territory code of the current locale."""
    return str(get_current_locale_translator().territory)


def get_current_variant() -> str:
    """Get the variant code of the current locale."""
    return str(get_current_locale_translator().variant)


def parse_yaml_translations(yaml_content: str, domain: str = "messages") -> dict[str, Any]:
    """
    Parse YAML content and convert translation markers to lazy translation objects.
    
    Args:
        yaml_content: The YAML content as a string
        domain: Translation domain (default: 'messages')
    
    Returns:
        Dict containing the parsed YAML with translation markers converted to lazy translations
    """
    def process_translations(data: Any) -> Any:
        if isinstance(data, dict):
            return {key: process_translations(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [process_translations(item) for item in data]
        elif isinstance(data, str):
            match = re.match(r'^_\(["\'](.+?)["\']\)$', data)
            if match:
                return gettext_lazy(match.group(1), domain=domain)
        return data

    # Parse the YAML content first
    parsed_data = yaml.safe_load(yaml_content)
    # Process the parsed data to convert translation markers
    return process_translations(parsed_data)


def load_yaml_file_with_translations(file_path: str, domain: str = "messages") -> dict[str, Any]:
    """Load and parse a YAML file with translation markers."""
    return parse_yaml_translations(Path(file_path).read_text(encoding="utf-8"), domain=domain)


def register_all_translation_domains() -> None:
    """Register and load translations for multiple domains at once."""
    translation_registry.register_domains(all_domains)
