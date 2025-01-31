import os
from pathlib import Path

from babel.messages import frontend as babel
from typer import Typer

from configs import funiq_ai_config

cli = Typer()


@cli.command()
def init(domain: str, lang: str):
    """Initialize a new translations catalog for the specified language."""
    # Create the locale directory if it doesn't exist
    locale_dir = os.path.join(funiq_ai_config.LOCALES_PATH, lang, 'LC_MESSAGES')
    os.makedirs(locale_dir, exist_ok=True)
    
    cmd = babel.init_catalog()
    cmd.domain = domain
    cmd.output_dir = funiq_ai_config.LOCALES_PATH
    cmd.locale = lang
    
    # If POT file exists, use it as input
    pot_file = os.path.join(funiq_ai_config.LOCALES_PATH, f'{domain}.pot')
    if os.path.exists(pot_file):
        cmd.input_file = pot_file
    
    cmd.finalize_options()
    cmd.run()


@cli.command()
def extract(domain: str):
    """Extract messages from source code into a POT file."""
    # Ensure locales directory exists
    os.makedirs(funiq_ai_config.LOCALES_PATH, exist_ok=True)
    
    # Create a temporary config file with only the sections for the specified domain
    temp_cfg_path = os.path.join(os.getcwd(), f'temp_{domain}_babel.cfg')
    babel_cfg_path = os.path.join(os.getcwd(), 'babel.cfg')
    
    try:
        # Read the original config file
        config_content = Path(babel_cfg_path).read_text(encoding='utf-8')
        
        # Split into sections and filter for the specified domain
        sections = config_content.split('\n\n')
        filtered_sections = [
            section for section in sections 
            if f"domain = {domain}" in section
        ]
        
        # Write the filtered config to a temporary file
        Path(temp_cfg_path).write_text('\n\n'.join(filtered_sections), encoding='utf-8')
        
        # Run extraction with the filtered config
        cmd = babel.extract_messages()
        cmd.mapping_file = temp_cfg_path
        cmd.output_file = os.path.join(funiq_ai_config.LOCALES_PATH, f'{domain}.pot')
        cmd.input_paths = ['./']
        cmd.finalize_options()
        cmd.run()
        
    finally:
        # Clean up temporary config file
        if os.path.exists(temp_cfg_path):
            os.remove(temp_cfg_path)


@cli.command()
def update(domain: str):
    """Update existing translation catalogs from a POT file."""
    cmd = babel.update_catalog()
    cmd.domain = domain
    cmd.input_file = os.path.join(funiq_ai_config.LOCALES_PATH, f'{domain}.pot')
    cmd.output_dir = funiq_ai_config.LOCALES_PATH
    cmd.finalize_options()
    cmd.run()


@cli.command()
def compile(domain: str):
    """Compile translation catalogs into MO files."""
    cmd = babel.compile_catalog()
    cmd.domain = domain
    cmd.directory = funiq_ai_config.LOCALES_PATH
    cmd.finalize_options()
    cmd.run()


@cli.command()
def clean(domain: str):
    """Remove all translation files for a domain."""
    base_dir = funiq_ai_config.LOCALES_PATH
    pot_file = os.path.join(base_dir, f'{domain}.pot')
    if os.path.exists(pot_file):
        os.remove(pot_file)
        
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.startswith(domain) and (file.endswith('.po') or file.endswith('.mo')):
                os.remove(os.path.join(root, file))