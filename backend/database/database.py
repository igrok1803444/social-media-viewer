from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

import os

load_dotenv()

MONGO_URL = os.getenv('MONGO_URL')
DB_NAME = os.getenv('DB_NAME')


try:
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)