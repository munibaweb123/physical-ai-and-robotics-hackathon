---
id: 96
title: Troubleshoot Vercel 404 Error
stage: red
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: 404: NOT_FOUND Code: NOT_FOUND ID: dxb1:dxb1::wx8j7-1764869696550-16532aaccd1f
labels: ["vercel", "error", "404", "configuration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files: []
tests: []
---

## Prompt

404: NOT_FOUND
Code: NOT_FOUND
ID: dxb1:dxb1::wx8j7-1764869696550-16532aaccd1f

## Response snapshot

Identified incorrect `baseUrl` in `docusaurus.config.ts`. It is set for GitHub Pages (`/physical-ai-and-robotics-hackathon/`) but Vercel serves at root. Advice: change `baseUrl` to `/`.

## Outcome

- ✅ Impact: Diagnosed root cause of 404.
- 🧪 Tests: None
- 📁 Files: None
- 🔁 Next prompts: Fix baseUrl in config
- 🧠 Reflection: Common issue when migrating from GH Pages to Vercel.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
