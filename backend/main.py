from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from auth import  login_user, register_user, refresh_current_user, logout_user
from telegram_client import connect_telegram, get_chats, get_messages, disconnect
from models.user_models import UserCreate, UserLogin


from dotenv import load_dotenv


load_dotenv()


app = FastAPI()

security = HTTPBearer()

origins = ["http://localhost:5173"] # React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
async def register(data: UserCreate):
    return await register_user(data)

@app.post("/login")
async def login(data: UserLogin ):
    return await login_user(data)

@app.post("/refresh")
async def refresh_user(token=Depends(security)):
    return await refresh_current_user(token.credentials)
    # return current_user_id

@app.post("/logout")
async def protected_route(token=Depends(security)):
    return await logout_user(token.credentials)

# @app.post("/telegram/connect")
# async def connect(current_user=Depends(get_current_user)):
#     return await connect_telegram(current_user)

# @app.get("/telegram/chats")
# async def chats(current_user=Depends(get_current_user)):
#     return await get_chats(current_user)

# @app.get("/telegram/messages/{chat_id}")
# async def messages(chat_id: int, current_user=Depends(get_current_user)):
#     return await get_messages(current_user, chat_id)

# @app.post("/telegram/disconnect")
# async def logout(current_user=Depends(get_current_user)):
#     return await disconnect(current_user)