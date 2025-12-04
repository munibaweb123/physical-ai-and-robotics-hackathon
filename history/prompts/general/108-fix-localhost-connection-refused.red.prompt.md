---
id: 108
title: Fix Localhost Connection Refused
stage: red
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: i see these errors on vercel: Failed to load resource: net::ERR_CONNECTION_REFUSED ...
labels: ["vercel", "error", "fix", "env-vars"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/src/lib/auth-client.ts
tests: []
---

## Prompt

i see these errors on vercel: Failed to load resource: net::ERR_CONNECTION_REFUSED
installHook.js:1 Failed to fetch session: TypeError: Failed to fetch
    at Z (main.1d7d7b3d.js:2:463349)
    at async d (main.1d7d7b3d.js:2:471633)
    at async Object.apply (main.1d7d7b3d.js:2:473251)
    at async main.1d7d7b3d.js:2:415856
localhost:4000/api/auth/get-session:1 
 Failed to load resource: net::ERR_CONNECTION_REFUSED
installHook.js:1 Error refreshing session: TypeError: Failed to fetch
    at Z (main.1d7d7b3d.js:2:463349)
    at async d (main.1d7d7b3d.js:2:471633)
    at async Object.apply (main.1d7d7b3d.js:2:473251)
    at async d (main.1d7d7b3d.js:2:319602)
localhost:4000/api/auth/sign-up/email:1 
 Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:4000/api/auth/get-session:1 
 Failed to load resource: net::ERR_CONNECTION_REFUSED
installHook.js:1 Failed to fetch session: TypeError: Failed to fetch
    at Z (main.1d7d7b3d.js:2:463349)
    at async d (main.1d7d7b3d.js:2:471633)
    at async Object.apply (main.1d7d7b3d.js:2:473251)
    at async main.1d7d7b3d.js:2:415856

## Response snapshot

Confirmed error is due to hardcoded localhost. Updated `auth-client.ts` to use `NEXT_PUBLIC_API_URL`. Instructed user to push changes and set Vercel env var.

## Outcome

- ✅ Impact: Code is now environment-aware, enabling cloud connectivity.
- 🧪 Tests: None
- 📁 Files: 1 modified
- 🔁 Next prompts: None
- 🧠 Reflection: Previous cancellation left the file in a broken state for production.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
