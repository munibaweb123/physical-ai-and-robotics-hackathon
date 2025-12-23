---
id: 43
title: Move Coursework to Docs
stage: refactor
date: 2025-12-22
surface: agent
model: gemini-2.0-flash-exp
feature: docusaurus-migration
branch: feature/docusaurus-chatbot-clean
user: user
command: remove physical-ai-course work, move the content of chapters in physical-ai-docs
labels: [refactor, cleanup, migration]
links:
  spec: specs/001-docusaurus-migration/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-coursework/ (deleted)
 - physical-ai-docs/docs/assessments (moved)
 - physical-ai-docs/docs/capstone (moved)
 - physical-ai-docs/docs/hardware (moved)
 - physical-ai-docs/docs/intro-coursework (moved)
 - physical-ai-docs/docs/module-1 (moved)
 - physical-ai-docs/docs/module-2 (moved)
 - physical-ai-docs/docs/module-3 (moved)
 - physical-ai-docs/docs/module-4 (moved)
 - physical-ai-docs/docs/modules (moved)
 - physical-ai-docs/docs/resources (moved)
tests:
 - none
---

## Prompt

remove physical-ai-course work, move the content of chapters in physical-ai-docs

## Response snapshot

Moved content of chapters from `physical-ai-coursework/docs` to `physical-ai-docs/docs` and removed `physical-ai-coursework` directory.

## Outcome

- ✅ Impact: Consolidated documentation into a single Docusaurus instance.
- 🧪 Tests: None (file operations only).
- 📁 Files: Removed source project, populated destination docs.
- 🔁 Next prompts: Verify sidebar configuration in physical-ai-docs.
- 🧠 Reflection: Straightforward move. Renamed `intro` to `intro-coursework` to avoid collision.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
