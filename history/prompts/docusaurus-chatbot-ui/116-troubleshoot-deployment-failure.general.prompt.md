---
id: "116-troubleshoot-deployment-failure"
title: "Troubleshoot Deployment Failure"
stage: "general"
date: "2025-12-05"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "User"
command: "troubleshoot-deployment"
labels:
  - "deployment"
  - "debugging"
  - "vercel"
  - "frontend"
links:
  - spec: null
  - ticket: null
  - adr: null
  - pr: null
files:
  - "physical-ai-docs/src/pages/debug.tsx"
tests:
  - "manual verification of debug page"
prompt: |
  not works after deployment?
response: |
  Created `physical-ai-docs/src/pages/debug.tsx` to help the user verify if environment variables are correctly loaded in the production build. Instructed the user to push changes, visit the `/debug` page, and inspect the browser console for specific error messages (CORS, 404, etc.).
---
