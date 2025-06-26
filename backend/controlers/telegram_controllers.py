from pyrogram import Client
from pyrogram.errors import (
    SessionPasswordNeeded,
)
from dotenv import load_dotenv
from helpers.encryption import encrypt_string, decrypt_string
from database.database import db
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError
from models.telegram_models import Connect, VerifyCode
from helpers.find_session_name import find_session_name

import os
import secrets

load_dotenv()
API_ID = os.getenv("API_ID")
API_HASH = os.getenv("API_HASH")

clients = {}


async def connect(user_id: str, body: Connect):
    session_name = body.session_name or f"tg_{secrets.token_hex(6)}"
    phone_number = body.phone_number
    if not phone_number:
        raise HTTPException(status_code=400, detail="Phone is required")
    key = f"{user_id}:{session_name}"
    try:
        await db["telegram_sessions"].insert_one(
            {
                "user_id": user_id,
                "session_name": session_name,
                "session": None,
                "status": "pending",
            }
        )
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Session name already registered")
    client = Client(session_name, api_id=API_ID, api_hash=API_HASH)
    await client.connect()
    try:
        response = await client.send_code(phone_number)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    clients[key] = client

    return {
        "status": "code_sent",
        "session_name": session_name,
        "phone_code_hash": response.phone_code_hash,
    }


async def verify_code(user_id: str, data: VerifyCode):
    phone_number = data.phone_number
    phone_code = data.phone_code
    phone_code_hash = data.phone_code_hash
    session_name = data.session_name
    if not phone_number or not phone_code or not phone_code_hash:
        raise HTTPException(
            status_code=400, detail="Phone, phone code hash and phone_code are required"
        )
    if not session_name:
        session_name = await find_session_name(user_id)

    key = f"{user_id}:{session_name}"
    client = clients.get(key) or clients.get(session_name)
    if not client:
        raise HTTPException(status_code=404, detail="No session found")
    try:
        await client.sign_in(phone_number, phone_code_hash, phone_code)
    except SessionPasswordNeeded:
        raise HTTPException(status_code=400, detail="2FA enabled, password required")
    session_string = await client.export_session_string()
    encrypted = encrypt_string(session_string)
    await db["telegram_sessions"].find_one_and_update(
        {"user_id": user_id, "session_name": session_name},
        {"$set": {"session": encrypted, "status": "connected"}},
    )
    clients[key] = client
    if session_name in clients:
        del clients[session_name]
    return {"status": "connected"}


async def get_active_client(user_id: str, session_name: str = None):
    if not session_name:
        session_name = await find_session_name(user_id)
    key = f"{user_id}:{session_name}"
    if key in clients:
        return clients[key]
    record = await db["telegram_sessions"].find_one(
        {"user_id": user_id, "session_name": session_name, "status": "connected"}
    )
    if not record or not record.get("session"):
        raise HTTPException(status_code=404, detail="No Telegram session found")
    session_string = decrypt_string(record["session"])
    client = Client(
        ":memory:",
        api_id=API_ID,
        api_hash=API_HASH,
        session_string=session_string,
    )
    await client.start()
    clients[key] = client
    return client


async def get_chats(client: Client):
    chats = []
    async for dialog in client.get_dialogs():
        chats.append(
            {
                "id": dialog.chat.id,
                "title": dialog.chat.title,
                "first_name": dialog.chat.first_name,
                "last_name": dialog.chat.last_name,
                "username ": dialog.chat.username,
            }
        )
    return chats


async def get_chat_messages(client: Client, chat_id: int):
    messages = []
    async for dialog in client.get_dialogs():
        break
    async for i in client.get_chat_history(chat_id, limit=100):
        message = {
            "id": i.id,
            "from_user": {
                "first_name": i.from_user.first_name if i.from_user else None,
                "last_name": i.from_user.last_name if i.from_user else None,
            },
            "sender_chat": {
                "title": i.sender_chat.title if i.sender_chat else None,
                "first_name": i.sender_chat.first_name if i.sender_chat else None,
                "last_name": i.sender_chat.last_name if i.sender_chat else None,
                "username ": i.sender_chat.username if i.sender_chat else None,
            },
            "text": i.text,
        }
        messages.append(message)
    return messages


async def disconnect(user_id: str, session_name: str):
    if not session_name:
        session_name = await find_session_name(user_id)

    key = f"{user_id}:{session_name}"
    client = clients.get(key)

    if client:
        try:
            if client.is_connected:
                await client.stop()
        except Exception as e:
            print(f"[INFO] Client {key} вже був зупинений")

        del clients[key]  # видаляємо в будь-якому разі

    await db["telegram_sessions"].delete_one(
        {"user_id": user_id, "session_name": session_name}
    )

    return {"status": "disconnected"}
