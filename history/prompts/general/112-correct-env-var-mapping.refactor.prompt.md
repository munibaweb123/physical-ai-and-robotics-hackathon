---
id: 112
title: Correct Env Var Mapping
stage: refactor
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: my chatbot backend is in NEXT_PUBLIC_API_URL and auth server in BETTER_AUTH_URL
labels: ["config", "env-vars", "refactor", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/docusaurus.config.ts
 - physical-ai-docs/src/lib/auth-client.ts
 - physical-ai-docs/src/components/Chatbot/index.tsx
tests: []
---

## Prompt

my chatbot backend is in NEXT_PUBLIC_API_URL and auth server in BETTER_AUTH_URL

## Response snapshot

Refactoring config to match user's naming. Exposing `authBaseUrl` (from `BETTER_AUTH_URL`) and `apiBaseUrl` (from `NEXT_PUBLIC_API_URL`). Updating client files to use respective config fields.

## Outcome

- ✅ Impact: Correctly separated services in frontend configuration.
- 🧪 Tests: None
- 📁 Files: 3 modified
- 🔁 Next prompts: None
- 🧠 Reflection: User provided the definitive mapping. Essential to respect it.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
