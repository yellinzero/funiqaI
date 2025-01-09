from fastapi import status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.account.schemas import TenantResponse, UserResponse
from app.errors.account import AccountErrorCode
from app.errors.common import CommonErrorCode
from app.models.account import Account, Tenant, TenantUserRole, User


class TenantService:
    """Service for managing tenants and tenant users"""

    # region Tenant Management
    @staticmethod
    async def create_tenant(
        session: AsyncSession,
        name: str,
        account_id: str,
    ) -> TenantResponse:
        """Create a new tenant and set the creator as owner."""
        # Create tenant
        tenant = Tenant(name=name)
        await tenant.save(session)

        # Create user entry for the creator as owner
        user = User(account_id=account_id, tenant_id=tenant.id, role=TenantUserRole.OWNER)
        await user.save(session)

        return TenantResponse(
            id=str(tenant.id),
            name=tenant.name
        )

    @staticmethod
    async def get_tenant(session: AsyncSession, tenant_id: str) -> Tenant:
        """Get tenant by ID."""
        result = await session.execute(select(Tenant).where(Tenant.id == tenant_id))
        tenant = result.scalars().one_or_none()
        if not tenant:
            raise AccountErrorCode.TENANT_NOT_FOUND.exception(
                data={"tenant_id": tenant_id}, status_code=status.HTTP_404_NOT_FOUND
            )
        return tenant

    @staticmethod
    async def update_tenant(session: AsyncSession, tenant_id: str, account_id: str, name: str) -> TenantResponse:
        """Update tenant details."""
        # Check permissions
        user = await TenantService.get_user_role(session, tenant_id, account_id)
        if user.role not in [TenantUserRole.OWNER, TenantUserRole.ADMIN]:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Update tenant
        tenant = await TenantService.get_tenant(session, tenant_id)
        tenant.name = name
        await tenant.save(session)
        return TenantResponse(
            id=str(tenant.id),
            name=tenant.name
        )

    @staticmethod
    async def delete_tenant(session: AsyncSession, tenant_id: str, account_id: str) -> None:
        """Delete a tenant."""
        # Only owner can delete tenant
        user = await TenantService.get_user_role(session, tenant_id, account_id)
        if user.role != TenantUserRole.OWNER:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Delete tenant (cascade will handle users)
        tenant = await TenantService.get_tenant(session, tenant_id)
        await session.delete(tenant)
        await session.commit()

    # endregion

    # region User Management
    @staticmethod
    async def get_user_role(session: AsyncSession, tenant_id: str, account_id: str) -> User:
        """Get user's role in tenant."""
        result = await session.execute(select(User).where(User.tenant_id == tenant_id, User.account_id == account_id))
        user = result.scalars().one_or_none()
        if not user:
            raise AccountErrorCode.USER_NOT_IN_TENANT.exception(
                data={"tenant_id": tenant_id}, status_code=status.HTTP_404_NOT_FOUND
            )
        return user

    @staticmethod
    async def add_user(
        session: AsyncSession,
        tenant_id: str,
        account_id: str,
        new_user_email: str,
        role: TenantUserRole = TenantUserRole.MEMBER,
    ) -> UserResponse:
        """Add a user to tenant."""
        # Only owner/admin can add users
        user = await TenantService.get_user_role(session, tenant_id, account_id)
        if user.role not in [TenantUserRole.OWNER, TenantUserRole.ADMIN]:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Only owner can add admin
        if role == TenantUserRole.ADMIN and user.role != TenantUserRole.OWNER:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Find account by email
        result = await session.execute(select(Account).where(Account.email == new_user_email))
        account = result.scalars().one_or_none()
        if not account:
            raise AccountErrorCode.EMAIL_NOT_REGISTERED.exception(
                data={"email": new_user_email}, status_code=status.HTTP_404_NOT_FOUND
            )

        # Check if user already exists in tenant
        result = await session.execute(select(User).where(User.tenant_id == tenant_id, User.account_id == account.id))
        if result.scalars().one_or_none():
            raise AccountErrorCode.USER_ALREADY_IN_TENANT.exception(
                data={"email": new_user_email}, status_code=status.HTTP_400_BAD_REQUEST
            )

        # Create new user
        new_user = User(account_id=account.id, tenant_id=tenant_id, role=role)
        await new_user.save(session)
        return UserResponse(
            id=str(new_user.id),
            account_id=str(new_user.account_id),
            tenant_id=str(new_user.tenant_id),
            role=new_user.role
        )

    @staticmethod
    async def update_user_role(
        session: AsyncSession, tenant_id: str, account_id: str, target_user_id: str, new_role: TenantUserRole
    ) -> UserResponse:
        """Update user's role in tenant."""
        # Only owner/admin can update roles
        user = await TenantService.get_user_role(session, tenant_id, account_id)
        if user.role not in [TenantUserRole.OWNER, TenantUserRole.ADMIN]:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Get target user
        result = await session.execute(select(User).where(User.tenant_id == tenant_id, User.id == target_user_id))
        target_user = result.scalars().one_or_none()
        if not target_user:
            raise AccountErrorCode.USER_NOT_IN_TENANT.exception(
                data={"user_id": target_user_id}, status_code=status.HTTP_404_NOT_FOUND
            )

        # Admin cannot modify owner or other admin roles
        if user.role == TenantUserRole.ADMIN:
            if target_user.role in [TenantUserRole.OWNER, TenantUserRole.ADMIN] or new_role in [
                TenantUserRole.OWNER,
                TenantUserRole.ADMIN,
            ]:
                raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Update role
        target_user.role = new_role
        await target_user.save(session)
        return UserResponse(
            id=str(target_user.id),
            account_id=str(target_user.account_id),
            tenant_id=str(target_user.tenant_id),
            role=target_user.role
        )

    @staticmethod
    async def remove_user(session: AsyncSession, tenant_id: str, account_id: str, target_user_id: str) -> None:
        """Remove a user from tenant."""
        # Only owner/admin can remove users
        user = await TenantService.get_user_role(session, tenant_id, account_id)
        if user.role not in [TenantUserRole.OWNER, TenantUserRole.ADMIN]:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Get target user
        result = await session.execute(select(User).where(User.tenant_id == tenant_id, User.id == target_user_id))
        target_user = result.scalars().one_or_none()
        if not target_user:
            raise AccountErrorCode.USER_NOT_IN_TENANT.exception(
                data={"user_id": target_user_id}, status_code=status.HTTP_404_NOT_FOUND
            )

        # Admin cannot remove owner or other admin
        if user.role == TenantUserRole.ADMIN and target_user.role in [TenantUserRole.OWNER, TenantUserRole.ADMIN]:
            raise CommonErrorCode.PERMISSION_DENIED.exception(status_code=status.HTTP_403_FORBIDDEN)

        # Cannot remove the last owner
        if target_user.role == TenantUserRole.OWNER:
            result = await session.execute(
                select(User).where(User.tenant_id == tenant_id, User.role == TenantUserRole.OWNER)
            )
            owners = result.scalars().all()
            if len(owners) <= 1:
                raise AccountErrorCode.CANNOT_REMOVE_LAST_OWNER.exception(status_code=status.HTTP_400_BAD_REQUEST)

        # Remove user
        await session.delete(target_user)
        await session.commit()
        # endregion
