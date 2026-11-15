
import pandas as pd

from app.models.prediction import Prediction
from app.ml.load_model import xgb_pipeline


FEATURES = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalch",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]


def normalize_prediction_input(input_data):
    """Normalize frontend categorical values."""

    mappings = {
        "restecg": {
            "left ventricular hypertrophy": "lv hypertrophy",
            "left ventricular": "lv hypertrophy"
        },
        "thal": {
            "reversible defect": "reversable defect"
        }
    }

    for column, mapping in mappings.items():
        input_data[column] = (
            input_data[column]
            .apply(
                lambda value: (
                    mapping.get(value.strip().lower(), value.strip().lower())
                    if isinstance(value, str)
                    else value
                )
            )
        )

    return input_data


def predict_heart_risk(data, db, patient_id):

    input_data = pd.DataFrame([{
        "age": data.age,
        "sex": data.sex,
        "cp": data.cp,
        "trestbps": data.trestbps,
        "chol": data.chol,
        "fbs": data.fbs,
        "restecg": data.restecg,
        "thalch": data.thalch,
        "exang": data.exang,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "thal": data.thal
    }], columns=FEATURES)

    input_data = normalize_prediction_input(input_data)

    print("Normalized prediction input:")
    print(input_data)

    # Pipeline handles imputation, encoding and scaling.
    prediction = int(xgb_pipeline.predict(input_data)[0])
    probabilities = xgb_pipeline.predict_proba(input_data)[0]

    labels = {
        0: "No Risk",
        1: "Moderate Risk",
        2: "High Risk"
    }

    result = {
        "prediction": prediction,
        "risk_level": labels[prediction],
        "confidence_score": round(
            float(max(probabilities)), 4
        ),
        "no_risk_probability": round(
            float(probabilities[0]), 4
        ),
        "moderate_risk_probability": round(
            float(probabilities[1]), 4
        ),
        "high_risk_probability": round(
            float(probabilities[2]), 4
        )
    }

    # Save prediction to database
    new_prediction = Prediction(
        patient_id=patient_id,
        prediction=result["prediction"],
        risk_level=result["risk_level"],
        confidence_score=result["confidence_score"] * 100,
        no_risk_probability=result["no_risk_probability"] * 100,
        moderate_risk_probability=result["moderate_risk_probability"] * 100,
        high_risk_probability=result["high_risk_probability"] * 100
    )

    db.add(new_prediction)
    db.commit()

    return result
