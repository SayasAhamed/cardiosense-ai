from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_

from app.database import get_db
from app.models.prediction import Prediction
from app.models.patient import Patient

router = APIRouter(
    prefix="/prediction-history",
    tags=["Prediction History"]
)

# =====================================================
# FORMAT RESPONSE
# =====================================================

def format_prediction(prediction, patient):
    return {
        "id": prediction.id,
        "patient_id": prediction.patient_id,
        "patient_name": patient.full_name if patient else "Unknown Patient",
        "age": patient.age if patient else None,
        "gender": patient.gender if patient else None,
        "phone": patient.phone if patient else "",
        "address": patient.address if patient else "",

        # Prediction result
        "prediction": prediction.prediction,
        "severity": prediction.risk_level,
        "risk_level": prediction.risk_level,

        # Confidence
        "confidence": prediction.confidence_score,
        "confidence_score": prediction.confidence_score,

        # Individual probabilities
        "no_risk_probability": prediction.no_risk_probability,
        "moderate_risk_probability": prediction.moderate_risk_probability,
        "high_risk_probability": prediction.high_risk_probability,

        "created_at": prediction.created_at,
    }

# =====================================================
# GET ALL PREDICTIONS
# =====================================================

@router.get("/")
def get_prediction_history(db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction)
        .order_by(desc(Prediction.created_at))
        .all()
    )

    results = []

    for prediction in predictions:
        patient = (
            db.query(Patient)
            .filter(Patient.id == prediction.patient_id)
            .first()
        )

        results.append(format_prediction(prediction, patient))

    return results

# =====================================================
# SEARCH BY PATIENT NAME OR PHONE
# =====================================================

@router.get("/search")
def search_prediction_history(query: str, db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction)
        .join(Patient, Patient.id == Prediction.patient_id)
        .filter(
            or_(
                Patient.full_name.ilike(f"%{query}%"),
                Patient.phone.ilike(f"%{query}%")
            )
        )
        .order_by(desc(Prediction.created_at))
        .all()
    )

    results = []

    for prediction in predictions:
        patient = (
            db.query(Patient)
            .filter(Patient.id == prediction.patient_id)
            .first()
        )

        results.append(format_prediction(prediction, patient))

    return results

# =====================================================
# FILTER BY SEVERITY
# =====================================================

@router.get("/filter")
def filter_prediction_history(
    severity: str,
    db: Session = Depends(get_db)
):
    predictions = (
        db.query(Prediction)
        .filter(Prediction.risk_level.ilike(f"%{severity}%"))
        .order_by(desc(Prediction.created_at))
        .all()
    )

    results = []

    for prediction in predictions:
        patient = (
            db.query(Patient)
            .filter(Patient.id == prediction.patient_id)
            .first()
        )

        results.append(format_prediction(prediction, patient))

    return results

# =====================================================
# GET SINGLE PREDICTION
# =====================================================

@router.get("/{prediction_id}")
def get_prediction_details(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    prediction = (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found."
        )

    patient = (
        db.query(Patient)
        .filter(Patient.id == prediction.patient_id)
        .first()
    )

    return format_prediction(prediction, patient)

# =====================================================
# DELETE PREDICTION
# =====================================================

@router.delete("/{prediction_id}")
def delete_prediction_history(
    prediction_id: int,
    db: Session = Depends(get_db)
):
    prediction = (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found."
        )

    db.delete(prediction)
    db.commit()

    return {
        "message": "Prediction deleted successfully.",
        "deleted_prediction": prediction_id,
    }