---
id: "78"
title: "Guide to deploy backend to Render"
stage: "explainer"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "how to deploy this chatbot on render?"
labels:
  - "deployment"
  - "render"
  - "fastapi"
links:
  spec: "null"
files_yaml: []
tests_yaml: []
prompt_text: |
  how to deploy this chatbot on render?
response_text: |
  To deploy your chatbot backend on Render so it runs 24/7 (without your laptop), follow these steps:
  
  ### 1. Create a Web Service on Render
  1.  Push your latest code to GitHub (I just did this for you).
  2.  Go to [dashboard.render.com](https://dashboard.render.com) and click **"New + "** -> **"Web Service"**.
  3.  Connect your GitHub repository (`physical-ai-and-robotics-hackathon`).
  
  ### 2. Configure the Service
  *   **Name:** `physical-ai-chatbot` (or similar)
  *   **Region:** Choose one close to you (e.g., Singapore, Frankfurt, Oregon).
  *   **Runtime:** `Python 3`
  *   **Build Command:** `pip install -r requirements.txt`
  *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
  *   **Instance Type:** `Free`
  
  ### 3. Add Environment Variables
  Scroll down to the "Environment Variables" section and add these three (copy from your local `.env` file):
  *   `OPENAI_API_KEY`
  *   `QDRANT_URL`
  *   `QDRANT_API_KEY`
  
  Click **"Create Web Service"**.
  
  ### 4. Final Step: Update Frontend
  Once Render finishes deploying, it will give you a URL (e.g., `https://physical-ai-chatbot.onrender.com`).
  
  1.  Copy that URL.
  2.  Go to `physical-ai-docs/src/components/Chatbot/index.tsx` in your code.
  3.  Replace your `ngrok` link with this new Render URL (keep the `/chat` at the end).
  4.  Run `vercel --prod --yes` to update your website.
---
