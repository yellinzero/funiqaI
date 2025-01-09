from typing import Optional

from pydantic import BaseModel, EmailStr

from app.models.account import TenantUserRole


class TenantCreateRequest(BaseModel):
    name: str


class TenantUpdateRequest(BaseModel):
    name: str


class TenantResponse(BaseModel):
    id: str
    name: str


class UserAddRequest(BaseModel):
    email: EmailStr
    role: TenantUserRole = TenantUserRole.MEMBER


class UserRoleUpdateRequest(BaseModel):
    role: TenantUserRole


class UserResponse(BaseModel):
    id: str
    account_id: str
    tenant_id: str
    role: TenantUserRole


class AccountResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    language: str
    status: str
    last_login_at: Optional[str] = None
    last_login_ip: Optional[str] = None
