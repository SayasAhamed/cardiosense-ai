import pandas as pd
import joblib
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

from xgboost import XGBClassifier

from imblearn.over_sampling import SMOTE

# =========================================================
# LOAD DATASET
# =========================================================

df = pd.read_csv("../datasets/heart_disease_uci.csv")

print(df.head())

# =========================================================
# DROP MISSING VALUES
# =========================================================

df.dropna(inplace=True)

# =========================================================
# SELECT FEATURES
# =========================================================

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

X = df[features].copy()

# =========================================================
# TARGET COLUMN
# =========================================================

y = df['num']

# =========================================================
# CONVERT INTO 3 CLASSES
# =========================================================

def convert_risk(value):

    if value == 0:
        return 0

    elif value in [1, 2]:
        return 1

    else:
        return 2

y = y.apply(convert_risk)

# =========================================================
# ENCODE CATEGORICAL FEATURES
# =========================================================

categorical_columns = [
    'sex',
    'cp',
    'fbs',
    'restecg',
    'exang',
    'slope',
    'thal'
]

encoders = {}

for column in categorical_columns:

    le = LabelEncoder()

    X[column] = le.fit_transform(X[column])

    encoders[column] = le

# =========================================================
# TRAIN TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =========================================================
# STANDARD SCALER
# =========================================================

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)

X_test = scaler.transform(X_test)

# =========================================================
# SMOTE BALANCING
# =========================================================

smote = SMOTE(random_state=42)

X_train, y_train = smote.fit_resample(
    X_train,
    y_train
)

# =========================================================
# XGBOOST MODEL
# =========================================================

xgb_model = XGBClassifier(
    objective='multi:softprob',
    num_class=3,
    learning_rate=0.05,
    max_depth=4,
    n_estimators=200,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric='mlogloss',
    random_state=42
)

xgb_model.fit(X_train, y_train)

xgb_probs = xgb_model.predict_proba(X_test)

xgb_preds = xgb_probs.argmax(axis=1)

print("\n=========================")
print("XGBOOST RESULTS")
print("=========================")

print("\nXGBoost Accuracy:")
print(accuracy_score(y_test, xgb_preds))

print("\nClassification Report:")
print(classification_report(y_test, xgb_preds))

# =========================================================
# CONFUSION MATRIX
# =========================================================

cm = confusion_matrix(y_test, xgb_preds)

print("\nConfusion Matrix:")
print(cm)

# =========================================================
# RANDOM FOREST MODEL
# =========================================================

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

rf_model.fit(X_train, y_train)

rf_preds = rf_model.predict(X_test)

print("\n=========================")
print("RANDOM FOREST RESULTS")
print("=========================")

print("\nRandom Forest Accuracy:")
print(accuracy_score(y_test, rf_preds))

# =========================================================
# SVM MODEL
# =========================================================

svm_model = SVC(
    kernel='rbf',
    C=1,
    gamma='scale'
)

svm_model.fit(X_train, y_train)

svm_preds = svm_model.predict(X_test)

print("\n=========================")
print("SVM RESULTS")
print("=========================")

print("\nSVM Accuracy:")
print(accuracy_score(y_test, svm_preds))

# =========================================================
# FEATURE IMPORTANCE
# =========================================================

importance = xgb_model.feature_importances_

feature_importance = pd.DataFrame({
    'Feature': features,
    'Importance': importance
})

feature_importance = feature_importance.sort_values(
    by='Importance',
    ascending=False
)

print("\n=========================")
print("FEATURE IMPORTANCE")
print("=========================")

print(feature_importance)

# =========================================================
# FEATURE IMPORTANCE VISUALIZATION
# =========================================================

plt.figure(figsize=(10, 6))

plt.barh(
    feature_importance['Feature'],
    feature_importance['Importance']
)

plt.xlabel("Importance Score")

plt.ylabel("Features")

plt.title("XGBoost Feature Importance")

plt.gca().invert_yaxis()

plt.show()

# =========================================================
# SAVE TRAINED MODEL
# =========================================================

joblib.dump(
    xgb_model,
    "saved_models/xgb_model.pkl"
)

print("\nXGBoost model saved successfully.")

# =========================================================
# SAVE SCALER
# =========================================================

joblib.dump(
    scaler,
    "saved_models/scaler.pkl"
)

print("Scaler saved successfully.")

# =========================================================
# SAVE LABEL ENCODERS
# =========================================================

joblib.dump(
    encoders,
    "saved_models/encoders.pkl"
)

print("Encoders saved successfully.")