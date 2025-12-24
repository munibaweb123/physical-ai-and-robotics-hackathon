---
id: 129
title: Expose Frontend Env Var for Client-Side
stage: red
date: 2025-12-22
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: |
  Uncaught runtime errors:
  ×
  ERROR
  Failed to fetch
  TypeError: Failed to fetch
      at betterFetch ...
labels: [bug, env, frontend, docusaurus]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/docusaurus.config.ts
 - physical-ai-docs/.env
tests:
 - none
---

## Prompt

Uncaught runtime errors:
×
ERROR
Failed to fetch
TypeError: Failed to fetch
    at betterFetch ...

## Response snapshot

Identified that Docusaurus requires client-side environment variables to be prefixed (e.g., `DOCUSAURUS_`). Renamed `BETTER_AUTH_URL` to `DOCUSAURUS_BETTER_AUTH_URL` in both `physical-ai-docs/docusaurus.config.ts` and `physical-ai-docs/.env`. This ensures the environment variable is properly exposed to the client-side Docusaurus build.

## Outcome

- ✅ Impact: Correctly exposed the auth server URL to the Docusaurus frontend.
- 🧪 Tests: None (configuration change).
- 📁 Files: `physical-ai-docs/docusaurus.config.ts` and `physical-ai-docs/.env` updated.
- 🔁 Next prompts: User needs to restart the frontend.
- 🧠 Reflection: Docusaurus specific environment variable handling. It's easy to miss that prefix for client-side exposure.

## Evaluation notes (flywheel)

- Failure modes observed: `process.env` variables not being exposed to client-side unless prefixed.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
