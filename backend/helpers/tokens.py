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


def set_access_token(user_id: str):
    access_token = jwt.encode(
        {
            "sub": user_id,
            "exp": datetime.now(timezone.utc) + timedelta(days=1),
        },
        JWT_SECRET,
        algorithm=ALGORITHM,
    )
    return access_token


def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
