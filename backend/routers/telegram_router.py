from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth import refresh_current_user
from controlers.telegram_controllers import (
    get_chats,
    disconnect,
    connect,
    verify_code,
    sign_in_2fa,
    get_active_client,
    get_chat_messages,
)
from models.telegram_models import Connect, VerifyCode, Verify2FA

router = APIRouter(prefix="/telegram", tags=["Telegram"])

security = HTTPBearer()


@router.post("/connect")
async def telegram_send_code(
    data: Connect, token: HTTPAuthorizationCredentials = Depends(security)
):
    user = await refresh_current_user(token.credentials)
    session_connect = await connect(user["_id"], data)
    return {"session_connect": session_connect, "refresh_user": user}


@router.post("/verify-code")
async def telegram_verify_code(
    data: VerifyCode, token: HTTPAuthorizationCredentials = Depends(security)
):
    user = await refresh_current_user(token.credentials)
    status = await verify_code(user["_id"], data)
    return {"status": status["status"], "user": user}


@router.post("/sign-in-2fa")
async def telegram_sign_in_2fa(
    data: Verify2FA, token: HTTPAuthorizationCredentials = Depends(security)
):
    user = await refresh_current_user(token.credentials)
    status = await sign_in_2fa(user["_id"], data)
    return {"status": status["status"], "user": user}


@router.get("/chats")
async def telegram_chats(
    session_name: str = None, token: HTTPAuthorizationCredentials = Depends(security)
):
    user = await refresh_current_user(token.credentials)
    client = await get_active_client(user["_id"], session_name)
    chats = await get_chats(client)
    return {"chats": chats, "user": user}


@router.get("/messages/{chat_id}")
async def telegram_chat_messages(
    chat_id: int,
    session_name: str = None,
    token: HTTPAuthorizationCredentials = Depends(security),
):
    user = await refresh_current_user(token.credentials)
    client = await get_active_client(user["_id"], session_name)
    messages = await get_chat_messages(client, chat_id)
    return {"messages": messages, "user": user}


@router.post("/disconnect")
async def telegram_disconnect(session_name: str = None, token=Depends(security)):
    user = await refresh_current_user(token.credentials)
    status = await disconnect(user["_id"], session_name)
    return {"status": status["status"], "user": user}
