---
id: "67"
title: "Update frontend with ngrok URL and redeploy"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "https://caridad-nosogeographic-faye.ngrok-free.dev -> http://localhost:8000"
labels:
  - "deployment"
  - "ngrok"
  - "frontend"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/src/components/Chatbot/index.tsx"
tests_yaml: []
prompt_text: |
  https://caridad-nosogeographic-faye.ngrok-free.dev -> http://localhost:8000
response_text: |
  I have updated the frontend to use your ngrok URL and redeployed it.
  
  **New Live URL:** [https://physical-ai-docs-k07pkuv8y-hayas-projects-72e84e07.vercel.app](https://physical-ai-docs-k07pkuv8y-hayas-projects-72e84e07.vercel.app)
  
  Now, when you visit this URL, the chatbot should be able to communicate with your backend running locally through the ngrok tunnel.
---
