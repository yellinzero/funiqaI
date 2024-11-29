import enum

import bcrypt
from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import DBBase, DBModelMixin

# ---------- Enums ----------


class AccountStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    INACTIVE = "active"
    DISABLED = "disabled"


class TenantUserRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    GUEST = "guest"


class InvitationStatus(str, enum.Enum):
    UNUSED = "unused"
    USED = "used"
    EXPIRED = "expired"


# ---------- Models ----------


class Account(DBBase, DBModelMixin):
    """
    Account stores global authentication information.
    """
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[AccountStatus] = mapped_column(String(50), default=AccountStatus.ACTIVE)
    users: Mapped[list["User"]] = relationship("User", back_populates="account", cascade="all, delete-orphan")

    def set_password(self, password: str):
        """Hash and set the password."""
        self.password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def verify_password(self, password: str) -> bool:
        """Verify the given password."""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode(), self.password_hash.encode())


class Tenant(DBBase, DBModelMixin):
    """
    Tenant represents a customer or organization.
    """
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    users: Mapped[list["User"]] = relationship("User", back_populates="tenant", cascade="all, delete-orphan")


class User(DBBase, DBModelMixin):
    """
    User represents an account's identity within a specific tenant.
    """

    account_id: Mapped[str] = mapped_column(ForeignKey("accounts.id"), nullable=False)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id"), nullable=False)
    role: Mapped[TenantUserRole] = mapped_column(String(50), default=TenantUserRole.MEMBER)
    avatar: Mapped[str | None] = mapped_column(String(2048))  # User avatar (URL)
    language: Mapped[str | None] = mapped_column(String(50))

    account: Mapped["Account"] = relationship("Account", back_populates="users")
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="users")

    __table_args__ = (
        UniqueConstraint("account_id", "tenant_id", name="unique_account_tenant"),
    )