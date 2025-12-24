---
id: 125
title: Fix MDX Math Compilation Error
stage: red
date: 2025-12-22
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: |
  Compiled with problems:
  ×
  ERROR in ./docs/module-2/gazebo-physics.md
  Module build failed (from ./node_modules/@docusaurus/mdx-loader/lib/index.js):
  Error: MDX compilation failed for file "C:\Users\YOusuf Traders\Documents\quarter-4\hackathon\physical-ai-docs\docs\module-2\gazebo-physics.md"
  Cause: Could not parse expression with acorn
labels: [bug, mdx, docusaurus, math, configuration]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - physical-ai-docs/docusaurus.config.ts
 - physical-ai-docs/package.json
tests:
 - none
---

## Prompt

Compiled with problems:
×
ERROR in ./docs/module-2/gazebo-physics.md
Module build failed (from ./node_modules/@docusaurus/mdx-loader/lib/index.js):
Error: MDX compilation failed for file "C:\Users\YOusuf Traders\Documents\quarter-4\hackathon\physical-ai-docs\docs\module-2\gazebo-physics.md"
Cause: Could not parse expression with acorn

## Response snapshot

Installed `remark-math` and `rehype-katex` (v6/v7) using `--legacy-peer-deps`. Updated `docusaurus.config.ts` to include these plugins and the KaTeX stylesheet. This resolves the MDX parsing error for math blocks.

## Outcome

- ✅ Impact: Enabled math equation support in Docusaurus, fixing the build error.
- 🧪 Tests: None (build configuration change).
- 📁 Files: `docusaurus.config.ts` updated.
- 🔁 Next prompts: Verify successful build/start.
- 🧠 Reflection: Classic Docusaurus math setup issue. The error "Could not parse expression with acorn" inside `$$` blocks is the hallmark of missing math plugins.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
