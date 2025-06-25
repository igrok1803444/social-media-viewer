from fastapi import Depends, HTTPException
from database.database import db
from models.user_models import UserCreate, UserLogin
from pymongo.errors import DuplicateKeyError
from helpers.tokens import set_token, decode_token
from helpers.passwords import hash_password, match_password
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="yuyt")

async def register_user (user: UserCreate):
    user.password = hash_password(user.password)
    try:
        response = await db['users'].insert_one(user.model_dump())
        token = set_token(str(response.inserted_id))
        update_response = await db["users"].find_one_and_update({"_id": response.inserted_id}, {"$set": {"token": token}})
        update_response["_id"] = str(update_response["_id"])
        update_response.pop("password", None)

        return {"access_token": token, "token_type": "bearer", "user": update_response }    
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")

async def login_user(user: UserLogin):
    response = await db['users'].find_one({"email": user.email})
    if not response:
        raise HTTPException(status_code=401, detail="Invalid credentials")   
    if not await match_password(user.password, response["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials") 
    user_id = str(response["_id"])
    token = set_token(user_id)
    await db["users"].find_one_and_update({"_id": response["_id"]}, {"$set": {"token": token}})
    response["_id"] = user_id
    response.pop("token", None)
    response.pop("password", None)
    return {"access_token": token, "token_type": "bearer", "user":response}    
    
async def refresh_current_user(token: str):
    user_id = decode_token(token)
    current_user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not current_user or current_user.get("token") != token:
        raise HTTPException(status_code=401, detail="Token revoked or invalid")
    token = set_token(user_id)
    response = await db["users"].find_one_and_update({"_id": ObjectId(user_id)}, {"$set": {"token": token}}, return_document=True)
    if not response:
        raise HTTPException(status_code=401, detail="Invalid token")
    response["_id"] = str(response["_id"])
    response.pop("token", None)
    response.pop("password", None)
    return {"access_token": token, "token_type": "bearer", "user":response} 

async def logout_user(token: str):
    user_id = decode_token(token)
    response = await db["users"].find_one_and_update({"_id": ObjectId(user_id)}, {"$set": {"token": None}}, return_document=True)
    if not response:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Logout successful"}