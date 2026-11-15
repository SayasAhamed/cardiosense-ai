
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET_FILE = BASE_DIR / "datasets" / "heart_disease_uci.csv"

OUTPUT_DIR = BASE_DIR / "ml-models" / "reports"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def main():

    df = pd.read_csv(DATASET_FILE)

    # Create the three-class target
    df["target_3class"] = df["num"].map({
        0: 0,
        1: 1,
        2: 1,
        3: 2,
        4: 2
    })

    print("\n" + "=" * 70)
    print("CARDIOSENSE AI - MISSING VALUE ANALYSIS")
    print("=" * 70)

    # 1. Overall missing values
    print("\n1. Overall missing values")

    missing = pd.DataFrame({
        "Missing_Count": df.isnull().sum(),
        "Missing_Percentage": (
            df.isnull().mean() * 100
        ).round(2)
    })

    missing = missing.sort_values(
        "Missing_Count",
        ascending=False
    )

    print(missing.to_string())

    # 2. Missing values by original source
    print("\n2. Missing values by source database")

    source_missing = (
        df.groupby("dataset")
        .apply(
            lambda group: group.isnull().sum(),
            include_groups=False
        )
    )

    print(source_missing.to_string())

    # 3. Missing values by severity class
    print("\n3. Missing values by severity class")

    class_missing = (
        df.groupby("target_3class")
        .apply(
            lambda group: group.isnull().sum(),
            include_groups=False
        )
    )

    print(class_missing.to_string())

    # 4. Class distribution by source
    print("\n4. Class distribution by source")

    source_classes = pd.crosstab(
        df["dataset"],
        df["target_3class"],
        margins=True
    )

    print(source_classes.to_string())

    # 5. Complete versus incomplete records
    print("\n5. Complete versus incomplete records")

    df["record_status"] = df.isnull().any(axis=1).map({
        True: "Incomplete",
        False: "Complete"
    })

    print(
        pd.crosstab(
            df["record_status"],
            df["target_3class"],
            margins=True
        )
    )

    # 6. Save reports
    missing.to_csv(
        OUTPUT_DIR / "missing_value_summary.csv"
    )

    source_missing.to_csv(
        OUTPUT_DIR / "missing_by_source.csv"
    )

    class_missing.to_csv(
        OUTPUT_DIR / "missing_by_class.csv"
    )

    source_classes.to_csv(
        OUTPUT_DIR / "class_distribution_by_source.csv"
    )

    print("\nReports saved in:")
    print(OUTPUT_DIR)

    print("\nMissing-value analysis completed.")


if __name__ == "__main__":
    main()
