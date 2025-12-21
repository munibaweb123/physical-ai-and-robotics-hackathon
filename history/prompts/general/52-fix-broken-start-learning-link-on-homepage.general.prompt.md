---
id: "52"
title: "Fix broken 'Start Learning' link on homepage"
stage: "general"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-homepage-improvement"
branch: "main"
user: "YOusuf Traders"
command: "start learning button link not correct"
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
  start learning button link not correct
response_text: |
  I've corrected the "Start Learning" link. Docusaurus automatically strips the number prefixes (like `01-`) from folders and filenames when generating URLs.
  
  **Correction:**
  - Old Link: `/docs/01-foundations/01-era-of-physical-ai` (Broken)
  - New Link: `/docs/foundations/era-of-physical-ai` (Fixed)
  
  Please try the button again.
---
