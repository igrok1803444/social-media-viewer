from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

import jwt
import os

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")

def set_token(id:str):
    token = jwt.encode({"sub": id, "exp": datetime.now(timezone.utc) + timedelta(hours=1)}, JWT_SECRET)
    return token