---
id: "66"
title: "Deploy frontend to Vercel"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "deploy the frontend to vercel"
labels:
  - "deployment"
  - "vercel"
  - "frontend"
links:
  spec: "null"
files_yaml: []
tests_yaml: []
prompt_text: |
  deploy the frontend to vercel
response_text: |
  I have successfully deployed your frontend to Vercel!
  
  **Live URL:** [https://physical-ai-docs-7ix3nj3hi-hayas-projects-72e84e07.vercel.app](https://physical-ai-docs-7ix3nj3hi-hayas-projects-72e84e07.vercel.app)
  
  ---
  
  ### ⚠️ Important: Chatbot Connection Issue
  
  Your deployed site is on **HTTPS**, but your backend is on **HTTP** (localhost). Browsers block this connection ("Mixed Content"), so **the chatbot will not work on the live site** yet.
  
  **How to fix it (Hackathon Quick Fix):**
  1.  **Use ngrok:** Download and run `ngrok http 8000` in a new terminal. This gives you a public HTTPS URL for your backend.
  2.  **Update Frontend:** Change `http://localhost:8000` to your new ngrok URL in `physical-ai-docs/src/components/Chatbot/index.tsx`.
  3.  **Redeploy:** Run `vercel --prod --yes` in the `physical-ai-docs` folder again.
  
  Let me know if you want help setting up ngrok!
---
