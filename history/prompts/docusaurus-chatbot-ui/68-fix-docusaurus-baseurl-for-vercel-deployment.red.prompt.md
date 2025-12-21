---
id: "68"
title: "Fix Docusaurus baseUrl for Vercel deployment"
stage: "red"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-deployment"
branch: "feature/docusaurus-chatbot-clean"
user: "YOusuf Traders"
command: "Your Docusaurus site did not load properly. A very common reason is a wrong site baseUrl configuration. Current configured baseUrl = /physical-ai-and-robotics-hackathon/ We suggest trying baseUrl = /"
labels:
  - "bugfix"
  - "docusaurus"
  - "vercel"
  - "configuration"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/docusaurus.config.ts"
tests_yaml: []
prompt_text: |
  Your Docusaurus site did not load properly.

  A very common reason is a wrong site baseUrl configuration.

  Current configured baseUrl = /physical-ai-and-robotics-hackathon/

  We suggest trying baseUrl = /
response_text: |
  I have corrected the `baseUrl` in your Docusaurus configuration for Vercel deployment.
  
  **The Issue:**
  Docusaurus `baseUrl` was set for a GitHub Pages-like subdirectory (`/physical-ai-and-robotics-hackathon/`), but Vercel deploys to the root of its provided domain.
  
  **The Fix:**
  I changed `baseUrl` from `/physical-ai-and-robotics-hackathon/` to `/` in `physical-ai-docs/docusaurus.config.ts`.
  
  **New Live URL:** [https://physical-ai-docs-65oltfngt-hayas-projects-72e84e07.vercel.app](https://physical-ai-docs-65oltfngt-hayas-projects-72e84e07.vercel.app)
  
  Please check this new URL. The site should now load correctly. Remember to keep your ngrok tunnel and backend running for the chatbot to function.
---
