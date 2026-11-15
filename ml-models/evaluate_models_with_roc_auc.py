
from pathlib import Path
import warnings

import numpy as np
import pandas as pd
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import shap

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler, label_binarize
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    roc_auc_score,
    roc_curve,
    auc,
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE


# =========================================================
# PATHS AND CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DATASET_PATH = PROJECT_DIR / "datasets" / "heart_disease_uci.csv"
OUTPUT_DIR = BASE_DIR / "evaluation_results"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

RANDOM_STATE = 42

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalch", "exang",
    "oldpeak", "slope", "ca", "thal"
]

CATEGORICAL_COLUMNS = [
    "sex", "cp", "fbs", "restecg",
    "exang", "slope", "thal"
]


# =========================================================
# 1. LOAD AND CLEAN DATASET
# =========================================================

print("=" * 65)
print("CARDIOSENSE AI - MODEL EVALUATION")
print("=" * 65)

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}"
    )

df_original = pd.read_csv(DATASET_PATH)
df = df_original.dropna().copy()

print("\nDATASET SUMMARY")
print("-" * 40)
print("Dataset:", DATASET_PATH)
print("Original records:", len(df_original))
print("Records after dropping missing values:", len(df))
print("Records removed:", len(df_original) - len(df))
print("Input feature count:", len(FEATURES))
print("Duplicate rows in original dataset:",
      int(df_original.duplicated().sum()))


# =========================================================
# 2. PREPARE FEATURES AND THREE TARGET CLASSES
# =========================================================

def convert_risk(value):
    if value == 0:
        return 0
    elif value in [1, 2]:
        return 1
    else:
        return 2


X = df[FEATURES].copy()
y = df["num"].apply(convert_risk)

print("\nTARGET CLASS DISTRIBUTION")
print("-" * 40)
print(y.value_counts().sort_index().to_string())

# Match the encoding procedure used in the original experiment.
encoders = {}

for column in CATEGORICAL_COLUMNS:
    encoder = LabelEncoder()
    X[column] = encoder.fit_transform(X[column])
    encoders[column] = encoder


# =========================================================
# 3. STRATIFIED TRAIN/TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=RANDOM_STATE,
    stratify=y
)

print("\nTRAIN/TEST SPLIT BEFORE SMOTE")
print("-" * 40)
print("Training records:", len(X_train))
print("Testing records:", len(X_test))
print("Training percentage:",
      round(len(X_train) / len(df) * 100, 2))
print("Testing percentage:",
      round(len(X_test) / len(df) * 100, 2))


# =========================================================
# 4. SCALE FEATURES AND BALANCE TRAINING DATA
# =========================================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

smote = SMOTE(random_state=RANDOM_STATE)

X_train_balanced, y_train_balanced = smote.fit_resample(
    X_train_scaled,
    y_train
)

print("\nTRAINING RECORDS AFTER SMOTE:",
      len(X_train_balanced))


# =========================================================
# 5. DEFINE AND TRAIN THE THREE MODELS
# =========================================================

models = {
    "XGBoost": XGBClassifier(
        objective="multi:softprob",
        num_class=3,
        learning_rate=0.05,
        max_depth=4,
        n_estimators=200,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="mlogloss",
        random_state=RANDOM_STATE
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=RANDOM_STATE
    ),

    "SVM": SVC(
        kernel="rbf",
        C=1,
        gamma="scale",
        probability=True,
        random_state=RANDOM_STATE
    )
}

predictions_by_model = {}
evaluation_rows = []

