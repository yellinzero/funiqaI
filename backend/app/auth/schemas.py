
from pydantic import BaseModel, EmailStr

from ..user.models import AccountStatus


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    tenant_name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupResponse(BaseModel):
    id: str
    email: EmailStr
    status: AccountStatus


class LoginResponse(BaseModel):
    access_token: str