
from fastapi import APIRouter, Request
from fastapi_async_sqlalchemy import db

from app.schemas import ResponseModel
from app.user.service import AccountService

from .schemas import (
    ActivateAccountRequest,
    ActivateAccountResponse,
    LoginRequest,
    SignInResponse,
    SignupRequest,
    SignupResponse,
    SignupVerifyRequest,
    SignupVerifyResponse,
)

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


@auth_router.post("/signup", response_model=ResponseModel[SignupResponse])
async def signup(payload: SignupRequest, request: Request):
    token = await AccountService.signup(db.session, payload, request)
    return ResponseModel(data={"token": token})


@auth_router.post("/login", response_model=ResponseModel[SignInResponse])
async def login(payload: LoginRequest, request: Request):
    token = await AccountService.login(db.session, payload, request)
    return ResponseModel(data={"access_token": token})


@auth_router.post("/signup_verify", response_model=ResponseModel[SignupVerifyResponse])
async def signup_verify(payload: SignupVerifyRequest, request: Request):
    token = await AccountService.sign_up_email_verify(db.session, payload, request)
    return ResponseModel(data={"access_token": token})


@auth_router.post("/activate_account", response_model=ResponseModel[ActivateAccountResponse])
async def activate_account(payload: ActivateAccountRequest):
    token = await AccountService.activate_account(db.session, payload)
    return ResponseModel(data={"token": token})