for model_name, model in models.items():
    print(f"\nTraining {model_name}...")

    model.fit(X_train_balanced, y_train_balanced)
    predictions = model.predict(X_test_scaled)
    probabilities = model.predict_proba(X_test_scaled)

    predictions_by_model[model_name] = predictions

    # Multiclass ROC-AUC using one-vs-rest (OvR), macro average.
    macro_roc_auc = roc_auc_score(
        y_test,
        probabilities,
        labels=[0, 1, 2],
        multi_class="ovr",
        average="macro"
    )

    evaluation_rows.append({
        "Model": model_name,
        "Accuracy (%)": accuracy_score(
            y_test, predictions
        ) * 100,
        "Macro Precision (%)": precision_score(
            y_test, predictions,
            average="macro", zero_division=0
        ) * 100,
        "Macro Recall (%)": recall_score(
            y_test, predictions,
            average="macro", zero_division=0
        ) * 100,
        "Macro F1-score (%)": f1_score(
            y_test, predictions,
            average="macro", zero_division=0
        ) * 100,
        "Weighted F1-score (%)": f1_score(
            y_test, predictions,
            average="weighted", zero_division=0
        ) * 100,
        "Macro ROC-AUC (%)": macro_roc_auc * 100
    })

    # Save one-vs-rest ROC curves for the three target classes.
    y_test_binary = label_binarize(y_test, classes=[0, 1, 2])
    safe_name = model_name.lower().replace(" ", "_")

    fig, ax = plt.subplots(figsize=(7, 6))

    for class_index, class_name in enumerate(
        ["Class 0", "Class 1", "Class 2"]
    ):
        fpr, tpr, _ = roc_curve(
            y_test_binary[:, class_index],
            probabilities[:, class_index]
        )
        class_auc = auc(fpr, tpr)
        ax.plot(
            fpr,
            tpr,
            label=f"{class_name} (AUC = {class_auc:.3f})"
        )

    ax.plot([0, 1], [0, 1], linestyle="--", label="Random classifier")
    ax.set_xlim([0.0, 1.0])
    ax.set_ylim([0.0, 1.05])
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate")
    ax.set_title(
        f"{model_name} Multiclass ROC Curve (Macro AUC = {macro_roc_auc:.3f})"
    )
    ax.legend(loc="lower right")
    fig.tight_layout()
    fig.savefig(
        OUTPUT_DIR / f"{safe_name}_roc_curve.png",
        dpi=300
    )
    plt.close(fig)

    # Save the predicted probabilities used for ROC-AUC calculation.
    probability_df = pd.DataFrame(
        probabilities,
        columns=["Class 0 probability", "Class 1 probability", "Class 2 probability"]
    )
    probability_df.insert(0, "Actual class", np.asarray(y_test))
    probability_df.to_csv(
        OUTPUT_DIR / f"{safe_name}_predicted_probabilities.csv",
        index=False
    )

    print(f"\n{model_name} classification report:")
    print(classification_report(
        y_test,
        predictions,
        labels=[0, 1, 2],
        target_names=[
            "Class 0",
            "Class 1",
            "Class 2"
        ],
        zero_division=0
    ))

    # Save each confusion matrix as a CSV and PNG.
    cm = confusion_matrix(
        y_test, predictions, labels=[0, 1, 2]
    )

    pd.DataFrame(
        cm,
        index=["Actual 0", "Actual 1", "Actual 2"],
        columns=["Predicted 0", "Predicted 1", "Predicted 2"]
    ).to_csv(OUTPUT_DIR / f"{safe_name}_confusion_matrix.csv")

    display = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=["Class 0", "Class 1", "Class 2"]
    )

    fig, ax = plt.subplots(figsize=(6, 5))
    display.plot(ax=ax, values_format="d", colorbar=False)
    ax.set_title(f"{model_name} Confusion Matrix")
    fig.tight_layout()
    fig.savefig(
        OUTPUT_DIR / f"{safe_name}_confusion_matrix.png",
        dpi=300
    )
    plt.close(fig)


# =========================================================
# 6. SAVE COMPARATIVE EVALUATION TABLE
# =========================================================

results_df = pd.DataFrame(evaluation_rows)

results_df = results_df.round(2)

results_df.to_csv(
    OUTPUT_DIR / "model_evaluation_results.csv",
    index=False
)

