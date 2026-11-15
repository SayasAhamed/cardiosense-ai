
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

ORIGINAL_FILE = BASE_DIR / "datasets" / "heart_disease_uci.csv"

SYNTHETIC_FILE = (
    BASE_DIR
    / "datasets"
    / "synthetic"
    / "cardiosense_3000_balanced_synthetic_dataset.csv"
)

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalch", "exang",
    "oldpeak", "slope", "ca", "thal"
]

TARGET = "target_3class"


def main():

    original = pd.read_csv(ORIGINAL_FILE)
    augmented = pd.read_csv(SYNTHETIC_FILE)

    print("\n" + "=" * 65)
    print("CARDIOSENSE AI - DETAILED DATASET AUDIT")
    print("=" * 65)

    # 1. Validate required columns
    required = FEATURES + [TARGET, "record_type"]

    missing_columns = [
        col for col in required if col not in augmented.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns in synthetic dataset: {missing_columns}"
        )

    # 2. Original complete records
    clean_original = original.dropna(
        subset=FEATURES + ["num"]
    ).copy()

    clean_original[TARGET] = (
        clean_original["num"]
        .map({
            0: 0,
            1: 1,
            2: 1,
            3: 2,
            4: 2
        })
    )

    print("\n1. Original complete records")
    print(f"Complete records: {len(clean_original)}")

    print("\nOriginal three-class distribution")

    print(
        clean_original[TARGET]
        .value_counts()
        .sort_index()
    )

    # 3. Record origin counts
    print("\n2. Record origin")

    print(
        augmented["record_type"]
        .value_counts(dropna=False)
    )

    real = augmented[
        augmented["record_type"] == "real"
    ].copy()

    synthetic = augmented[
        augmented["record_type"] == "synthetic"
    ].copy()

    # 4. Class distribution
    print("\n3. Class distribution by record origin")

    print(
        pd.crosstab(
            augmented["record_type"],
            augmented[TARGET],
            margins=True
        )
    )

    # 5. Duplicate investigation
    comparison_columns = FEATURES + [TARGET]

    print("\n4. Exact duplicate investigation")

    print(
        "Duplicates across all columns:",
        augmented.duplicated().sum()
    )

    print(
        "Real duplicate feature/target rows:",
        real.duplicated(subset=comparison_columns).sum()
    )

    print(
        "Synthetic duplicate feature/target rows:",
        synthetic.duplicated(subset=comparison_columns).sum()
    )

    print(
        "Duplicate feature/target rows across entire dataset:",
        augmented.duplicated(
            subset=comparison_columns
        ).sum()
    )

    # 6. Target validity
    print("\n5. Target validity")

    print("Target values:", sorted(augmented[TARGET].unique()))

    invalid_targets = augmented[
        ~augmented[TARGET].isin([0, 1, 2])
    ]

    print("Invalid target records:", len(invalid_targets))

    # 7. Compare real records against original complete records
    print("\n6. Real record consistency check")

    original_real = clean_original[
        FEATURES + [TARGET]
    ].copy()

    augmented_real = real[
        FEATURES + [TARGET]
    ].copy()

    original_real = original_real.reset_index(drop=True)
    augmented_real = augmented_real.reset_index(drop=True)

    original_real = original_real.sort_values(
        by=FEATURES + [TARGET]
    ).reset_index(drop=True)

    augmented_real = augmented_real.sort_values(
        by=FEATURES + [TARGET]
    ).reset_index(drop=True)

    if len(original_real) == len(augmented_real):

        comparison = original_real.equals(augmented_real)

        print("Same record count:", True)
        print("Identical feature and target values:", comparison)

    else:

        print("Same record count:", False)
        print(
            "Original complete records:",
            len(original_real)
        )
        print(
            "Real records in augmented dataset:",
            len(augmented_real)
        )

    # 8. Save audit report
    report_dir = BASE_DIR / "ml-models" / "reports"
    report_dir.mkdir(parents=True, exist_ok=True)

    class_distribution = pd.crosstab(
        augmented["record_type"],
        augmented[TARGET]
    )

    class_distribution.to_csv(
        report_dir / "class_distribution_by_origin.csv"
    )

    print("\nAudit output saved to:")
    print(report_dir / "class_distribution_by_origin.csv")

    print("\n" + "=" * 65)
    print("DATASET AUDIT COMPLETED")
    print("=" * 65)


if __name__ == "__main__":
    main()
