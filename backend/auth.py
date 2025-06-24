from fastapi import Depends, HTTPException
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from database.database import db
from models.user_models import UserCreate, UserLogin
from pymongo.errors import DuplicateKeyError
from helpers.tokens import set_token
from helpers.passwords import hash_password, match_password

import jwt
import bcrypt

SECRET = "SECRET"
ALGORITHM = "HS256"
USERS = [{"test": "password"}]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def register_user (user: UserCreate):
    user.password = hash_password(user.password)
    try:
        response = await db['users'].insert_one(user.model_dump())
        token = set_token(str(response.inserted_id))
        return {"access_token": token, "token_type": "bearer" }    
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Email already registered")

    
    


async def login_user(user: UserLogin):
    response = await db['users'].find_one({"email": user.email})
    if not response:
        raise HTTPException(status_code=401, detail="Invalid credentials")   
    if not match_password(user.password, response["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials") 
    response["_id"] = str(response["_id"])
    token = set_token(response["_id"])
    print(response)
    return {"access_token": token, "token_type": "bearer", "user":response}    
    




def get_current_user(token: str = Depends(oauth2_scheme)):  # Replace with OAuth2PasswordBearer
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        
        return payload["sub"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
