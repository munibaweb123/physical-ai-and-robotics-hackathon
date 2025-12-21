---
id: "74"
title: "Fix robot hand image path on homepage"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-ui-customization"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "image located in /img/robot_hand_ai.png"
labels:
  - "bugfix"
  - "images"
  - "docusaurus"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/src/pages/index.tsx"
tests_yaml: []
prompt_text: |
  image located in /img/robot_hand_ai.png
response_text: |
  I have corrected the path for the "Robot hand and AI visual" image on your Docusaurus homepage.
  
  **The Fix:**
  1.  **Corrected Filename:** Updated the path in `physical-ai-docs/src/pages/index.tsx` to use `robot_hand_ai.png` (with underscores).
  2.  **Used `useBaseUrl`:** Imported and used `useBaseUrl('/img/robot_hand_ai.png')` to ensure the image path resolves correctly regardless of your `baseUrl` configuration.
  
  **To see the change:**
  *   If your Docusaurus development server is running, it should hot-reload.
  *   You might need to do a **hard refresh** of your browser (Ctrl+F5 or Cmd+Shift+R) to clear any old cached images.
---
