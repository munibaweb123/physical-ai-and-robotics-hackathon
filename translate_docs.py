import os
import openai
from dotenv import load_dotenv

# Load environment variables (API key)
load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configuration
SOURCE_DIR = "physical-ai-docs/docs"
LANGUAGES = {
    "ur": "Urdu",
    "fr": "French"
}

def translate_text(text, target_language):
    """
    Translates markdown text to the target language using OpenAI.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o", # Or gpt-3.5-turbo
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"You are a professional technical translator. Translate the following Markdown content into {target_language}. "
                        "Preserve all Markdown formatting (headers, bold, links, code blocks, frontmatter). "
                        "Do NOT translate code blocks or file paths. "
                        "Maintain the original tone."
                    )
                },
                {"role": "user", "content": text}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error translating to {target_language}: {e}")
        return None

def main():
    print("Starting auto-translation...")

    # Walk through all files in the docs directory
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            if file.endswith(".md") or file.endswith(".mdx"):
                source_path = os.path.join(root, file)
                
                # Calculate relative path to maintain structure
                relative_path = os.path.relpath(source_path, SOURCE_DIR)
                
                print(f"\nProcessing: {relative_path}")

                with open(source_path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Translate for each target language
                for lang_code, lang_name in LANGUAGES.items():
                    print(f"  -> Translating to {lang_name} ({lang_code})...")
                    
                    translated_content = translate_text(content, lang_name)
                    
                    if translated_content:
                        # Construct target path
                        target_dir = os.path.join(
                            "physical-ai-docs/i18n", 
                            lang_code, 
                            "docusaurus-plugin-content-docs/current", 
                            os.path.dirname(relative_path)
                        )
                        target_file = os.path.join(target_dir, file)

                        # Create directories if they don't exist
                        os.makedirs(target_dir, exist_ok=True)

                        # Save translated file
                        with open(target_file, "w", encoding="utf-8") as f:
                            f.write(translated_content)
                        
                        print(f"     Saved to: {target_file}")
                    else:
                        print(f"     Skipped {lang_name} due to error.")

    print("\nTranslation complete!")

if __name__ == "__main__":
    main()
