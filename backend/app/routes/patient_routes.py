from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient_schema import (
    PatientCreate,
    PatientResponse
)

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

# CREATE PATIENT
@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):

    new_patient = Patient(**patient.dict())

    db.add(new_patient)

    db.commit()

    db.refresh(new_patient)

    return new_patient


# GET ALL PATIENTS
@router.get("/", response_model=list[PatientResponse])
def get_patients(
    db: Session = Depends(get_db)
):

    patients = db.query(Patient).all()

    return patients


@router.get("/{patient_id}")
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@router.put("/{patient_id}")
def update_patient(
    patient_id: int,
    updated_data: PatientCreate,
    db: Session = Depends(get_db)
):

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    patient.full_name = updated_data.full_name
    patient.age = updated_data.age
    patient.gender = updated_data.gender
    patient.phone = updated_data.phone
    patient.address = updated_data.address

    db.commit()

    return {
        "message": "Patient updated successfully"
    }


@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    db.delete(patient)
    db.commit()
    return {
        "message": "Patient deleted successfully"
    }

# GET SINGLE PATIENT
@router.get("/{patient_id}")

def get_single_patient(

    patient_id: int,
    db: Session = Depends(get_db)

):

    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:

        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# DELETE PATIENT
@router.delete("/patients/{patient_id}")

def delete_patient(

    patient_id: int,

    db: Session = Depends(get_db)

):

    patient = db.query(Patient).filter(

        Patient.id == patient_id

    ).first()

    if not patient:

        raise HTTPException(

            status_code=404,

            detail="Patient not found"

        )

    db.delete(patient)

    db.commit()

    return {

        "message": "Patient deleted successfully"

    }