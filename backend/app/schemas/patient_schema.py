from pydantic import BaseModel

# =========================
# CREATE PATIENT
# =========================

class PatientCreate(BaseModel):

    full_name: str
    age: int
    gender: str
    phone: str
    address: str

# =========================
# RESPONSE
# =========================

class PatientResponse(PatientCreate):

    id: int

    class Config:
        from_attributes = True