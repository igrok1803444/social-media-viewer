from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from controlers.auth import (
    login_user,
    register_user,
    refresh_token,
    logout_user,
)
from models.user_models import UserCreate, UserLogin


router = APIRouter(prefix="/users", tags=["Users"])

security = HTTPBearer()


@router.post("/register")
async def register(data: UserCreate):
    return await register_user(data)


@router.post("/login")
async def login(data: UserLogin):
    return await login_user(data)


@router.post("/refresh")
async def set_new_refresh_token(
    token: HTTPAuthorizationCredentials = Depends(security),
):
    return await refresh_token(token.credentials)


@router.post("/logout")
async def protected_route(token: HTTPAuthorizationCredentials = Depends(security)):
    return await logout_user(token.credentials)
