
import json
import joblib
import shap
import pandas as pd
import matplotlib.pyplot as plt

from pathlib import Path
from sklearn.model_selection import train_test_split

# --------------------------------------------------
# PATHS AND SETTINGS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "datasets" / "heart_disease_uci.csv"
MODEL_PATH = BASE_DIR / "saved_models" / "xgboost_final.pkl"
OUTPUT_DIR = BASE_DIR.parent / "evaluation_results" / "shap_analysis"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalch", "exang", "oldpeak",
    "slope", "ca", "thal"
]

CLASS_NAMES = {
    0: "No Disease",
    1: "Moderate Disease",
    2: "Higher Disease Severity"
}

# --------------------------------------------------
# LOAD DATA AND RECREATE TEST SPLIT
# --------------------------------------------------

print("Loading original UCI dataset...")

df = pd.read_csv(DATA_PATH)
df["target_3class"] = df["num"].map(
    lambda value: 0 if value == 0 else (1 if value in [1, 2] else 2)
)

X = df[FEATURES]
y = df["target_3class"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# --------------------------------------------------
# LOAD TRAINED PIPELINE
# --------------------------------------------------

print("Loading trained XGBoost pipeline...")

pipeline = joblib.load(MODEL_PATH)

preprocessor = pipeline.named_steps["preprocessor"]
xgb_model = pipeline.named_steps["model"]

X_test_transformed = preprocessor.transform(X_test)

feature_names = preprocessor.get_feature_names_out()

print("Test records:", len(X_test))
print("Transformed features:", len(feature_names))

# --------------------------------------------------
# SHAP EXPLANATION
# --------------------------------------------------

print("Calculating SHAP values...")

# Limit explanation size to keep processing manageable
sample_size = min(100, X_test_transformed.shape[0])

X_sample = X_test_transformed[:sample_size]

explainer = shap.TreeExplainer(xgb_model)
shap_result = explainer(X_sample)

# Save SHAP values for later analysis
shap_values = shap_result.values

with open(OUTPUT_DIR / "shap_metadata.json", "w") as file:
    json.dump({
        "explained_samples": int(sample_size),
        "feature_count": int(len(feature_names)),
        "classes": CLASS_NAMES
    }, file, indent=4)

# --------------------------------------------------
# GENERATE PLOTS FOR EACH CLASS
# --------------------------------------------------

for class_index, class_name in CLASS_NAMES.items():

    print(f"Generating explanations: {class_name}")

    class_values = shap_values[:, :, class_index]

    base_values = shap_result.base_values

    if base_values.ndim == 2:
        class_base_values = base_values[:, class_index]
    else:
        class_base_values = base_values

    explanation = shap.Explanation(
        values=class_values,
        base_values=class_base_values,
        data=X_sample.toarray() if hasattr(X_sample, "toarray") else X_sample,
        feature_names=feature_names
    )

    safe_name = class_name.lower().replace(" ", "_")

    # Global feature importance
    plt.figure()
    shap.plots.bar(explanation, max_display=13, show=False)
    plt.title(f"SHAP Feature Importance - {class_name}")
    plt.tight_layout()
    plt.savefig(
        OUTPUT_DIR / f"{safe_name}_feature_importance.png",
        dpi=300,
        bbox_inches="tight"
    )
    plt.close()

    # Feature impact distribution
    plt.figure()
    shap.plots.beeswarm(explanation, max_display=13, show=False)
    plt.title(f"SHAP Feature Impact - {class_name}")
    plt.tight_layout()
    plt.savefig(
        OUTPUT_DIR / f"{safe_name}_beeswarm.png",
        dpi=300,
        bbox_inches="tight"
    )
    plt.close()

# --------------------------------------------------
# INDIVIDUAL PREDICTION EXPLANATION
# --------------------------------------------------

print("Generating individual prediction explanation...")

first_sample = X_test_transformed[0:1]
prediction = int(pipeline.predict(X_test.iloc[[0]])[0])

individual_result = explainer(first_sample)

individual_values = individual_result.values[0, :, prediction]

individual_base = individual_result.base_values
if individual_base.ndim == 2:
    individual_base = individual_base[0, prediction]
else:
    individual_base = individual_base[0]

individual_explanation = shap.Explanation(
    values=individual_values,
    base_values=individual_base,
    data=(
        first_sample.toarray()[0]
        if hasattr(first_sample, "toarray")
        else first_sample[0]
    ),
    feature_names=feature_names
)

plt.figure()
shap.plots.waterfall(
    individual_explanation,
    max_display=13,
    show=False
)
plt.title(
    f"Individual Prediction Explanation - {CLASS_NAMES[prediction]}"
)
plt.tight_layout()
plt.savefig(
    OUTPUT_DIR / "individual_prediction_waterfall.png",
    dpi=300,
    bbox_inches="tight"
)
plt.close()

print("\nSHAP analysis completed successfully!")
print("Predicted class:", CLASS_NAMES[prediction])
print("Results saved to:", OUTPUT_DIR)
