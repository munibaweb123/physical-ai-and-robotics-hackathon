---
id: "69"
title: "Explain options for running chatbot on Vercel"
stage: "explainer"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "how to run chatbot on vercel?"
labels:
  - "deployment"
  - "architecture"
  - "guide"
links:
  spec: "null"
files_yaml: []
tests_yaml: []
prompt_text: |
  how to run chatbot on vercel?
response_text: |
  To "run the chatbot on Vercel" completely, you have two options:
  
  ### Option 1: The Hybrid Setup (Current & Easiest)
  **Frontend on Vercel + Backend on Your Computer**
  This is what you have now. The website is on Vercel, but it talks to your computer via `ngrok`.
  *   **Pros:** Free, no extra deployment, easy to debug.
  *   **Cons:** If you turn off your computer or close the terminal, the chatbot stops working for everyone.
  
  ### Option 2: Full Cloud Deployment (Advanced)
  **Frontend on Vercel + Backend on a Cloud Provider (e.g., Render)**
  You deploy your Python backend to a service that runs 24/7.
  *   **Pros:** Works 24/7, independent of your computer.
  *   **Cons:** Requires setting up a new account (Render, Railway, etc.), potentially some cost (though Render has a free tier).
  
  **Note:** Vercel is primarily for frontends. While it *can* run Python serverless functions, standard FastAPI apps like yours are often easier to host on dedicated backend platforms like Render or Railway for a hackathon.
  
  **Recommendation:** For a hackathon demo, stick with **Option 1** (ngrok). Just make sure your laptop is open and running `uvicorn` + `ngrok` during the presentation.
---
