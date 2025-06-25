from database.database import db
from fastapi import HTTPException


async def find_session_name(user_id):
        record = await db["telegram_sessions"].find_one({"user_id": user_id})
        if not record:
            raise HTTPException(status_code=404, detail="No active Telegram session found")
        return record["session_name"]