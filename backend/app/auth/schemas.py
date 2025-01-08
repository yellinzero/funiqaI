from pydantic import BaseModel, EmailStr

from app.models.user import AccountStatus
from utils.token_manager import AccountTokenType


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    language: str | None = None
    invite_code: str | None = None
    

class ActivateAccountRequest(BaseModel):
    email: str
    language: str | None = None


class SignupVerifyRequest(BaseModel):
    token: str
    code: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    language: str | None = None


class SignupResponse(BaseModel):
    token: str
    
    
class ActivateAccountResponse(BaseModel):
    token: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    

class SignupVerifyResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    code: str
    new_password: str


class ResetPasswordResponse(BaseModel):
    access_token: str
    

class ResendVerificationCodeRequest(BaseModel):
    email: EmailStr
    code_type: AccountTokenType


class ResendVerificationCodeResponse(BaseModel):
    token: str


class ActivateAccountVerifyRequest(BaseModel):
    token: str
    code: str


class ActivateAccountVerifyResponse(BaseModel):
    access_token: str
    

class AccountInfoResponse(BaseModel):
    name: str
    email: str
    status: AccountStatus
    language: str
    last_login_at: str
    last_login_ip: str | None
