from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):

    full_name: str
    email: str
    password: str
    role: str

# =========================
# LOGIN
# =========================

class UserLogin(BaseModel):

    email: EmailStr

    password: str


# =========================
# CREATE USER
# =========================

class UserCreate(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    role: str


# =========================
# RESPONSE
# =========================

class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: str

    is_active: bool

    class Config:

        from_attributes = True