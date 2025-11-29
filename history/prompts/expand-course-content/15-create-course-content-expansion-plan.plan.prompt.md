---
id: 15
title: Create Course Content Expansion Plan
stage: plan
date: 2025-11-29
surface: agent
model: gemini-2.0-flash
feature: expand-course-content
branch: 002-expand-course-content
user: user
command: /sp.plan update
labels: ["plan", "content", "curriculum"]
links:
  spec: specs/002-expand-course-content/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-expand-course-content/plan.md
 - specs/002-expand-course-content/research.md
 - specs/002-expand-course-content/data-model.md
tests:
null
---

## Prompt

/sp.plan update with ... (See full prompt in history)

## Response snapshot

Created implementation plan for Course Content Expansion.
- Generated `research.md` resolving the mapping between "Weeks" and "Modules".
- Generated `data-model.md` defining specific Sidebar and Frontmatter updates.
- Updated agent context.

## Outcome

- ✅ Impact: Plan established for updating docs to match Constitution.
- 🧪 Tests: Visual verification (docusaurus serve).
- 📁 Files: plan.md, research.md, data-model.md
- 🔁 Next prompts: /sp.tasks
- 🧠 Reflection: Sidebar reorganization is the key to aligning the two structures without breaking links.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
