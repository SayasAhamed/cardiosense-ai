
import pandas as pd
from pathlib import Path

# Resolve project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Dataset paths
ORIGINAL_FILE = BASE_DIR / "datasets" / "heart_disease_uci.csv"

SYNTHETIC_FILE = (
    BASE_DIR
    / "datasets"
    / "synthetic"
    / "cardiosense_3000_balanced_synthetic_dataset.csv"
)


def inspect_dataset(file_path, dataset_name):

    print("\n" + "=" * 75)
    print(f"DATASET: {dataset_name}")
    print("=" * 75)

    if not file_path.exists():
        print(f"ERROR: File not found: {file_path}")
        return None

    df = pd.read_csv(file_path)

    print("\n1. Dataset dimensions")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

    print("\n2. Column names")
    print(df.columns.tolist())

    print("\n3. Data types")
    print(df.dtypes)

    print("\n4. Missing values")
    missing = df.isnull().sum()

    print(missing[missing > 0])
    print(f"Total missing cells: {missing.sum()}")

    print("\n5. Duplicate records")
    print(f"Duplicate rows: {df.duplicated().sum()}")

    print("\n6. First five records")
    print(df.head().to_string())

    print("\n7. Statistical summary")
    print(df.describe(include="all").to_string())

    # Detect target column
    possible_targets = [
        "num",
        "target",
        "severity",
        "disease_severity"
    ]

    target_column = next(
        (col for col in possible_targets if col in df.columns),
        None
    )

    if target_column:
        print(f"\n8. Target distribution: {target_column}")

        print(
            df[target_column]
            .value_counts(dropna=False)
            .sort_index()
        )

    # Inspect synthetic origin
    if "record_type" in df.columns:
        print("\n9. Record origin")

        print(df["record_type"].value_counts(dropna=False))

    return df


if __name__ == "__main__":

    original_df = inspect_dataset(
        ORIGINAL_FILE,
        "ORIGINAL UCI HEART DISEASE DATASET"
    )

    synthetic_df = inspect_dataset(
        SYNTHETIC_FILE,
        "CARDIOSENSE SYNTHETIC DATASET"
    )

    print("\n" + "=" * 75)
    print("DATASET VERIFICATION COMPLETED")
    print("=" * 75)
