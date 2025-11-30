import os
import json
import urllib.request
import urllib.error
import re

def get_chapter_title(content):
    """Extracts the first H1 heading as the title."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return "Unknown Chapter"

def ingest_all_chapters():
    docs_dir = "physical-ai-docs/docs"
    url = "http://localhost:8000/ingest"
    
    print(f"Scanning directory: {docs_dir}")

    # Walk through all files in the docs directory
    for root, _, files in os.walk(docs_dir):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                print(f"Processing: {file_path}")

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    title = get_chapter_title(content)
                    
                    # Prepare data payload
                    data = {
                        "raw_text": content,
                        "chapter_title": title,
                        "page_numbers": file  # Using filename as reference
                    }

                    json_data = json.dumps(data).encode("utf-8")
                    
                    req = urllib.request.Request(
                        url, 
                        data=json_data, 
                        headers={'Content-Type': 'application/json'}
                    )

                    with urllib.request.urlopen(req) as response:
                        print(f"  -> Success! Ingested '{title}'")

                except Exception as e:
                    print(f"  -> Failed to ingest {file}: {e}")

if __name__ == "__main__":
    ingest_all_chapters()