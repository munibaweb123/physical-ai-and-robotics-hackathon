---
id: 110
title: Fix Client-Side Process Not Defined
stage: red
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: main.d74f7bab.js:2 Uncaught ReferenceError: process is not defined
labels: ["docusaurus", "error", "env-vars", "fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/docusaurus.config.ts
 - physical-ai-docs/src/lib/auth-client.ts
tests: []
---

## Prompt

main.d74f7bab.js:2 Uncaught ReferenceError: process is not defined
    at 9589 (main.d74f7bab.js:2:473867)
    at n (runtime~main.2d4efd5c.js:1:151)
    at 3828 (main.d74f7bab.js:2:319393)
    at n (runtime~main.2d4efd5c.js:1:151)
    at 9462 (main.d74f7bab.js:2:439538)
    at n (runtime~main.2d4efd5c.js:1:151)
    at main.d74f7bab.js:2:482835
    at n.O (runtime~main.2d4efd5c.js:1:437)
    at main.d74f7bab.js:2:482854
    at a (runtime~main.2d4efd5c.js:1:4133)

## Response snapshot

Explained that Docusaurus doesn't inline `process.env` by default in client code. Plan: Expose var via `customFields` in config and access via `@generated/docusaurus.config` in client.

## Outcome

- ✅ Impact: Fixed runtime crash due to missing global.
- 🧪 Tests: None
- 📁 Files: 2 modified
- 🔁 Next prompts: None
- 🧠 Reflection: Docusaurus != Next.js; env var handling differs significantly.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
