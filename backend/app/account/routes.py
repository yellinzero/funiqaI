from fastapi import APIRouter, Request
from fastapi_async_sqlalchemy import db

from app.schemas import ResponseModel
from utils.security import get_account_id_from_request

from .schemas import (
    AccountResponse,
    TenantCreateRequest,
    TenantResponse,
    TenantUpdateRequest,
    UserAddRequest,
    UserResponse,
    UserRoleUpdateRequest,
)
from .service.account_service import AccountService
from .service.tenant_service import TenantService

account_router = APIRouter(prefix="/account", tags=["Account"])


# Account management routes
@account_router.get("/me", response_model=ResponseModel[AccountResponse])
async def get_account_info(request: Request):
    tenant_id = request.state.tenant_id
    account = await AccountService.get_account_info(db.session, request)
    user = await TenantService.get_user_by_account_id(db.session, tenant_id, account.id)
    
    return ResponseModel(data={
        "id": str(account.id),
        "email": account.email,
        "name": account.name,
        "language": account.language,
        "status": account.status,
        "last_login_at": account.last_login_at.isoformat() if account.last_login_at else None,
        "last_login_ip": account.last_login_ip,
        "role": user.role,
        "avatar": user.avatar,
    })


@account_router.get("/tenants", response_model=ResponseModel[list[TenantResponse]])
async def get_account_tenants(request: Request):
    account_id = get_account_id_from_request(request)
    tenants = await AccountService.get_account_tenants(db.session, account_id)
    return ResponseModel(data=tenants)


# Tenant routes
@account_router.post("/tenants", response_model=ResponseModel[TenantResponse])
async def create_tenant(payload: TenantCreateRequest, request: Request):
    account_id = get_account_id_from_request(request)
    tenant = await TenantService.create_tenant(session=db.session, name=payload.name, account_id=account_id)
    return ResponseModel(data=tenant)


@account_router.put("/tenants/{tenant_id}", response_model=ResponseModel[TenantResponse])
async def update_tenant(tenant_id: str, payload: TenantUpdateRequest, request: Request):
    account_id = get_account_id_from_request(request)
    tenant = await TenantService.update_tenant(
        session=db.session, tenant_id=tenant_id, account_id=account_id, name=payload.name
    )
    return ResponseModel(data=tenant)


@account_router.delete("/tenants/{tenant_id}", response_model=ResponseModel)
async def delete_tenant(tenant_id: str, request: Request):
    account_id = get_account_id_from_request(request)
    await TenantService.delete_tenant(db.session, tenant_id, account_id)
    return ResponseModel(data={"status": "success"})


# User management routes
@account_router.post("/tenants/{tenant_id}/users", response_model=ResponseModel[UserResponse])
async def add_tenant_user(tenant_id: str, payload: UserAddRequest, request: Request):
    account_id = get_account_id_from_request(request)
    user = await TenantService.add_user(
        session=db.session, tenant_id=tenant_id, account_id=account_id, new_user_email=payload.email, role=payload.role
    )
    return ResponseModel(data=user)


@account_router.put("/tenants/{tenant_id}/users/{user_id}", response_model=ResponseModel[UserResponse])
async def update_user_role(tenant_id: str, user_id: str, payload: UserRoleUpdateRequest, request: Request):
    account_id = get_account_id_from_request(request)
    user = await TenantService.update_user_role(
        session=db.session, tenant_id=tenant_id, account_id=account_id, target_user_id=user_id, new_role=payload.role
    )
    return ResponseModel(data=user)


@account_router.delete("/tenants/{tenant_id}/users/{user_id}", response_model=ResponseModel)
async def remove_tenant_user(tenant_id: str, user_id: str, request: Request):
    account_id = get_account_id_from_request(request)
    await TenantService.remove_user(
        session=db.session, tenant_id=tenant_id, account_id=account_id, target_user_id=user_id
    )
    return ResponseModel(data={"status": "success"})
