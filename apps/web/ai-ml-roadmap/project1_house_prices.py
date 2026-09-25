"""
Project 1 — House Price Predictor
=================================
Your first end-to-end machine learning project.

WHAT IT DOES
  Loads the California Housing dataset, explores it, trains two models
  (Linear Regression and Random Forest), and compares how well they predict
  house prices.

HOW TO RUN
  1) Easiest: paste this into Google Colab (colab.research.google.com) and run.
     Colab already has every library installed — nothing to set up.
  2) On your PC:
        pip install numpy pandas matplotlib scikit-learn
        python project1_house_prices.py

Read every comment. Change things. Break it. That's how you learn.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score


# ----------------------------------------------------------------------
# 1. LOAD THE DATA
# ----------------------------------------------------------------------
# fetch_california_housing() returns features (X) about neighbourhoods and a
# target (y) = median house value (in $100,000s).
data = fetch_california_housing(as_frame=True)
df = data.frame          # a pandas DataFrame with everything together
target_col = "MedHouseVal"

print("=" * 60)
print("STEP 1 - First look at the data")
print("=" * 60)
print("Shape (rows, columns):", df.shape)
print("\nFirst 5 rows:")
print(df.head())


# ----------------------------------------------------------------------
# 2. EXPLORE (EDA — Exploratory Data Analysis)
# ----------------------------------------------------------------------
print("\n" + "=" * 60)
print("STEP 2 - Explore")
print("=" * 60)
print("\nSummary statistics:")
print(df.describe())

print("\nMissing values per column:")
print(df.isnull().sum())   # this dataset is clean, but ALWAYS check

# A couple of quick plots so you SEE the data (saved to files).
df[target_col].hist(bins=50)
plt.title("Distribution of house values")
plt.xlabel("Median house value ($100,000s)")
plt.ylabel("Number of neighbourhoods")
plt.tight_layout()
plt.savefig("eda_target_hist.png", dpi=110)
plt.close()

# Income tends to drive house prices — let's check that relationship.
plt.scatter(df["MedInc"], df[target_col], s=4, alpha=0.3)
plt.title("Median income vs house value")
plt.xlabel("Median income")
plt.ylabel("Median house value ($100,000s)")
plt.tight_layout()
plt.savefig("eda_income_vs_price.png", dpi=110)
plt.close()
print("\nSaved 2 charts: eda_target_hist.png, eda_income_vs_price.png")


# ----------------------------------------------------------------------
# 3. SPLIT INTO TRAINING AND TEST SETS
# ----------------------------------------------------------------------
# We train on one part and test on data the model has never seen. This is how
# we estimate real-world performance instead of fooling ourselves.
X = df.drop(columns=[target_col])   # all columns except the answer
y = df[target_col]                  # the answer we want to predict

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42   # 80% train, 20% test
)
print("\n" + "=" * 60)
print("STEP 3 - Train/test split")
print("=" * 60)
print("Training rows:", X_train.shape[0], "| Test rows:", X_test.shape[0])


# ----------------------------------------------------------------------
# 4. TRAIN + EVALUATE A HELPER
# ----------------------------------------------------------------------
def evaluate(model, name):
    """Train a model, predict on the test set, print RMSE and R2."""
    model.fit(X_train, y_train)              # learn from training data
    preds = model.predict(X_test)            # predict on unseen data
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    print(f"\n{name}")
    print("-" * len(name))
    print(f"  RMSE (avg error, lower is better): {rmse:.3f}  (~${rmse*100000:,.0f})")
    print(f"  R^2  (1.0 is perfect, higher better): {r2:.3f}")
    return rmse, r2


print("\n" + "=" * 60)
print("STEP 4 - Train two models and compare")
print("=" * 60)

lin_rmse, lin_r2 = evaluate(LinearRegression(), "Linear Regression")
rf_rmse, rf_r2 = evaluate(
    RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1),
    "Random Forest",
)


# ----------------------------------------------------------------------
# 5. WHICH MODEL WON? + FEATURE IMPORTANCE
# ----------------------------------------------------------------------
print("\n" + "=" * 60)
print("STEP 5 - Verdict")
print("=" * 60)
winner = "Random Forest" if rf_r2 > lin_r2 else "Linear Regression"
print(f"Best model by R^2: {winner}")

# Random forests can tell us which features mattered most.
rf = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
importances = pd.Series(rf.feature_importances_, index=X.columns).sort_values()
importances.plot(kind="barh")
plt.title("Which features drive the prediction? (Random Forest)")
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=110)
plt.close()
print("Saved feature_importance.png")
print("\nMost important features:")
print(importances.sort_values(ascending=False).head(3))

print("\n" + "=" * 60)
print("DONE! Next steps to make this portfolio-worthy:")
print("=" * 60)
print("""
  1. Put this on GitHub with a README (problem, approach, results, charts).
  2. Try adding a new feature (e.g. rooms per household) and see if RMSE drops.
  3. Try another model: from sklearn.ensemble import GradientBoostingRegressor
  4. Write 3-4 sentences on what you learned.
""")
