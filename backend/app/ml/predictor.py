import pandas as pd

from app.models.prediction import Prediction

from app.ml.load_model import (
    xgb_model,
    scaler,
    encoders
)


def predict_heart_risk(data, db, patient_id):

    # =====================================
    # CREATE INPUT DATAFRAME
    # =====================================

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

    # =====================================
    # ENCODE CATEGORICAL FEATURES
    # =====================================

    print(input_data) ############################################################
    print(encoders["cp"].classes_)
    print(encoders["thal"].classes_)
    print(encoders["sex"].classes_)
    ###################################################################################################################### 

    categorical_columns = [

        "sex",

        "cp",

        "fbs",

        "restecg",

        "exang",

        "slope",

        "thal"

    ]

    for column in categorical_columns:

        encoder = encoders[column]

        if column not in ['fbs', 'exang']:

            input_data[column] = input_data[column].astype(str)

        input_data[column] = encoder.transform(
            input_data[column]
        )

    # =====================================
    # SCALE DATA
    # =====================================

    scaled_data = scaler.transform(input_data)

    # =====================================
    # MAKE PREDICTION
    # =====================================

    prediction = xgb_model.predict(
        scaled_data
    )[0]

    probabilities = xgb_model.predict_proba(
        scaled_data
    )[0]

    confidence = max(probabilities)

    # =====================================
    # LABEL MAPPING
    # =====================================

    labels = {

        0: "No Risk",

        1: "Moderate Risk",

        2: "High Risk"

    }

    # =====================================
    # PREPARE RESPONSE
    # =====================================

    result = {

        "prediction": int(prediction),

        "risk_level": labels[prediction],

        "confidence_score": round(
            float(confidence) * 100,
            2
        ),

        "probabilities": {

            "No Risk": round(
                float(probabilities[0]) * 100,
                2
            ),

            "Moderate Risk": round(
                float(probabilities[1]) * 100,
                2
            ),

            "High Risk": round(
                float(probabilities[2]) * 100,
                2
            )
        }
    }

    # =====================================
    # SAVE PREDICTION TO DATABASE
    # =====================================

    new_prediction = Prediction(

        patient_id=patient_id,

        prediction=result["prediction"],

        risk_level=result["risk_level"],

        confidence_score=result["confidence_score"],

        no_risk_probability=result["probabilities"]["No Risk"],

        moderate_risk_probability=result["probabilities"]["Moderate Risk"],

        high_risk_probability=result["probabilities"]["High Risk"]

    )

    db.add(new_prediction)

    db.commit()

    # =====================================
    # RETURN RESULT
    # =====================================

    return result