# Save a focused ROC-AUC summary for thesis reporting.
results_df[["Model", "Macro ROC-AUC (%)"]].to_csv(
    OUTPUT_DIR / "roc_auc_results.csv",
    index=False
)

print("\n" + "=" * 65)
print("COMPARATIVE MODEL RESULTS")
print("=" * 65)
print(results_df.to_string(index=False))


# =========================================================
# 7. SHAP FEATURE IMPORTANCE FOR XGBOOST
# =========================================================

print("\nCalculating SHAP feature importance...")

xgb_model = models["XGBoost"]

# SHAP may be memory-intensive; explain the held-out test set.
explainer = shap.TreeExplainer(xgb_model)

try:
    shap_values = explainer.shap_values(
        X_test_scaled,
        check_additivity=False
    )
except TypeError:
    # Compatibility fallback for SHAP versions that do not
    # support check_additivity in shap_values().
    shap_values = explainer.shap_values(X_test_scaled)

if isinstance(shap_values, list):
    shap_array = np.stack(
        [np.asarray(value) for value in shap_values],
        axis=-1
    )
else:
    shap_array = np.asarray(shap_values)

# Expected formats:
# (samples, features)
# (samples, features, classes)
if shap_array.ndim == 3:
    mean_abs_shap = np.abs(shap_array).mean(axis=(0, 2))
elif shap_array.ndim == 2:
    mean_abs_shap = np.abs(shap_array).mean(axis=0)
else:
    raise ValueError(
        "Unexpected SHAP array shape: "
        f"{shap_array.shape}"
    )

if len(mean_abs_shap) != len(FEATURES):
    raise ValueError(
        "SHAP feature count does not match the input features. "
        f"Got {len(mean_abs_shap)} values for "
        f"{len(FEATURES)} features."
    )

shap_df = pd.DataFrame({
    "Clinical feature": FEATURES,
    "Mean absolute SHAP value": mean_abs_shap
}).sort_values(
    "Mean absolute SHAP value",
    ascending=False
).reset_index(drop=True)

shap_df.insert(0, "Rank", range(1, len(shap_df) + 1))

shap_df.to_csv(
    OUTPUT_DIR / "shap_feature_importance.csv",
    index=False
)

print("\nSHAP FEATURE IMPORTANCE")
print("-" * 40)
print(shap_df.round(6).to_string(index=False))

# Save a horizontal bar chart of SHAP rankings.
fig, ax = plt.subplots(figsize=(10, 7))

ax.barh(
    shap_df["Clinical feature"],
    shap_df["Mean absolute SHAP value"]
)

ax.set_xlabel("Mean Absolute SHAP Value")
ax.set_ylabel("Clinical Feature")
ax.set_title("XGBoost SHAP-Based Feature Importance")
ax.invert_yaxis()

fig.tight_layout()
fig.savefig(
    OUTPUT_DIR / "shap_feature_importance.png",
    dpi=300
)
plt.close(fig)


# =========================================================
# 8. SAVE EXPERIMENT METADATA
# =========================================================

metadata = {
    "Dataset": str(DATASET_PATH),
    "Original records": len(df_original),
    "Records after dropping missing values": len(df),
    "Input features": len(FEATURES),
    "Target classes": 3,
    "Train/test split": "80/20",
    "Random state": RANDOM_STATE,
    "Training records before SMOTE": len(X_train),
    "Testing records": len(X_test),
    "Training records after SMOTE": len(X_train_balanced),
    "Missing-value handling": "Drop rows with any missing values",
    "Scaling": "StandardScaler",
    "Training class balancing": "SMOTE"
}

pd.DataFrame(
    list(metadata.items()),
    columns=["Property", "Value"]
).to_csv(
    OUTPUT_DIR / "experiment_metadata.csv",
    index=False
)

print("\n" + "=" * 65)
print("EVALUATION COMPLETED")
print("Results saved in:", OUTPUT_DIR)
print("=" * 65)
