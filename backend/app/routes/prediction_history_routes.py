from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.prediction import Prediction

router = APIRouter(
    prefix="/prediction-history",
    tags=["Prediction History"]
)

# ==========================================
# GET ALL PREDICTIONS
# ==========================================

@router.get("/")
def get_all_predictions(
    db: Session = Depends(get_db)
):

    predictions = db.query(
        Prediction
    ).all()

    return predictions

# ==========================================
# GET PREDICTIONS BY PATIENT
# ==========================================

@router.get("/{patient_id}")
def get_patient_predictions(
    patient_id: int,
    db: Session = Depends(get_db)
):

    predictions = db.query(
        Prediction
    ).filter(
        Prediction.patient_id == patient_id
    ).all()

    return predictions