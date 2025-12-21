---
id: "82"
title: "Troubleshoot Urdu 404 with existing files"
stage: "general"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-i18n"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "i think its not redirecting to correct url"
labels:
  - "troubleshooting"
  - "i18n"
  - "docusaurus"
links:
  spec: "null"
files_yaml: []
tests_yaml: []
prompt_text: |
  i think its not redirecting to correct url
response_text: |
  I've verified that the Urdu translation file **does exist**:
  `physical-ai-docs/i18n/ur/docusaurus-plugin-content-docs/current/01-foundations/01-era-of-physical-ai.md`
  
  This means the "Page Not Found" error is likely due to **how Docusaurus handles the server restart.**
  
  **Please try this specific sequence:**
  
  1.  **Stop the server:** Go to your `npm start` terminal and press `Ctrl+C` **twice** to ensure it's dead.
  2.  **Clean the cache:** Run this command in the terminal:
      ```bash
      npm run clear
      ```
  3.  **Start the server with Urdu specifically** (just to test):
      ```bash
      npm start -- --locale ur
      ```
  
  If this works and you see the Urdu site, then the issue was just a cache/restart problem. You can then stop it and run normal `npm start`.
---
