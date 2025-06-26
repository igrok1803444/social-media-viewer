from pydantic import BaseModel, field_validator, StringConstraints
from typing import Optional, Annotated

PhoneNumber = Annotated[str, StringConstraints(min_length=8)]


class Connect(BaseModel):
    session_name: Optional[str] = None
    phone_number: PhoneNumber

    @field_validator("phone_number")
    def validate_phone(cls, v):
        if not v.startswith("+") or not v[1:].isdigit():
            raise ValueError("Phone number must start with + and contain only digits")
        return v


class VerifyCode(BaseModel):
    session_name: Optional[str] = None
    phone_number: PhoneNumber
    phone_code: Annotated[str, StringConstraints(min_length=3)]
    phone_code_hash: str

    @field_validator("phone_number")
    def validate_phone(cls, v):
        if not v.startswith("+") or not v[1:].isdigit():
            raise ValueError("Phone number must start with + and contain only digits")
        return v


class Verify2FA(BaseModel):
    session_name: Optional[str] = None
    password: Annotated[str, StringConstraints(min_length=6)]
