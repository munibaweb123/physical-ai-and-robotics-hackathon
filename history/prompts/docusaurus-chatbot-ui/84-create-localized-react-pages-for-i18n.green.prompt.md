---
id: "84"
title: "Create localized React pages for i18n"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-i18n"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "npm start -- --locale ur this works correct but not visiting from main website"
labels:
  - "i18n"
  - "routing"
  - "docusaurus"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/i18n/ur/docusaurus-plugin-content-pages/index.tsx"
  - "physical-ai-docs/i18n/fr/docusaurus-plugin-content-pages/index.tsx"
  - "physical-ai-docs/i18n/ur/docusaurus-plugin-content-pages/chatbot.tsx"
  - "physical-ai-docs/i18n/fr/docusaurus-plugin-content-pages/chatbot.tsx"
tests_yaml: []
prompt_text: |
  npm start -- --locale ur this works correct but not visiting from main website
response_text: |
  I've created the necessary localized React pages for your Docusaurus site!
  
  **What I did:**
  *   Copied `physical-ai-docs/src/pages/index.tsx` to:
      *   `physical-ai-docs/i18n/ur/docusaurus-plugin-content-pages/index.tsx`
      *   `physical-ai-docs/i18n/fr/docusaurus-plugin-content-pages/index.tsx`
  *   Copied `physical-ai-docs/src/pages/chatbot.tsx` to:
      *   `physical-ai-docs/i18n/ur/docusaurus-plugin-content-pages/chatbot.tsx`
      *   `physical-ai-docs/i18n/fr/docusaurus-plugin-content-pages/chatbot.tsx`
  
  **To see the changes:**
  1.  **Stop and restart** your Docusaurus development server (`npm start`).
  2.  Go to `http://localhost:3000/` and try switching languages using the dropdown.
  
  You should no longer get a "Page Not Found" error for the homepage or chatbot page when switching to Urdu or French.
  
  **Next Step (for you):**
  *   The content on these new `index.tsx` and `chatbot.tsx` files is currently still in English. You will need to **manually translate the text** within these files to Urdu and French, respectively.
---
