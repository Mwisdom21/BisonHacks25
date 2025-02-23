import pandas as pd
import openpyxl
import re

# Define file paths
csv_file = "data/news_data.csv"
excel_file = "data/news_data.xlsx"

# Function to clean text and remove illegal characters
def clean_text(text):
    if isinstance(text, str):
        return re.sub(r"[^\x20-\x7E]", "", text)  # Remove non-ASCII characters
    return text

try:
    # Load CSV with explicit UTF-8 encoding
    df = pd.read_csv(csv_file, encoding="utf-8")

    # Apply cleaning function to all text fields
    df = df.applymap(clean_text)

    # Print preview of cleaned data
    print("\n🔍 Preview of Cleaned CSV Data:")
    print(df.head())

    # Save to Excel using `openpyxl` to avoid corruption
    df.to_excel(excel_file, index=False, engine="openpyxl")

    print(f"✅ Successfully converted {csv_file} to {excel_file}")

except Exception as e:
    print(f"⚠️ ERROR converting CSV to Excel: {e}")
