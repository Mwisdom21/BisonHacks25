import spacy
import subprocess

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading 'en_core_web_sm' model...")
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

def extract_keywords(prompt):
    """Extracts keywords from a text prompt."""
    doc = nlp(prompt)
    keywords = [token.text for token in doc if token.is_alpha and not token.is_stop]
    return keywords

if __name__ == "__main__":
    print(extract_keywords("How has inflation impacted food prices in the US?"))