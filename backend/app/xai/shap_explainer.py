
import pandas as pd
import shap

from app.ml.load_model import xgb_pipeline


# =====================================
# FEATURE CONFIGURATION
# =====================================

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

CLASS_NAMES = {
    0: "No Risk",
    1: "Moderate Risk",
    2: "High Risk"
}

# Get preprocessing and XGBoost components
preprocessor = xgb_pipeline.named_steps["preprocessor"]
xgb_model = xgb_pipeline.named_steps["model"]

# Get transformed feature names (25 features)
transformed_features = preprocessor.get_feature_names_out()

# Initialize SHAP explainer
explainer = shap.TreeExplainer(xgb_model)


# =====================================
# NORMALIZE FRONTEND LABELS
# =====================================

def normalize_xai_input(input_data):
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
        input_data[column] = input_data[column].apply(
            lambda value: (
                mapping.get(value.strip().lower(), value.strip().lower())
                if isinstance(value, str)
                else value
            )
        )

    return input_data


# =====================================
# SHAP EXPLANATION
# =====================================

def explain_prediction(data):

    # Create input dataframe
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

    # Normalize frontend labels
    input_data = normalize_xai_input(input_data)

    print("Normalized SHAP Input:")
    print(input_data)

    # Apply the same fitted preprocessing as prediction
    transformed_data = preprocessor.transform(input_data)

    # Predict using complete pipeline
    prediction = int(xgb_pipeline.predict(input_data)[0])

    # Calculate SHAP values
    shap_result = explainer(transformed_data)

    shap_values = shap_result.values

    # Select SHAP values for predicted class
    if shap_values.ndim == 3:
        class_shap_values = shap_values[0, :, prediction]
    else:
        raise ValueError(
            f"Unexpected SHAP output shape: {shap_values.shape}"
        )


    # Build readable feature importance
    transformed_values = (
        transformed_data.toarray()[0]
        if hasattr(transformed_data, "toarray")
        else transformed_data[0]
    )

    feature_importance = []

    for feature_name, shap_value, feature_value in zip(
        transformed_features,
        class_shap_values,
        transformed_values
    ):
        readable_name = (
            feature_name
            .replace("numeric__", "")
            .replace("categorical__", "")
            .replace("_", " ")
            .title()
        )

        feature_importance.append({
            "feature": readable_name,
            "original_feature": str(feature_name),
            "feature_value": float(feature_value),
            "value": round(float(shap_value), 4),
            "impact": round(float(abs(shap_value)), 4),
            "direction": (
                "towards_prediction"
                if shap_value > 0
                else "away_from_prediction"
                if shap_value < 0
                else "neutral"
            )
        })

    feature_importance.sort(
        key=lambda item: item["impact"],
        reverse=True
    )
