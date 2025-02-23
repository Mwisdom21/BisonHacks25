import os
import requests
import kaggle
import json
import pandas as pd
from time import sleep

# Load API Key
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
KAGGLE_CONFIG_DIR = "/home/runner/workspace/config"

# Ensure Kaggle is Configured
if not os.path.exists(f"{KAGGLE_CONFIG_DIR}/kaggle.json"):
    print("⚠️ ERROR: Kaggle credentials missing! Make sure kaggle.json is in /config.")
    exit(1)

os.environ["KAGGLE_CONFIG_DIR"] = KAGGLE_CONFIG_DIR


### 🔹 Function: Fetch News Articles (Improved)
def get_news(max_articles=100):
    """Fetches news articles from multiple search queries."""
    if not NEWS_API_KEY:
        print("⚠️ ERROR: Missing NEWS_API_KEY.")
        return []

    articles = []
    seen_urls = set()
    page = 1

    # Optimized search queries
    search_queries = [
        "hospitals ICU flu",
        "hospital crisis",
        "hospital staffing shortages",
        "flu outbreak hospitals",
        "emergency room capacity",
        "COVID-19 impact on hospitals"
    ]

    print(f"\n🔹 Fetching up to {max_articles} articles for various queries...")

    for query in search_queries:
        while len(articles) < max_articles:
            url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}&language=en&pageSize=100&page={page}&sortBy=publishedAt"

            response = requests.get(url).json()
            print(f"\n🔍 Raw API Response for '{query}': {json.dumps(response, indent=2)}")  # Debugging Output

            if response.get("status") == "error":
                print(f"⚠️ News API Error: {response.get('message')}")
                break

            if response.get("status") != "ok" or response.get("totalResults", 0) == 0:
                print(f"⚠️ No articles found for: {query}")
                break

            fetched_articles = response.get("articles", [])
            if not fetched_articles:
                print("⚠️ No more articles found.")
                break

            for article in fetched_articles:
                if article["url"] not in seen_urls:
                    seen_urls.add(article["url"])
                    articles.append(article)

            if len(articles) >= max_articles:
                break

            page += 1
            sleep(1)  # Prevent hitting API rate limits

    print(f"✅ Retrieved {len(articles)} articles.")
    return articles


### 🔹 Function: Search for Kaggle Datasets
def search_kaggle_datasets():
    """Dynamically searches Kaggle for hospital-related datasets."""
    search_terms = ["hospitals", "hospital resources", "ICU capacity", "healthcare system strain"]

    print("\n🔎 Searching Kaggle for datasets related to hospital resources...\n")

    try:
        datasets = []
        for term in search_terms:
            datasets = list(kaggle.api.dataset_list(search=term))
            if datasets:
                print(f"✅ Found dataset using search term: {term}")
                break

        if datasets:
            best_match = datasets[0]  # Get the top result
            print(f"✅ Found dataset: {best_match.ref} - {best_match.title}")
            return best_match.ref
        else:
            print("⚠️ No relevant dataset found.")
            return None
    except Exception as e:
        print(f"⚠️ Kaggle search error: {e}")
        return None


### 🔹 Function: Download Dataset from Kaggle
def download_dataset(dataset_name):
    """Downloads a dataset from Kaggle."""
    if not dataset_name:
        print("⚠️ No valid dataset to download.")
        return

    print(f"\n🔹 Downloading dataset: {dataset_name}")
    dataset_url = f"https://www.kaggle.com/datasets/{dataset_name}"
    print(f"Dataset URL: {dataset_url}")

    try:
        kaggle.api.dataset_download_files(dataset_name, path="data", unzip=True)
        print(f"✅ Dataset {dataset_name} downloaded successfully!")
    except Exception as e:
        print(f"⚠️ ERROR: {e}")


### 🔹 Function: Save News Data to CSV
def save_news_to_csv(news_articles, filename="data/news_data.csv"):
    """Saves news articles to a CSV file."""
    if not news_articles:
        print("⚠️ No news articles to save.")
        return

    df = pd.DataFrame(news_articles)
    df = df[["source", "author", "title", "description", "url", "publishedAt"]]
    df.dropna(inplace=True)
    os.makedirs("data", exist_ok=True)
    df.to_csv(filename, index=False)
    print(f"✅ News data saved to {filename}")


### 🔹 Execution
if __name__ == "__main__":
    print("\n🔹 Fetching news articles...")
    articles = get_news(max_articles=200)

    if articles:
        for i, article in enumerate(articles[:5], 1):  # Show first 5 articles
            print(f"{i}. {article['title']} - {article['url']}")

    print("\n🔹 Searching for relevant hospital datasets on Kaggle...")
    dataset_name = search_kaggle_datasets()

    if dataset_name:
        print("\n🔹 Downloading dataset...")
        download_dataset(dataset_name)

    save_news_to_csv(articles)

