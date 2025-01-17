import contextlib
import functools
import logging
import time
from inspect import signature
from typing import Any, AsyncGenerator, Callable

from redis import Redis as SyncRedis
from redis.asyncio import BlockingConnectionPool, Redis
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from configs import funiq_ai_config
from utils.json import json_dumps, json_loads

from .models import DBBase

# Database engine and session factory
sync_engine = create_engine(
    url=funiq_ai_config.SYNC_DATABASE_URL,
    echo=funiq_ai_config.DATABASE_ECHO,
    pool_size=funiq_ai_config.SYNC_DATABASE_POOL_SIZE,
    pool_pre_ping=True,
    json_serializer=json_dumps,
    json_deserializer=json_loads,
)

engine: AsyncEngine = create_async_engine(
    url=funiq_ai_config.ASYNC_DATABASE_URL,
    echo=funiq_ai_config.DATABASE_ECHO,
    pool_size=funiq_ai_config.ASYNC_DATABASE_POOL_SIZE,
    pool_pre_ping=True,
    json_serializer=json_dumps,
    json_deserializer=json_loads,
)

SessionFactory = async_sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)

# Redis clients
redis: Redis = Redis(
    connection_pool=BlockingConnectionPool.from_url(
        url=funiq_ai_config.REDIS_URL,
        max_connections=funiq_ai_config.REDIS_MAX_CONNECTIONS,
    )
)

sync_redis: SyncRedis = SyncRedis.from_url(
    url=funiq_ai_config.REDIS_URL,
    max_connections=funiq_ai_config.REDIS_MAX_CONNECTIONS,
)


async def init_database():
    """
    Initialize the database: create tables if they don't exist.
    """
    async with engine.begin() as conn:
        await conn.run_sync(DBBase.metadata.create_all)


async def update_database_schema():
    """
    Update the database schema without dropping existing tables.
    """
    async with engine.begin() as conn:
        await conn.run_sync(DBBase.metadata.create_all, checkfirst=True)


async def shutdown_database():
    """
    Properly close the database and Redis connections during application shutdown.
    """
    try:
        await redis.close()
        sync_redis.close()
        await engine.dispose()
    except Exception as e:
        print(f"Error during shutdown: {e}")


@contextlib.asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provide a database session for dependency injection in FastAPI routes.
    """
    async with SessionFactory() as session:
        yield session


@contextlib.asynccontextmanager
async def transactional_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provide a database session within a transactional scope.
    """
    async with SessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


def provide_session(fn: Callable[..., Any]):
    """
    Decorator: Provide a transactional session to the target function.
    - If a `session` is explicitly passed to the target function, use it directly.
    - If no `session` is provided, create a new session and inject it into the function.
    """
    parameters = signature(fn).parameters  # Retrieve the target function's parameter signature
    has_session = "session" in parameters  # Check if the function defines a `session` parameter

    # Check if the `session` parameter has a default value and is not empty
    session_has_default = has_session and parameters["session"].default is not parameters["session"].empty

    # Retrieve the position index of the `session` parameter
    session_idx = tuple(parameters).index("session") if has_session else None

    @functools.wraps(fn)
    async def wrapper(*args, **kwargs) -> Any:
        """
        Wrapper logic:
        1. Check if the `session` parameter is defined in the target function.
        2. Use an explicitly passed `session` if provided; otherwise, create a new session.
        """

        # Case 1: If the target function does not define `session`
        #         or `session` has a valid(including None) default value, call the function directly.
        if not has_session or session_has_default:
            return await fn(*args, **kwargs)

        # Case 2: Check if `session` is provided via positional arguments (`args`).
        if session_idx is not None and session_idx < len(args):
            session_value = args[session_idx]
            if session_value is not None:  # If a valid `session` is provided, call the function directly.
                return await fn(*args, **kwargs)

        # Case 3: Check if `session` is provided via keyword arguments (`kwargs`) and has a valid value.
        if has_session and "session" in kwargs and kwargs["session"]:
            return await fn(*args, **kwargs)

        # Case 4: If no valid `session` is provided, create a new transactional session.
        async with transactional_session() as session:
            if session_idx is not None and session_idx < len(args):
                # If `session` is defined as a positional argument, inject the session into `args`.
                args = list(args)  # Convert `args` to a mutable list
                args[session_idx] = session
                args = tuple(args)  # Convert back to a tuple
            else:
                # If `session` is defined as a keyword argument, inject the session into `kwargs`.
                kwargs["session"] = session

            # Call the original function with the injected session
            return await fn(*args, **kwargs)

    return wrapper


class RedisRateLimiter:
    """
    A Redis-based rate limiter for tracking request limits by key (e.g., email or IP).
    """

    def __init__(self, prefix: str = "redis_rate_limiter", max_attempts: int = 5, time_window: int = 60):
        """
        Initialize the rate limiter.

        :param redis_client: Redis client instance.
        :param prefix: Redis key prefix.
        :param max_attempts: Max allowed attempts in the time window.
        :param time_window: Time window in seconds.
        """
        self.prefix = prefix
        self.max_attempts = max_attempts
        self.time_window = time_window
        self.logger = logging.getLogger(self.__class__.__name__)

    def generate_key(self, identifier: str) -> str:
        """
        Generate a unique Redis key for a given identifier (e.g., email or IP).

        :param identifier: Unique identifier for the user or IP.
        :return: Redis key.
        """
        return f"{self.prefix}:{identifier}"

    async def check_limit_exceeded(self, identifier: str) -> bool:
        """
        Check if the rate limit is exceeded for the given identifier.

        :param identifier: Unique identifier for the user or IP.
        :return: True if the limit is exceeded, False otherwise.
        """
        key = self.generate_key(identifier)
        current_time = int(time.time())
        window_start_time = current_time - self.time_window

        # Remove expired attempts
        await redis.zremrangebyscore(key, "-inf", window_start_time)

        # Check current attempts count
        attempts = await redis.zcard(key)
        if attempts and int(attempts) >= self.max_attempts:
            self.logger.warning(f"Rate limit exceeded for identifier: {identifier}")
            return True
        return False

    async def record_attempt(self, identifier: str):
        """
        Record an attempt for the given identifier.

        :param identifier: Unique identifier for the user or IP.
        """
        key = self.generate_key(identifier)
        current_time = int(time.time())

        # Add the current timestamp to the sorted set
        await redis.zadd(key, {current_time: current_time})

        # Set expiration time for the key to automatically clear old data
        await redis.expire(key, self.time_window * 2)

    async def reset_attempts(self, identifier: str):
        """
        Reset the attempts for the given identifier.

        :param identifier: Unique identifier for the user or IP.
        """
        key = self.generate_key(identifier)
        await redis.delete(key)
        self.logger.info(f"Rate limit reset for identifier: {identifier}")
