from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.patient import Patient
from app.models.prediction import Prediction


def get_dashboard_stats(db: Session):

    total_patients = db.query(func.count(Patient.id)).scalar() or 0

    total_predictions = db.query(func.count(Prediction.id)).scalar() or 0

    no_risk = (
        db.query(func.count(Prediction.id))
        .filter(Prediction.risk_level == "No Risk")
        .scalar()
        or 0
    )

    moderate_risk = (
        db.query(func.count(Prediction.id))
        .filter(Prediction.risk_level == "Moderate Risk")
        .scalar()
        or 0
    )

    high_risk = (
        db.query(func.count(Prediction.id))
        .filter(Prediction.risk_level == "High Risk")
        .scalar()
        or 0
    )

    return {
        "total_patients": total_patients,
        "total_predictions": total_predictions,
        "no_risk": no_risk,
        "moderate_risk": moderate_risk,
        "high_risk": high_risk,
    }