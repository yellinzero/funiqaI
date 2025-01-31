from test_data.data import hello_john, hello_world, hello_zhang

from configs import funiq_ai_config
from utils.i18n import (
    LazyProxy,
    LocaleTranslator,
    _locale_ctx,
    get_current_locale_code,
    get_current_locale_translator,
    get_current_territory,
    load_yaml_file_with_translations,
    parse_yaml_translations,
    register_translation_domains,
    set_current_locale,
    translation_registry,
)
from utils.i18n import gettext_lazy as _


def test_ctx_locale():
    assert isinstance(_locale_ctx.get(), LocaleTranslator)


def test_ctx_locale_language():
    locale = _locale_ctx.get()
    assert locale.language == funiq_ai_config.DEFAULT_LOCALE


def test_set_locale_if_support_locale():
    # Clear existing translations
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    
    # Load translations
    translation_registry.load_translations("templates")
    
    set_current_locale("zh_CN")
    assert get_current_locale_code() == "zh"


def test_set_locale_if_not_support_locale():
    # Clear existing translations
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    
    # Load translations
    translation_registry.load_translations("templates")
    
    set_current_locale("uk")
    assert get_current_locale_code() == funiq_ai_config.DEFAULT_LOCALE


def test_make_lazy_gettext():
    # Clear existing translations
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    
    # Load translations
    translation_registry.load_translations("templates")
    
    set_current_locale("en")
    assert _("Activate Your Account", domain="templates") == "Activate Your Account"

    set_current_locale("zh_CN")
    assert _("Activate Your Account", domain="templates") == "激活您的账户"
    assert _(_("Activate Your Account", domain="templates")) == "激活您的账户"


def test_locale_with_territory():
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    translation_registry.load_translations("templates")
    
    set_current_locale("zh_CN")
    locale = get_current_locale_translator()
    assert locale.language == "zh"
    assert locale.territory == "CN"
    assert get_current_territory() == "CN"


def test_parse_yaml_translations():
    yaml_content = '''
    email:
      reset_password:
        subject: _("Password Reset Code")
        title: _("Reset Your Password")
        content: _("Please copy and paste this code to reset your password. This code is valid for the next 10 minutes only.")
    '''
    
    translations = parse_yaml_translations(yaml_content, domain="templates")
    print(f"translations: {translations}")
    
    set_current_locale("en")
    assert str(translations['email']['reset_password']['subject']) == "Password Reset Code"
    assert str(translations['email']['reset_password']['title']) == "Reset Your Password"
    
    set_current_locale("zh_CN")
    assert str(translations['email']['reset_password']['subject']) == "密码重置验证码"
    assert str(translations['email']['reset_password']['title']) == "重置您的密码" 


def test_translation_with_params():
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    translation_registry.load_translations("test_i18n")
    
    set_current_locale("en")
    message = _("Hello {name}", domain="test_i18n", name="John")
    assert str(message) == "Hello John"


def test_load_yaml_file_with_translations(tmp_path):
    yaml_file = tmp_path / "test.yaml"
    yaml_content = '''
    email:
      reset_password:
        subject: _("Password Reset Code")
        title: _("Reset Your Password")
    '''
    yaml_file.write_text(yaml_content)
    
    translations = load_yaml_file_with_translations(str(yaml_file), domain="templates")
    assert isinstance(translations['email']['reset_password']['subject'], LazyProxy)
    assert isinstance(translations['email']['reset_password']['title'], LazyProxy)
    
    set_current_locale("en")
    assert str(translations['email']['reset_password']['subject']) == "Password Reset Code"
    assert str(translations['email']['reset_password']['title']) == "Reset Your Password"


def test_register_multiple_domains():
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    
    register_translation_domains(["templates", "messages"])
    assert "templates" in translation_registry.translations
    assert "messages" in translation_registry.translations


def test_variant_and_modifier():
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    translation_registry.load_translations()
    
    # Testing with an unsupported locale that includes variant/modifier
    # Should fall back to default locale
    locale = LocaleTranslator.get("en_US_POSIX")
    assert locale.language == translation_registry.default_locale.split('_')[0]
    assert locale.territory == (translation_registry.default_locale.split('_')[1] 
                              if '_' in translation_registry.default_locale else None)
    assert locale.variant is None


def test_test_i18n_translations():
    translation_registry._translations = {}
    translation_registry._supported_locales = set()
    translation_registry.load_translations("test_i18n")
    
    # Test English
    set_current_locale("en")
    assert str(hello_world) == "Hello World"
    assert str(hello_john) == "Hello John"

    # Test Chinese
    set_current_locale("zh_CN")
    assert str(hello_world) == "你好 世界"
    assert str(hello_zhang) == "你好 张三"
