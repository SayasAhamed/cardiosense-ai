
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

ORIGINAL_FILE = BASE_DIR / "datasets" / "heart_disease_uci.csv"

SYNTHETIC_FILE = (
    BASE_DIR / "datasets" / "synthetic" /
    "cardiosense_3000_balanced_synthetic_dataset.csv"
)

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalch", "exang",
    "oldpeak", "slope", "ca", "thal"
]

CATEGORICAL = [
    "sex", "cp", "restecg", "slope", "thal"
]

BOOLEAN = ["fbs", "exang"]

NUMERIC = [
    "age", "trestbps", "chol", "thalch",
    "oldpeak", "ca"
]


def normalize_data(df):

    result = df[FEATURES + ["target_3class"]].copy()

    # Normalize categorical values
    for col in CATEGORICAL:
        result[col] = (
            result[col]
            .astype("string")
            .str.strip()
            .str.lower()
        )

    # Normalize boolean values
    for col in BOOLEAN:
        result[col] = (
            result[col]
            .astype("string")
            .str.strip()
            .str.lower()
            .map({
                "true": "true",
                "false": "false",
                "1": "true",
                "0": "false"
            })
        )

    # Normalize numerical values
    for col in NUMERIC:
        result[col] = pd.to_numeric(
            result[col], errors="coerce"
        ).round(8)

    result["target_3class"] = pd.to_numeric(
        result["target_3class"],
        errors="coerce"
    )

    return result


def main():

    original = pd.read_csv(ORIGINAL_FILE)
    augmented = pd.read_csv(SYNTHETIC_FILE)

    original = original.dropna(
        subset=FEATURES + ["num"]
    ).copy()

    original["target_3class"] = original["num"].map({
        0: 0,
        1: 1,
        2: 1,
        3: 2,
        4: 2
    })

    real = augmented[
        augmented["record_type"] == "real"
    ].copy()

    original_normalized = normalize_data(original)
    real_normalized = normalize_data(real)

    print("\n" + "=" * 65)
    print("REAL RECORD CONSISTENCY DIAGNOSTIC")
    print("=" * 65)

    print("\nOriginal records:", len(original_normalized))
    print("Real records in synthetic CSV:", len(real_normalized))

    # Compare records without relying on their original row order
    comparison = original_normalized.merge(
        real_normalized,
        how="outer",
        on=FEATURES + ["target_3class"],
        indicator=True
    )

    print("\nMATCHING RESULTS")

    print(
        comparison["_merge"]
        .value_counts()
    )

    missing_from_augmented = comparison[
        comparison["_merge"] == "left_only"
    ]

    extra_in_augmented = comparison[
        comparison["_merge"] == "right_only"
    ]

    if len(missing_from_augmented) == 0 and len(extra_in_augmented) == 0:
        print("\nSUCCESS: All real records match after normalization.")
    else:
        print("\nWARNING: Some real records do not match.")

        print("\nRecords missing from augmented CSV:")
        print(
            missing_from_augmented.head(10)
            .to_string(index=False)
        )

        print("\nUnexpected records in augmented CSV:")
        print(
            extra_in_augmented.head(10)
            .to_string(index=False)
        )

    # Investigate synthetic duplicates
    synthetic = augmented[
        augmented["record_type"] == "synthetic"
    ].copy()

    synthetic_normalized = normalize_data(synthetic)

    duplicate_count = synthetic_normalized.duplicated(
        subset=FEATURES + ["target_3class"]
    ).sum()

    print("\nSYNTHETIC DUPLICATE CHECK")
    print("Synthetic records:", len(synthetic))
    print("Duplicate feature/target combinations:", duplicate_count)

    print("\nDiagnostic completed.")


if __name__ == "__main__":
    main()
