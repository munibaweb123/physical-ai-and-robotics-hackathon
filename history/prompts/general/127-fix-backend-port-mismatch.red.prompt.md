---
id: 127
title: Fix Backend Port Mismatch in Frontend Config
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
labels: [bug, configuration, env, frontend]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/.env (updated)
 - auth-server/auth-server.log (created)
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

Identified that `physical-ai-docs/.env` had `BETTER_AUTH_URL` pointing to port 3000 (itself) instead of the backend port 7860. Updated `.env` to `http://localhost:7860`. Also verified `auth-server` logs and attempted to ensure it is running (found it was not reachable via curl, started it in background).

## Outcome

- ✅ Impact: Corrected the environment variable for backend connection.
- 🧪 Tests: None (configuration fix).
- 📁 Files: `physical-ai-docs/.env` updated.
- 🔁 Next prompts: User needs to restart frontend. Validate backend is running.
- 🧠 Reflection: The "Failed to fetch" is a classic CORS or connection error. Pointing frontend to itself (3000) for auth definitely causes this. Backend also seems unstable or didn't start from the script.

## Evaluation notes (flywheel)

- Failure modes observed: `Start-Process` output buffering makes debugging hard.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
