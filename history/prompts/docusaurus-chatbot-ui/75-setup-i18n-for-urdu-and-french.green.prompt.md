---
id: "75"
title: "Setup i18n for Urdu and French"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-i18n"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "in header include language button where 2-3 languages given like english,urdu and french..."
labels:
  - "i18n"
  - "configuration"
  - "docusaurus"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/docusaurus.config.ts"
tests_yaml: []
prompt_text: |
  in header include language button where 2-3 languages given like english,urdu and french when user click on that language book should translate on that language and shown in ui i that language
response_text: |
  I have successfully set up Internationalization (i18n) for your project!
  
  **What I did:**
  1.  **Configured Languages:** Added English (`en`), Urdu (`ur`), and French (`fr`) to `docusaurus.config.ts`.
  2.  **Added Dropdown:** Added a language switcher to the top navigation bar.
  3.  **Created Folders:** Generated the initial translation files in `physical-ai-docs/i18n/ur/` and `physical-ai-docs/i18n/fr/`.
  
  ### ⚠️ Important: How to Translate Content
  
  Docusaurus **does not automatically translate** your content (it's not like Google Translate). You must provide the translations yourself.
  
  **How to add a translation (e.g., for Urdu):**
  
  1.  **Copy the file:** Copy the English file you want to translate (e.g., `docs/intro.md`) to the Urdu folder:
      `i18n/ur/docusaurus-plugin-content-docs/current/intro.md`
  2.  **Translate it:** Open that new file and rewrite the text in Urdu.
  3.  **View it:** Run `npm start -- --locale ur` to see the Urdu version locally.
  
  Repeat this for French in the `i18n/fr` folder. The language button will switch between these versions.
---
