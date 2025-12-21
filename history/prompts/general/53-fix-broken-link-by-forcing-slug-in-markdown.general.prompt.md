---
id: "53"
title: "Fix broken link by forcing slug in markdown"
stage: "general"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-homepage-improvement"
branch: "main"
user: "YOusuf Traders"
command: "start learning button still not working"
labels:
  - "bugfix"
  - "docusaurus"
  - "routing"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/docs/01-foundations/01-era-of-physical-ai.md"
tests_yaml: []
prompt_text: |
  start learning button still not working
response_text: |
  I have forced the URL to be correct by adding a `slug` to the markdown file itself.
  
  1.  **Modified File**: `physical-ai-docs/docs/01-foundations/01-era-of-physical-ai.md`
  2.  **Change**: Added `slug: /foundations/era-of-physical-ai` to the frontmatter.
  
  This explicitly sets the URL to `/docs/foundations/era-of-physical-ai`, which matches the button link I updated previously.
  
  Please try the button one more time. You may need to refresh the page.
---
