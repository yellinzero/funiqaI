import enum
from datetime import datetime, timezone

from sqlalchemy import JSON, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import DBBase, DBUUIDIDModelMixin
from utils.security import hash_password, verify_password

# ---------- Enums ----------


class AccountStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    INACTIVE = "inactive"
    DISABLED = "disabled"


class TenantUserRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    GUEST = "guest"


class TenantInviteStatus(str, enum.Enum):
    PENDING = "pending"
    EXPIRED = "expired"
    USED = "used"


class OAuthProviderName(str, enum.Enum):
    GOOGLE = "google"
    GITHUB = "github"


# ---------- Models ----------


class Account(DBBase, DBUUIDIDModelMixin):
    """
    Account stores global authentication information.
    """

    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[AccountStatus] = mapped_column(String(50), default=AccountStatus.ACTIVE)
    last_login_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
    last_login_ip: Mapped[str | None] = mapped_column(String(255))
    language: Mapped[str | None] = mapped_column(String(50))
    last_login_tenant_id: Mapped[str | None] = mapped_column(ForeignKey("tenants.id"))

    oauth_providers: Mapped[list["OAuthProvider"]] = relationship(
        "OAuthProvider", back_populates="account", cascade="all, delete-orphan"
    )
    users: Mapped[list["User"]] = relationship("User", back_populates="account", cascade="all, delete-orphan")
    last_login_tenant: Mapped["Tenant | None"] = relationship("Tenant", foreign_keys=[last_login_tenant_id])

    def set_password(self, password: str):
        """Hash and set the password."""
        self.password_hash = hash_password(password)

    def verify_password(self, password: str) -> bool:
        """Verify the given password."""
        if not self.password_hash:
            return False
        return verify_password(plain_password=password, hashed_password=self.password_hash)


class Tenant(DBBase, DBUUIDIDModelMixin):
    """
    Tenant represents a customer or organization.
    """

    name: Mapped[str] = mapped_column(String(255))
    logo: Mapped[str | None] = mapped_column(String(2048))  # Tenant logo (URL)
    users: Mapped[list["User"]] = relationship("User", back_populates="tenant", cascade="all, delete-orphan")
    invites: Mapped[list["TenantInvite"]] = relationship(
        "TenantInvite", back_populates="tenant", cascade="all, delete-orphan"
    )

    def get_user_role(self, account_id: str) -> TenantUserRole | None:
        for user in self.users:
            if user.account_id == account_id:
                return user.role
        return None


class User(DBBase, DBUUIDIDModelMixin):
    """
    User represents an account's identity within a specific tenant.
    """

    account_id: Mapped[str] = mapped_column(ForeignKey("accounts.id"), nullable=False)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id"), nullable=False)
    role: Mapped[TenantUserRole] = mapped_column(String(50), default=TenantUserRole.MEMBER)
    avatar: Mapped[str | None] = mapped_column(String(2048))  # User avatar (URL)
    invite_code: Mapped[str | None] = mapped_column(ForeignKey("tenant_invites.code"), nullable=True)

    account: Mapped["Account"] = relationship("Account", back_populates="users")
    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="users")
    invite: Mapped["TenantInvite | None"] = relationship("TenantInvite", foreign_keys=[invite_code])

    __table_args__ = (UniqueConstraint("account_id", "tenant_id", name="unique_user_key"),)

    @property
    def is_owner(self) -> bool:
        return self.role == TenantUserRole.OWNER
    
    @property
    def is_admin(self) -> bool:
        return self.role in (TenantUserRole.OWNER, TenantUserRole.ADMIN)


class OAuthProvider(DBBase, DBUUIDIDModelMixin):
    """
    OAuth provider links an account to external OAuth authentication providers.
    """

    provider_name: Mapped[OAuthProviderName] = mapped_column(
        String(50), nullable=False, index=True
    )
    provider_id: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    access_token: Mapped[str] = mapped_column(String(2048))
    refresh_token: Mapped[str | None] = mapped_column(String(2048))
    profile_data: Mapped[dict | None] = mapped_column(JSON)
    account_id: Mapped[str] = mapped_column(
        ForeignKey("accounts.id"), nullable=False
    )

    account: Mapped["Account"] = relationship(
        "Account", back_populates="oauth_providers"
    )

    __table_args__ = (
        UniqueConstraint(
            "provider_name", "provider_id", 
            name="unique_oauth_key"
        ),
    )


class TenantInvite(DBBase, DBUUIDIDModelMixin):
    """
    TenantInvite represents an invitation code generated by tenant users.
    """

    code: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id"), nullable=False)
    inviter_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column()
    used_at: Mapped[datetime | None] = mapped_column()
    status: Mapped[TenantInviteStatus] = mapped_column(String(50), default=TenantInviteStatus.PENDING, nullable=False)

    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="invites")
    inviter: Mapped["User"] = relationship("User", foreign_keys=[inviter_id])
