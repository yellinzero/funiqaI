from typer import Typer

from .alembic import cli as alembic_cli
from .i18n import cli as i18n_cli
from .scripts import cli as scripts_cli

cli = Typer()

cli.add_typer(alembic_cli, name="alembic")
cli.add_typer(i18n_cli, name="i18n")
cli.add_typer(scripts_cli, name="scripts")

if __name__ == "__main__":
    cli()