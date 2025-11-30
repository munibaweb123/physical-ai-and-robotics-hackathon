---
id: "54"
title: "Fix incorrect link on homepage"
stage: "general"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-homepage-improvement"
branch: "main"
user: "YOusuf Traders"
command: "why the home page is not working"
labels:
  - "bugfix"
  - "docusaurus"
  - "routing"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/src/pages/index.tsx"
tests_yaml: []
prompt_text: |
  why the home page is not working
response_text: |
  I found another link on the homepage that was using the incorrect format.
  
  **Fixed:**
  - The "Explore Chapters" button in the lower section was pointing to `/docs/01-foundations/01-era-of-physical-ai`.
  - I have updated it to point to `/docs/foundations/era-of-physical-ai`.
  
  If the homepage itself is not loading at all, please check your terminal for any error messages.
---
