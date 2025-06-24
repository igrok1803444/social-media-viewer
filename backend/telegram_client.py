from pyrogram import Client
from dotenv import load_dotenv

import os

load_dotenv()
API_ID = os.getenv("API_ID")     
API_HASH = os.getenv("API_HASH") 

clients = {}

async def connect_telegram(username):
    client = Client(username, api_id=API_ID, api_hash=API_HASH)
    await client.start()
   
    clients[username] = client
    return {"status": "connected"}

async def get_chats(username):
    client = clients.get(username)
    chats = []
    async for dialog in client.get_dialogs():
        chats.append({"id": dialog.chat.id, "title": dialog.chat.title, "first_name": dialog.chat.first_name,"last_name": dialog.chat.last_name})
    return chats

async def get_messages(username, chat_id):
    client = clients.get(username)
    messages = []
    async for msg in client.get_chat_history(chat_id, limit=50):
        messages.append({"id": msg.id, "text": msg.text})
    return messages

async def disconnect(username):
    client = clients.get(username)
        
    await client.stop()
    del clients[username]
    return {"status": "disconnected"}

