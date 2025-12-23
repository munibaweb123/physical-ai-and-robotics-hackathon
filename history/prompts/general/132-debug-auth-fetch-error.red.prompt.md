---
id: 132
title: Debug Auth Fetch Error and Restart Server
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
labels: [bug, debug, server-crash, frontend]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/src/lib/auth-client.ts (updated)
 - auth-server/auth-server.log (inspected)
tests:
 - curl check (failed)
---

## Prompt

Uncaught runtime errors:
×
ERROR
Failed to fetch
TypeError: Failed to fetch
    at betterFetch ...

## Response snapshot

Added console logging to `physical-ai-docs/src/lib/auth-client.ts` to verify the `authBaseUrl` seen by the client. Diagnosed that `auth-server` on port 7860 silently crashed or stopped (port 7860 is free). Planned to restart `auth-server` using `npm start` (production mode) instead of `npm run dev` (watch mode) to potentially improve stability.

## Outcome

- ✅ Impact: Added debugging capability and identified server downtime.
- 🧪 Tests: Port check (netstat) confirmed server is down.
- 📁 Files: `physical-ai-docs/src/lib/auth-client.ts` updated.
- 🔁 Next prompts: Restart auth server and verify.
- 🧠 Reflection: `tsx watch` (dev mode) is often flaky in background processes or when input streams are detached/closed. Switching to `tsx` directly (start) is safer.

## Evaluation notes (flywheel)

- Failure modes observed: Silent process exit of `auth-server`.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
