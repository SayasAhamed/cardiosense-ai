from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.patient import Patient
from app.models.prediction import Prediction

router = APIRouter()


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    total_patients = db.query(Patient).count()

    total_predictions = db.query(Prediction).count()

    no_risk = db.query(Prediction).filter(
        Prediction.risk_level == "No Risk"
    ).count()

    moderate_risk = db.query(Prediction).filter(
        Prediction.risk_level == "Moderate Risk"
    ).count()

    high_risk = db.query(Prediction).filter(
        Prediction.risk_level == "High Risk"
    ).count()

    avg_confidence = db.query(
        func.avg(Prediction.confidence_score)
    ).scalar()

    return {
        "total_patients": total_patients,
        "total_predictions": total_predictions,
        "no_risk": no_risk,
        "moderate_risk": moderate_risk,
        "high_risk": high_risk,
        "average_confidence": round(avg_confidence or 0, 2),
    }