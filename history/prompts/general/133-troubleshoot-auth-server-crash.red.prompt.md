---
id: 133
title: Troubleshoot Persistent Auth Server Crashes
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
labels: [bug, server-crash, stability, windows]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - auth-server/auth-server.log
tests:
 - curl (failed)
 - netstat (failed)
---

## Prompt

Uncaught runtime errors:
×
ERROR
Failed to fetch
TypeError: Failed to fetch
    at betterFetch ...

## Response snapshot

Confirmed `auth-server` crashed *again* shortly after startup. Logs end abruptly. Suspect `Start-Process` or `tsx` stability issue on Windows environment.

## Outcome

- ✅ Impact: Identified root cause of "Failed to fetch" is server process termination.
- 🧪 Tests: `curl` and `netstat` confirm server is down.
- 📁 Files: Checked logs.
- 🔁 Next prompts: Attempt robust startup method (Start-Job) or investigate crash reason.
- 🧠 Reflection: Background processes on Windows via agent tools are tricky. They often get killed when the parent shell context exits if not fully detached.

## Evaluation notes (flywheel)

- Failure modes observed: Process instability.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
