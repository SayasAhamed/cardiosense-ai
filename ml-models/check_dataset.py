
from pathlib import Path

import pandas as pd

# Locate the dataset relative to this Python file
project_root = Path(__file__).resolve().parent.parent
dataset_path = project_root / "datasets" / "heart_disease_uci.csv"

print("=" * 55)
print("CARDIOSENSE AI - DATASET INSPECTION")
print("=" * 55)

if not dataset_path.exists():
    print("\nERROR: Dataset file was not found.")
    print("Expected location:", dataset_path)
    raise SystemExit(1)

# Load the original dataset
df_original = pd.read_csv(dataset_path)

print("\n1. ORIGINAL DATASET")
print("Dataset path:", dataset_path)
print("Total records:", len(df_original))
print("Total columns:", len(df_original.columns))

print("\nColumn names:")
print(df_original.columns.tolist())

print("\n2. MISSING VALUES")
print(df_original.isnull().sum().to_string())

print("\nTotal missing cells:", int(df_original.isnull().sum().sum()))

# Apply the same missing-value handling as the training script
df_clean = df_original.dropna().copy()

print("\n3. AFTER DROPPING MISSING VALUES")
print("Records before cleaning:", len(df_original))
print("Records after cleaning:", len(df_clean))
print("Records removed:", len(df_original) - len(df_clean))

# Inspect the target used in your training script
if "num" in df_clean.columns:
    def convert_risk(value):
        if value == 0:
            return 0
        elif value in [1, 2]:
            return 1
        else:
            return 2

    target = df_clean["num"].apply(convert_risk)

    print("\n4. TARGET CLASS DISTRIBUTION")
    print("Class 0: No disease (original num = 0)")
    print("Class 1: Original num = 1 or 2")
    print("Class 2: Original num = 3 or 4")
    print("\nRecords per class:")
    print(target.value_counts().sort_index().to_string())
    print("\nNumber of classes:", target.nunique())
else:
    print("\nERROR: Target column 'num' was not found.")

print("\n5. DUPLICATE RECORDS")
print("Exact duplicate rows:", int(df_original.duplicated().sum()))

print("\nDataset inspection completed.")
