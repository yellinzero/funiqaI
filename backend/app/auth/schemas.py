
from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    language: str = 'en'
    invite_code: str | None = None
    

class ActivateAccountRequest(BaseModel):
    email: str
    language: str = 'en'


class SignupVerifyRequest(BaseModel):
    token: str
    code: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    language: str = 'en'


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
    