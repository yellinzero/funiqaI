
import uuid
from datetime import datetime, timezone
from typing import Any, Generic, Type, TypeVar, Union

import inflect
import stringcase
from sqlalchemy import Integer, delete, func, insert, update
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncAttrs, AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column
from sqlalchemy.sql import Select
from sqlalchemy_utils import generic_repr

# Type variable for the generic DBBase
T = TypeVar("T", bound="DBBase")
ID = TypeVar("ID", bound=Union[int, uuid.UUID])


def resolve_table_name(name: str) -> str:
    p = inflect.engine()
    snake_name = stringcase.snakecase(name)  # Convert PascalCase to snake_case
    parts = snake_name.split("_")
    parts[-1] = p.plural(parts[-1])  # Convert the last part to plural
    return "_".join(parts)


@generic_repr
class DBBase(AsyncAttrs, DeclarativeBase):
    """
    DBBase class for ORM models, providing common database operation methods.
    """

    @declared_attr.directive
    def __tablename__(self) -> str:
        """Automatically generate table names based on class names."""
        return resolve_table_name(self.__name__)

    @classmethod
    async def get(cls: Type[T], session: AsyncSession, ident: Any, **kwargs) -> Union[T, None]:
        """Retrieve a record by its primary key."""
        return await session.get(cls, ident, **kwargs)

    @classmethod
    async def all(cls: Type[T], session: AsyncSession, **kwargs) -> list[T]:
        """Retrieve all records matching the given conditions."""
        result = await session.execute(select(cls).filter_by(**kwargs))
        return result.scalars().all()

    @classmethod
    async def exists(cls: Type[T], session: AsyncSession, **kwargs) -> bool:
        """Check if any record exists matching the given conditions."""
        result = await session.execute(select(func.count()).filter_by(**kwargs))
        return result.scalar() > 0

    @classmethod
    async def first(cls: Type[T], session: AsyncSession, **kwargs) -> Union[T, None]:
        """Retrieve the first record matching the given conditions."""
        result = await session.scalars(select(cls).filter_by(**kwargs).limit(1))
        return result.first()

    @classmethod
    async def delete_by(cls: Type[T], session: AsyncSession, **kwargs) -> int:
        """Delete records matching the given conditions."""
        stmt = delete(cls).filter_by(**kwargs)
        result = await session.execute(stmt)
        await session.commit()
        return result.rowcount

    @classmethod
    async def bulk_insert(cls: Type[T], session: AsyncSession, objs: list[dict[str, Any]]) -> None:
        """Insert multiple records in bulk."""
        await session.execute(insert(cls).values(objs))
        await session.commit()

    @classmethod
    async def update_by(
        cls: Type[T], session: AsyncSession, updates: dict[str, Any], **kwargs
    ) -> int:
        """Update records matching the given conditions."""
        stmt = update(cls).filter_by(**kwargs).values(updates)
        result = await session.execute(stmt)
        await session.commit()
        return result.rowcount

    @classmethod
    async def bulk_update(cls: Type[T], session: AsyncSession, objs: list[T]) -> None:
        """Bulk update records by adding them to the session."""
        for obj in objs:
            session.add(obj)
        await session.commit()

    def to_dict(self) -> dict[str, Any]:
        """Convert the current instance into a dictionary."""
        return {col: getattr(self, col) for col in self.__table__.columns}

    async def save(self, session: AsyncSession) -> None:
        """Save the current instance to the database."""
        session.add(self)
        await session.commit()

    async def delete(self, session: AsyncSession) -> None:
        """Delete the current instance from the database."""
        await session.delete(self)
        await session.commit()

    def update(self, updates: dict[str, Any]) -> None:
        """Update the current instance with the given dictionary of updates."""
        for key, value in updates.items():
            if hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def select(cls: Type[T]) -> Select[T]:
        """Return a SQLAlchemy Select statement for the model."""
        return select(cls)

    @classmethod
    def get_column_names(cls) -> list[str]:
        """Retrieve all column names for the model."""
        return cls.__table__.columns.keys()

    @property
    def column_names(self) -> list[str]:
        """Retrieve column names for the current instance."""
        return self.__class__.get_column_names()


class DBModelMixin(Generic[ID]):
    """
    Mixin class for models, providing default fields like ID, created_at, and updated_at.
    """

    id: Mapped[ID]
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    updated_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc).replace(tzinfo=None), 
        onupdate=lambda: datetime.now(timezone.utc).replace(tzinfo=None)
    )

    def refresh_updated_at(self) -> None:
        """Manually refresh the updated_at field to the current timestamp."""
        self.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
        
        
class DBIntIDModelMixin(DBModelMixin[int]):
    """
    Model implementation using an auto-incrementing integer as the primary key ID.
    """
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)


class DBUUIDIDModelMixin(DBModelMixin[uuid.UUID]):
    """
    Model implementation using a UUID as the primary key ID.
    """
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)