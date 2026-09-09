import pandas as pd
import shap

from app.ml.load_model import (
    xgb_model,
    scaler,
    encoders
)

# =====================================
# FEATURE ORDER (must match training)
# =====================================

features = [
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
    "thal",
]

explainer = shap.TreeExplainer(xgb_model)


# =====================================
# NORMALIZE FRONTEND LABELS
# =====================================

def normalize_xai_input(input_data):
    """Convert frontend values to labels used during model training."""

    input_data["restecg"] = input_data["restecg"].replace({
        "normal": "normal",
        "st-t abnormality": "st-t abnormality",
        "left ventricular hypertrophy": "lv hypertrophy",
        "lv hypertrophy": "lv hypertrophy",
    })

    input_data["cp"] = input_data["cp"].replace({
        "typical angina": "typical angina",
        "atypical angina": "atypical angina",
        "non-anginal": "non-anginal",
        "asymptomatic": "asymptomatic",
    })

    input_data["slope"] = input_data["slope"].replace({
        "upsloping": "upsloping",
        "flat": "flat",
        "downsloping": "downsloping",
    })

    input_data["thal"] = input_data["thal"].replace({
        "normal": "normal",
        "fixed defect": "fixed defect",
        "reversable defect": "reversable defect",
    })

    return input_data


# =====================================
# SHAP EXPLANATION
# =====================================

def explain_prediction(data):

    # -----------------------------
    # Create dataframe
    # -----------------------------

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
        "thal": data.thal,
    }])

    # -----------------------------
    # Normalize labels
    # -----------------------------

    input_data = normalize_xai_input(input_data)

    print("Normalized SHAP Input")
    print(input_data)

    # -----------------------------
    # Encode categorical columns
    # -----------------------------

    categorical_columns = [
        "sex",
        "cp",
        "fbs",
        "restecg",
        "exang",
        "slope",
        "thal",
    ]

    for column in categorical_columns:

        encoder = encoders[column]

        # Convert only string columns
        if column not in ["fbs", "exang"]:
            input_data[column] = input_data[column].astype(str)

        print(f"Encoding {column}")
        print("Input :", input_data[column].tolist())
        print("Classes:", encoder.classes_)

        input_data[column] = encoder.transform(input_data[column])

    # -----------------------------
    # Scale data
    # -----------------------------

    scaled_data = scaler.transform(input_data)

    # -----------------------------
    # Predict class
    # -----------------------------

    prediction = int(xgb_model.predict(scaled_data)[0])

    # -----------------------------
    # SHAP values
    # -----------------------------

    shap_values = explainer.shap_values(scaled_data)

    # Works for multiclass XGBoost
    if isinstance(shap_values, list):
        class_shap_values = shap_values[prediction][0]
    else:
        class_shap_values = shap_values[0][:, prediction]

    # -----------------------------
    # Build feature importance
    # -----------------------------

    feature_importance = []

    for feature_name, shap_value in zip(features, class_shap_values):
        feature_importance.append({
            "feature": feature_name,
            "value": round(float(shap_value), 4),
            "impact": round(float(abs(shap_value)), 4),
        })

    # Sort by absolute impact
    feature_importance = sorted(
        feature_importance,
        key=lambda x: x["impact"],
        reverse=True,
    )

    # -----------------------------
    # Return response for React
    # -----------------------------

    return {
        "prediction": prediction,
        "feature_importance": feature_importance,
    }