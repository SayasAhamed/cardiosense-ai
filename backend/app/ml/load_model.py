
from pathlib import Path
import joblib

# Locate project root
BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = (
    BASE_DIR
    / "ml-models"
    / "saved_models"
    / "xgboost_final.pkl"
)

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"XGBoost model not found: {MODEL_PATH}"
    )

# Load complete preprocessing and prediction pipeline
xgb_pipeline = joblib.load(MODEL_PATH)

# Access internal components
preprocessor = xgb_pipeline.named_steps["preprocessor"]
xgb_model = xgb_pipeline.named_steps["model"]

print("CardioSense AI final XGBoost pipeline loaded.")
