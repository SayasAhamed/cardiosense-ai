import pandas as pd
import shap

from app.ml.load_model import (
    xgb_model,
    scaler,
    encoders
)

features = [
    'age',
    'sex',
    'cp',
    'trestbps',
    'chol',
    'fbs',
    'restecg',
    'thalch',
    'exang',
    'oldpeak',
    'slope',
    'ca',
    'thal'
]

explainer = shap.TreeExplainer(xgb_model)

def explain_prediction(data):

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
    }])

    # =========================
    # ENCODE CATEGORICALS
    # =========================

    categorical_columns = [
        'sex',
        'cp',
        'fbs',
        'restecg',
        'exang',
        'slope',
        'thal'
    ]

    for column in categorical_columns:

        encoder = encoders[column]

        input_data[column] = encoder.transform(
            input_data[column]
        )

    # =========================
    # SCALE DATA
    # =========================

    scaled_data = scaler.transform(input_data)

    # =========================
    # PREDICTION
    # =========================

    prediction = xgb_model.predict(
        scaled_data
    )[0]

    # =========================
    # SHAP VALUES
    # =========================

    shap_values = explainer.shap_values(
        scaled_data
    )

    # FIX MULTICLASS SHAP
    class_shap_values = shap_values[0][:, prediction]


    # =========================
    # FEATURE IMPORTANCE
    # =========================

    feature_impacts = []

    for i in range(len(features)):

        feature_impacts.append({

            "feature": features[i],

            "impact": round(
                float(abs(class_shap_values[i])),
                4
            )
        })

    # SORT BY IMPORTANCE
    feature_impacts = sorted(
        feature_impacts,
        key=lambda x: x["impact"],
        reverse=True
    )

    return {

        "prediction": int(prediction),

        "top_features": feature_impacts[:5]
    }