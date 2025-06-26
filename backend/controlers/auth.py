from fastapi import HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from database.database import db
from models.user_models import UserCreate, UserLogin
from pymongo.errors import DuplicateKeyError
from pymongo import ReturnDocument
from helpers.tokens import (
    decode_token,
    decode_refresh_token,
    set_access_token,
    set_refresh_token,
)
from helpers.passwords import hash_password, match_password
from bson import ObjectId

security = HTTPBearer()


async def register_user(user: UserCreate):
    user.password = hash_password(user.password)
    try:
        response = await db["users"].insert_one(user.model_dump())
        access_token = set_access_token(response.inserted_id)
        refresh_token = set_refresh_token(response.inserted_id)
        update_response = await db["users"].find_one_and_update(
            {"_id": response.inserted_id},
            {"$set": {"access_token": access_token, "refresh_token": refresh_token}},
            return_document=ReturnDocument.AFTER,
        )
        update_response["_id"] = str(update_response["_id"])
        update_response.pop("password", None)
        update_response.pop("access_token", None)
        update_response.pop("refresh_token", None)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": update_response,
        }
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")


async def login_user(user: UserLogin):
    response = await db["users"].find_one({"email": user.email})
    if not response:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not await match_password(user.password, response["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id = str(response["_id"])
    access_token = set_access_token(user_id)
    refresh_token = set_refresh_token(user_id)
    await db["users"].find_one_and_update(
        {"_id": response["_id"]},
        {"$set": {"access_token": access_token, "refresh_token": refresh_token}},
    )
    response["_id"] = user_id
    response.pop("access_token", None)
    response.pop("refresh_token", None)
    response.pop("password", None)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": response,
    }


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    user_id = decode_token(token)
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user or user.get("access_token") != token:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    user.pop("access_token", None)
    user.pop("refresh_token", None)
    return user


async def refresh_token(old_refresh_token: str):
    if not old_refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token missing")
    user_id = decode_refresh_token(old_refresh_token)
    new_access_token = set_access_token(user_id)
    await db["users"].find_one_and_update(
        {
            "_id": ObjectId(user_id),
            "access_token": {"$ne": None},
            "refresh_token": {"$ne": None},
        },
        {
            "$set": {
                "access_token": new_access_token,
            }
        },
    )
    return {
        "access_token": new_access_token,
        "refresh_token": old_refresh_token,
        "token_type": "bearer",
    }


async def logout_user(token: str):
    user_id = decode_token(token)
    response = await db["users"].find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": {"access_token": None, "refresh_token": None}},
        return_document=ReturnDocument.AFTER,
    )
    if not response:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Logout successful"}
