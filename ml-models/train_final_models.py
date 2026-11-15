
from pathlib import Path
import json
import joblib
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    auc
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "datasets" / "heart_disease_uci.csv"
MODEL_DIR = BASE_DIR / "ml-models" / "saved_models"

RESULT_DIR = BASE_DIR / "evaluation_results" / "final_model_evaluation"

CONFUSION_DIR = RESULT_DIR / "confusion_matrices"
ROC_DIR = RESULT_DIR / "roc_curves"
REPORT_DIR = RESULT_DIR / "classification_reports"

for folder in [MODEL_DIR, RESULT_DIR, CONFUSION_DIR, ROC_DIR, REPORT_DIR]:
    folder.mkdir(parents=True, exist_ok=True)

RANDOM_STATE = 42

# --------------------------------------------------
# LOAD REAL DATA
# --------------------------------------------------

print("\nCARDIOSENSE AI - FINAL MODEL TRAINING")
print("=" * 60)

df = pd.read_csv(DATA_PATH)

# Target mapping
df["target_3class"] = df["num"].map(
    lambda value: 0 if value == 0
    else 1 if value in [1, 2]
    else 2
)

# Remove identifier and original target
X = df.drop(
    columns=["id", "dataset", "num", "target_3class"],
    errors="ignore"
)

y = df["target_3class"]

numeric_features = [
    "age", "trestbps", "chol",
    "thalch", "oldpeak", "ca"
]

categorical_features = [
    "sex", "cp", "fbs", "restecg",
    "exang", "slope", "thal"
]

print("Original records:", len(df))
print("\nOriginal target distribution:")
print(y.value_counts().sort_index())

# --------------------------------------------------
# TRAIN / TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=RANDOM_STATE,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))

# --------------------------------------------------
# PREPROCESSING
# --------------------------------------------------

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features)
])

# --------------------------------------------------
# DEFINE MODELS
# --------------------------------------------------

models = {
    "XGBoost": XGBClassifier(
        objective="multi:softprob",
        num_class=3,
        n_estimators=250,
        max_depth=3,
        learning_rate=0.04,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="mlogloss",
        random_state=RANDOM_STATE,
        n_jobs=-1
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=8,
        min_samples_split=5,
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1
    ),

    "SVM": SVC(
        kernel="rbf",
        C=1.0,
        gamma="scale",
        probability=True,
        class_weight="balanced",
        random_state=RANDOM_STATE
    )
}

results = []
trained_models = {}
predictions = {}
probabilities = {}

# --------------------------------------------------
# TRAIN AND EVALUATE
# --------------------------------------------------

for name, estimator in models.items():

    print("\n" + "=" * 60)
    print("TRAINING:", name)
    print("=" * 60)

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", estimator)
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)

    predictions[name] = y_pred
    probabilities[name] = y_prob
    trained_models[name] = pipeline

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(
        y_test, y_pred, average="macro", zero_division=0
    )
    recall = recall_score(
        y_test, y_pred, average="macro", zero_division=0
    )
    f1 = f1_score(
        y_test, y_pred, average="macro", zero_division=0
    )
    weighted_f1 = f1_score(
        y_test, y_pred, average="weighted", zero_division=0
    )

    roc_auc = roc_auc_score(
        y_test,
        y_prob,
        multi_class="ovr",
        average="macro",
        labels=[0, 1, 2]
    )

    results.append({
        "Model": name,
        "Accuracy": accuracy,
        "Macro Precision": precision,
        "Macro Recall": recall,
        "Macro F1": f1,
        "Weighted F1": weighted_f1,
        "Macro ROC-AUC": roc_auc
    })

    report = classification_report(
        y_test,
        y_pred,
        labels=[0, 1, 2],
        target_names=[
            "No Disease",
            "Moderate Disease",
            "Higher Disease Severity"
        ],
        output_dict=True,
        zero_division=0
    )

    with open(
        REPORT_DIR / f"{name.lower().replace(' ', '_')}.json",
        "w"
    ) as file:
        json.dump(report, file, indent=4)

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred, labels=[0, 1, 2])

    plt.figure(figsize=(7, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["No Disease", "Moderate", "Higher Severity"],
        yticklabels=["No Disease", "Moderate", "Higher Severity"]
    )
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title(f"{name} - Confusion Matrix")
    plt.tight_layout()

    plt.savefig(
        CONFUSION_DIR / f"{name.lower().replace(' ', '_')}.png",
        dpi=300
    )
    plt.close()

    # Save trained pipeline
    model_filename = name.lower().replace(" ", "_") + "_final.pkl"

    joblib.dump(
        pipeline,
        MODEL_DIR / model_filename
    )

    print("Accuracy:", round(accuracy, 4))
    print("Macro F1:", round(f1, 4))
    print("Weighted F1:", round(weighted_f1, 4))
    print("Macro ROC-AUC:", round(roc_auc, 4))
    print("Saved:", model_filename)

# --------------------------------------------------
# ROC CURVES
# --------------------------------------------------

plt.figure(figsize=(9, 7))

for name, y_prob in probabilities.items():

    fpr, tpr, _ = roc_curve(
        (y_test == 2).astype(int),
        y_prob[:, 2]
    )

    roc_score = auc(fpr, tpr)

    plt.plot(
        fpr,
        tpr,
        label=f"{name} - Class 2 AUC: {roc_score:.3f}"
    )

plt.plot([0, 1], [0, 1], linestyle="--", color="gray")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("CardioSense AI - ROC Curves (Class 2 vs Rest)")
plt.legend()
plt.tight_layout()

plt.savefig(ROC_DIR / "class_2_roc_comparison.png", dpi=300)
plt.close()

# --------------------------------------------------
# SAVE COMPARISON
# --------------------------------------------------

comparison = pd.DataFrame(results).sort_values(
    by="Macro F1",
    ascending=False
)

comparison.to_csv(
    RESULT_DIR / "model_comparison.csv",
    index=False
)

# Save exact test split indices for reproducibility
split_info = {
    "random_state": RANDOM_STATE,
    "test_size": 0.20,
    "training_records": len(X_train),
    "testing_records": len(X_test),
    "train_indices": [int(i) for i in X_train.index],
    "test_indices": [int(i) for i in X_test.index],
    "target_mapping": {
        "0": "No Disease",
        "1": "Moderate Disease (original num 1-2)",
        "2": "Higher Disease Severity (original num 3-4)"
    }
}

with open(RESULT_DIR / "split_information.json", "w") as file:
    json.dump(split_info, file, indent=4)

print("\n" + "=" * 60)
print("FINAL MODEL COMPARISON")
print("=" * 60)

print(comparison.round(4).to_string(index=False))

print("\nAll models and evaluation reports saved.")
print("Results directory:", RESULT_DIR)
print("\nTraining completed successfully.")
