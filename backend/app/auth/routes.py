from fastapi import APIRouter, Request
from fastapi_async_sqlalchemy import db

from app.account.service.account_service import AccountService
from app.schemas import ResponseModel

from .schemas import (
    ActivateAccountRequest,
    ActivateAccountResponse,
    ActivateAccountVerifyRequest,
    ActivateAccountVerifyResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    ResendVerificationCodeRequest,
    ResendVerificationCodeResponse,
    ResetPasswordRequest,
    SignupRequest,
    SignupResponse,
    SignupVerifyRequest,
    SignupVerifyResponse,
)

auth_router = APIRouter(prefix="/auth", tags=["Authentication", "Public"])


@auth_router.post("/signup", response_model=ResponseModel[SignupResponse])
async def signup(payload: SignupRequest, request: Request):
    """Register a new account"""
    token = await AccountService.signup(db.session, payload, request)
    return ResponseModel(data={"token": token})


@auth_router.post("/login", response_model=ResponseModel[LoginResponse])
async def login(payload: LoginRequest, request: Request):
    """Login with email and password"""
    access_token, refresh_token, tenant_id = await AccountService.login(db.session, payload, request)
    return ResponseModel(data={
        "access_token": access_token,
        "refresh_token": refresh_token,
        "tenant_id": tenant_id
    })


@auth_router.post("/signup_verify", response_model=ResponseModel[SignupVerifyResponse])
async def signup_verify(payload: SignupVerifyRequest, request: Request):
    """Verify signup email with verification code"""
    access_token, refresh_token, tenant_id = await AccountService.sign_up_email_verify(db.session, payload, request)
    return ResponseModel(data={
        "access_token": access_token,
        "refresh_token": refresh_token,
        "tenant_id": tenant_id
    })


@auth_router.post("/activate_account", response_model=ResponseModel[ActivateAccountResponse])
async def activate_account(payload: ActivateAccountRequest):
    """Send activation email for inactive account"""
    token = await AccountService.activate_account(db.session, payload)
    return ResponseModel(data={"token": token})


@auth_router.post("/forgot_password", response_model=ResponseModel[ForgotPasswordResponse])
async def forgot_password(payload: ForgotPasswordRequest):
    """Send password reset email"""
    token = await AccountService.send_reset_password_email(db.session, payload)
    return ResponseModel(data={"token": token})


@auth_router.post("/reset_password", response_model=ResponseModel[None])
async def reset_password(payload: ResetPasswordRequest):
    """Reset password with verification code"""
    await AccountService.reset_password(db.session, payload)
    return ResponseModel(data=None)


@auth_router.post("/resend_verification_code", response_model=ResponseModel[ResendVerificationCodeResponse])
async def resend_verification_code(payload: ResendVerificationCodeRequest):
    """Resend verification code for signup/activation/password reset"""
    token = await AccountService.resend_verification_code(db.session, payload.email, payload.code_type)
    return ResponseModel(data={"token": token})


@auth_router.post("/activate_account_verify", response_model=ResponseModel[ActivateAccountVerifyResponse])
async def activate_account_verify(payload: ActivateAccountVerifyRequest, request: Request):
    """Verify account activation with verification code"""
    access_token, refresh_token, tenant_id = await AccountService.activate_account_verify(db.session, payload, request)
    return ResponseModel(data={
        "access_token": access_token,
        "refresh_token": refresh_token,
        "tenant_id": tenant_id
    })
