import asyncio
import os
from typing import AsyncGenerator

import pytest
from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from database import DBBase


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


def get_db_url(db_name="postgres"):
    """Get database URL with the specified database name."""
    return f"postgresql+asyncpg://postgres:funiq_ai_db_pass@localhost:5432/{db_name}"


async def create_database():
    """Create test database if it doesn't exist."""
    url = make_url(get_db_url())
    engine = create_async_engine(str(url), isolation_level="AUTOCOMMIT")
    
    async with engine.connect() as conn:
        await conn.execute(text("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'funiq_ai_test'
            AND pid <> pg_backend_pid()
        """))
        await conn.execute(text("DROP DATABASE IF EXISTS funiq_ai_test"))
        try:
            await conn.execute(text("CREATE DATABASE funiq_ai_test"))
        except Exception as e:
            if "already exists" not in str(e):
                raise
        finally:
            await engine.dispose()


@pytest.fixture(scope="session")
async def engine():
    """Create test database, tables and return engine."""
    await create_database()
    
    test_engine = create_async_engine(get_db_url("funiq_ai_test"), echo=True)
    
    async with test_engine.begin() as conn:
        await conn.run_sync(DBBase.metadata.create_all)
    
    yield test_engine
    
    await test_engine.dispose()
    
    # Clean up test database
    cleanup_engine = create_async_engine(get_db_url(), isolation_level="AUTOCOMMIT")
    async with cleanup_engine.connect() as conn:
        await conn.execute(text("DROP DATABASE IF EXISTS funiq_ai_test"))
    await cleanup_engine.dispose()


@pytest.fixture
async def async_session(engine) -> AsyncGenerator[AsyncSession, None]:
    """Create async session for tests with automatic cleanup."""
    session_maker = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False
    )
    
    async with session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()