from pydantic import BaseModel, EmailStr, StringConstraints
from typing import Annotated


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=6)]


class UserLogin(BaseModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=6)]
