
from fastapi import APIRouter
from fastapi_async_sqlalchemy import db

from app.user.schemas import AccountResponse, LoginRequest, LoginResponse, SignupRequest
from app.user.service import AccountService

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


@auth_router.post("/signup", response_model=AccountResponse)
async def signup(payload: SignupRequest):
    account = await AccountService.signup(db.session, payload)
    return AccountResponse(id=account.id, email=account.email, status=account.status)


@auth_router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    token = await AccountService.login(db.session, payload)
    return LoginResponse(access_token=token)
