from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user, login_user, register_user
from telegram_client import connect_telegram, get_chats, get_messages, disconnect
from models.user_models import UserCreate, UserLogin

from dotenv import load_dotenv


load_dotenv()


app = FastAPI()

origins = ["http://localhost:3000"]  # React dev server
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

@app.post("/telegram/connect")
async def connect(current_user=Depends(get_current_user)):
    return await connect_telegram(current_user)

@app.get("/telegram/chats")
async def chats(current_user=Depends(get_current_user)):
    return await get_chats(current_user)

@app.get("/telegram/messages/{chat_id}")
async def messages(chat_id: int, current_user=Depends(get_current_user)):
    return await get_messages(current_user, chat_id)

@app.post("/telegram/disconnect")
async def logout(current_user=Depends(get_current_user)):
    return await disconnect(current_user)