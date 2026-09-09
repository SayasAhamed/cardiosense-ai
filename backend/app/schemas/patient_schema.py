from pydantic import BaseModel, EmailStr
from typing import Optional

class PatientBase(BaseModel):
    full_name: str
    age: int
    gender: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int

    class Config:
        from_attributes = True