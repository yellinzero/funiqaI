
from pydantic import BaseModel, EmailStr

from app.models.user import AccountStatus


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    language: str | None = None
    invite_code: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    language: str | None = None


class SignupResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    status: AccountStatus
    tenant_id: str


class LoginResponse(BaseModel):
    access_token: str