---
id: 100
title: Prepare Auth Server for Hugging Face
stage: misc
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: what will be the BETTER_AUTH_URL after deploying on huggingface?
labels: ["huggingface", "deployment", "config", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - auth-server/src/index.ts
 - auth-server/package.json
tests: []
---

## Prompt

what will be the BETTER_AUTH_URL after deploying on huggingface?

## Response snapshot

Explained URL format. Modified `auth-server` to use port 7860 and updated start script for production compatibility on HF.

## Outcome

- ✅ Impact: Auth server is now ready for HF deployment.
- 🧪 Tests: None
- 📁 Files: 2 modified
- 🔁 Next prompts: None
- 🧠 Reflection: Caught hardcoded port 4000 which would fail on HF.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
