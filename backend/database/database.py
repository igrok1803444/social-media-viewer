from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URL or not DB_NAME:
    raise Exception("MONGO_URL and DB_NAME must be set")

try:
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


async def setup_indexes():
    try:
        await db["users"].create_index("email", unique=True)
        await db["telegram_sessions"].create_index("session_name", unique=True)

        print("Pinged your deployment. You successfully connected to MongoDB!")
        print("Indexes ensured.")
    except Exception as e:
        print("MongoDB error:", e)
