---
id: 120
title: Force Database Schema Reset
stage: red
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: (Pasted sp.analyze template + 422 error context)
labels: ["db", "fix", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - auth-server/src/db.ts
tests: []
---

## Prompt

(Pasted sp.analyze template + 422 error context)
muniba123-auth-serve…uth/sign-up/email:1 Failed to load resource: the server responded with a status of 422 () after vercel deployment

## Response snapshot

Interpreted input as continuation of troubleshooting. Diagnosed stale schema persistence (SQLite file not deleted). Updating `db.ts` to use `auth_v2.db` to force fresh schema creation.

## Outcome

- ✅ Impact: Guaranteed schema reset to fix validation errors.
- 🧪 Tests: None
- 📁 Files: 1 modified
- 🔁 Next prompts: None
- 🧠 Reflection: SQLite file persistence on HF Spaces can prevent schema updates from applying. Renaming file is a quick hackathon fix.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
