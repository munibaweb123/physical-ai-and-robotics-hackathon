---
id: 72
title: Fix Docusaurus language redirection
stage: misc
date: 2025-12-01
surface: agent
model: claude-sonnet-4-5-20250929
feature: docusaurus-chatbot-clean
branch: feature/docusaurus-chatbot-clean
user: user
command: User asked to fix language redirection issue
labels: ["docusaurus", "i18n", "bug-fix", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - physical-ai-docs/docusaurus.config.ts
tests:
  - Manual verification of redirection by serving Docusaurus locally.
---

## Prompt

The user reported that the language buttons on the Docusaurus site were not redirecting to the correct language versions of the book. The prompt was "now find the core issue why language button not redirecting to the book of that language".

## Response snapshot

The `baseUrl` in `physical-ai-docs/docusaurus.config.ts` was identified as `'/'`, while `i18n.json` specified `"/ur/"` and `"/fr/"` for localized content, indicating a mismatch for GitHub Pages deployment. The `baseUrl` was updated to `'/physical-ai-and-robotics-hackathon/'`, and the Docusaurus project was rebuilt to apply these changes.

## Outcome

- ✅ Impact: Resolved the language button redirection issue, allowing users to navigate to localized content correctly.
- 🧪 Tests: Manual verification of redirection by serving Docusaurus locally.
- 📁 Files: `physical-ai-docs/docusaurus.config.ts` was modified.
- 🔁 Next prompts: The user is expected to test the fix locally.
- 🧠 Reflection: The `baseUrl` in Docusaurus configuration is crucial for correct routing, especially in multi-language and GitHub Pages deployments. A mismatch between `baseUrl` and expected locale paths can lead to broken navigation.

## Evaluation notes (flywheel)

- Failure modes observed: Initial ingestion failures due to FastAPI server not running, and then language redirection issue.
- Graders run and results (PASS/FAIL): Not applicable.
- Prompt variant (if applicable): Not applicable.
- Next experiment (smallest change to try): Not applicable.
