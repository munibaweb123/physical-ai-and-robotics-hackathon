---
id: "55"
title: "Refine tsconfig.json for better IDE support"
stage: "general"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "physical-ai-docs-config"
branch: "main"
user: "YOusuf Traders"
command: "correct tsconfig.json"
labels:
  - "configuration"
  - "typescript"
  - "docusaurus"
links:
  spec: "null"
files_yaml:
  - "physical-ai-docs/tsconfig.json"
tests_yaml: []
prompt_text: |
  correct tsconfig.json
response_text: |
  I have updated `physical-ai-docs/tsconfig.json` to be more explicit and robust.
  
  **Changes:**
  - **Added `paths`:** Explicitly mapped `@site/*` to `./src/*` to help your editor (VS Code) correctly resolve imports like `import ... from '@site/src/...'`.
  - **Added `include`:** Explicitly included `src/**/*`, `docusaurus.config.ts`, and `sidebars.ts` to ensure `tsc` checks the right files.
  - **Updated `exclude`:** Added `node_modules` and `__tests__` for completeness.
  
  This should improve your editing experience and ensure `npm run typecheck` covers all your source files correctly.
---
