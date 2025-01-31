import importlib.util
import os
import re
from pathlib import Path

from typer import Typer

cli = Typer()


@cli.command()
def scripts(script_name: str, module_name: str | None = None):
    """Execute a script from the backend/scripts/ directory, if it exists."""
    # Validate script_name to allow only safe characters
    if not re.match(r'^[\w-]+\.py$', script_name):  # Only allow alphanumeric and underscores, ending with .py
        print(f"Invalid script name: {script_name}")
        return

    script_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../scripts'))
    script_path = Path(script_dir) / script_name

    if script_path.is_file():
        if module_name is None:
            module_name = script_name[:-3]  # Remove .py extension
        spec = importlib.util.spec_from_file_location(module_name, script_path)  # Use the provided module_name
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)  # Execute the script as a module
    else:
        print(f"Script {script_name} does not exist.")