import pandas as pd
import os
import re

# **Step 1: Detect Available Files**
data_dir = "data"
files = os.listdir(data_dir)
print(f"🔍 Available datasets: {files}")

# **Step 2: Locate Hospital & News Data Files**
hospital_data_file = next((f for f in files if "hospital" in f.lower()), None)
news_data_file = os.path.join(data_dir, "news_data.csv")
insights_csv = os.path.join(data_dir, "insights_data_cleaned.csv")

if not hospital_data_file:
    print("⚠️ No hospital dataset found.")
    exit()

hospital_data_path = os.path.join(data_dir, hospital_data_file)

if not os.path.exists(news_data_file):
    print(f"⚠️ No news dataset found at: {news_data_file}")
    exit()

# **Step 3: Load Hospital Data**
try:
    if hospital_data_path.endswith(".xlsx"):
        hospital_df = pd.read_excel(hospital_data_path, engine="openpyxl")
    else:
        hospital_df = pd.read_csv(hospital_data_path, encoding="utf-8")

    print(f"✅ Successfully loaded hospital dataset: {hospital_data_file}")
except Exception as e:
    print(f"⚠️ Error loading hospital dataset: {e}")
    exit()

# **Step 4: Load News Data**
try:
    news_df = pd.read_csv(news_data_file, encoding="utf-8")
    print(f"✅ Successfully loaded news dataset: {news_data_file}")
except Exception as e:
    print(f"⚠️ Error loading news dataset: {e}")
    exit()

# **Step 5: Function to Clean Data**
def clean_data(df, key_columns=None):
    """Cleans the dataset by removing duplicates, empty rows, and malformed data."""
    df.drop_duplicates(inplace=True)  # Remove duplicate rows
    df.dropna(how="all", inplace=True)  # Remove fully empty rows
    if key_columns:
        df.dropna(subset=key_columns, inplace=True)  # Drop rows missing key fields
    df.fillna("", inplace=True)  # Replace NaNs with empty strings
    return df

# **Step 6: Clean Dataframes**
hospital_df = clean_data(hospital_df)
news_df = clean_data(news_df, key_columns=["source", "title", "url"])  # Ensure key fields exist in news data

# **Step 7: Ensure Unique Column Names for Merging**
hospital_df = hospital_df.add_prefix("Hospital_")
news_df = news_df.add_prefix("News_")

# **Step 8: Merge Data Horizontally**
try:
    merged_df = pd.concat([hospital_df.reset_index(drop=True), news_df.reset_index(drop=True)], axis=1)
    print("✅ Successfully merged hospital and news data!")
except Exception as e:
    print(f"⚠️ Error merging data: {e}")
    exit()

# **Step 9: Save to CSV (No Excel)**
try:
    merged_df.to_csv(insights_csv, index=False, encoding="utf-8")
    print(f"✅ Cleaned Insights saved to CSV: {insights_csv}")
except Exception as e:
    print(f"⚠️ Error saving CSV: {e}")
