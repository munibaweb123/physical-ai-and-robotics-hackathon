---
id: "76"
title: "Explain auto-translation options"
stage: "explainer"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-i18n"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "there can be auto translate option?"
labels:
  - "i18n"
  - "translation"
  - "options"
links:
  spec: "null"
files_yaml: []
tests_yaml: []
prompt_text: |
  there can be auto translate option?
response_text: |
  No, Docusaurus **does not** have a built-in "auto-translate" button (like Chrome's right-click translate). It is designed for *manual*, high-quality translations.
  
  However, you have two options to achieve "auto-translation":
  
  ### Option 1: The "Google Translate Widget" (Easiest)
  We can add a snippet of code that adds a Google Translate bar to your site.
  *   **Pros:** Instantly translates everything into 100+ languages. Zero effort.
  *   **Cons:** Translations can be inaccurate. It doesn't create real files.
  
  ### Option 2: AI-Generated Files (Best Quality)
  I can write a script for you that uses OpenAI (like your chatbot) to read your English files and **automatically create** the Urdu and French markdown files for you.
  *   **Pros:** Creates real, SEO-friendly pages. You can edit them later. High quality.
  *   **Cons:** You have to run the script once to generate the files.
  
  **Which one would you like me to do?**
  *   **Type "1"** for the Google Widget.
  *   **Type "2"** for the AI Script.
---
