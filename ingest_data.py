import json
import urllib.request
import urllib.error

def ingest_data():
    file_path = "physical-ai-docs/docs/01-foundations/01-era-of-physical-ai.md"
    url = "http://localhost:8000/ingest"

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        data = {
            "raw_text": content,
            "chapter_title": "The Era of Physical AI",
            "page_numbers": "1-5"
        }

        json_data = json.dumps(data).encode("utf-8")
        
        req = urllib.request.Request(
            url, 
            data=json_data, 
            headers={'Content-Type': 'application/json'}
        )

        with urllib.request.urlopen(req) as response:
            print(f"Success! Response: {response.read().decode('utf-8')}")

    except FileNotFoundError:
        print(f"Error: Could not find file at {file_path}")
    except urllib.error.URLError as e:
        print(f"Error sending request: {e}")
        if hasattr(e, 'read'):
             print(f"Details: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    ingest_data()
