from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from dotenv import load_dotenv

import jwt
import os

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM")

if not JWT_SECRET or not ALGORITHM:
    raise Exception("JWT_SECRET and ALGORITHM must be set")


def set_token(id: str):
    token = jwt.encode(
        {"body": id, "exp": datetime.now(timezone.utc) + timedelta(hours=3)},
        JWT_SECRET,
        algorithms=[ALGORITHM],
    )
    return token


def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload.get("body")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
