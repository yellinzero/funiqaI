import importlib
import pkgutil

from .core import (
    RedisRateLimiter,
    SessionFactory,
    engine,
    get_session,
    init_database,
    provide_session,
    redis,
    shutdown_database,
    sync_engine,
    sync_redis,
    transactional_session,
    update_database_schema,
)
from .models import DBBase, DBIntIDModelMixin, DBModelMixin, DBUUIDIDModelMixin


def load_models(package_name: str) -> None:
    """
    Dynamically import all submodules of a package to ensure models are registered.
    :param package_name: The package containing the models (e.g., 'my_app.models').
    """
    package = importlib.import_module(package_name)
    for _, module_name, _ in pkgutil.walk_packages(package.__path__, package.__name__ + "."):
        importlib.import_module(module_name)
