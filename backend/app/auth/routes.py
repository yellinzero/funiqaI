
from fastapi import APIRouter
from fastapi_async_sqlalchemy import db

from app.schemas import ResponseModel
from app.user.service import AccountService

from .schemas import LoginRequest, LoginResponse, SignupRequest, SignupResponse

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


@auth_router.post("/signup", response_model=ResponseModel[SignupResponse])
async def signup(payload: SignupRequest):
    account = await AccountService.signup(db.session, payload)
    return ResponseModel(data={"id": account.id, "email": account.email, "status": account.status})


@auth_router.post("/login", response_model=ResponseModel[LoginResponse])
async def login(payload: LoginRequest):
    token = await AccountService.login(db.session, payload)
    return ResponseModel(data={"access_token": token})
