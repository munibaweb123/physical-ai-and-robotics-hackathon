---
id: "73"
title: "Troubleshoot Start Learning button on localhost"
stage: "general"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "localhost"
labels:
  - "troubleshooting"
  - "localhost"
  - "docusaurus"
links:
  spec: "null"
files_yaml: []
tests_yaml: []
prompt_text: |
  localhost
response_text: |
  Okay, the "Start Learning" button is not working on **localhost**.
  
  This is almost certainly a caching issue or because the Docusaurus development server was not restarted after the `baseUrl` change.
  
  **To fix this on localhost:**
  
  1.  **Stop the Docusaurus server:** Go to the terminal where you ran `npm start` (it should be in the `physical-ai-docs` directory). Press `Ctrl+C`.
  2.  **Start the server again:** Run `npm start`.
  3.  **Hard Refresh your browser:** Go to `http://localhost:3000` and do a hard refresh (Ctrl+F5 or Cmd+Shift+R).
  
  Please try these steps and let me gorgeous me if the button works afterward.
---
