---
id: "77"
title: "Create auto-translation script"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-i18n"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "2 .."
labels:
  - "translation"
  - "python"
  - "automation"
links:
  spec: "null"
files_yaml:
  - "translate_docs.py"
tests_yaml: []
prompt_text: |
  2 ..
response_text: |
  I have created the auto-translation script for you!
  
  **Script Name:** `translate_docs.py`
  
  **What it does:**
  1.  Reads every markdown file in your `docs` folder.
  2.  Uses your OpenAI API key to translate the content into **Urdu** and **French**.
  3.  Automatically saves them into the correct folders (`i18n/ur/...` and `i18n/fr/...`).
  
  **How to run it:**
  Make sure you are in the root directory and have your `.env` file ready.
  
  ```bash
  python translate_docs.py
  ```
  
  *Note: This might take a few minutes depending on how many files you have, as it calls the AI for each one.*
---
