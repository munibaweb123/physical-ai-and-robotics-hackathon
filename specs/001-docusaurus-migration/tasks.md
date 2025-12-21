# Tasks for Docusaurus Migration for Physical AI Course Docs

## Feature Name: Docusaurus Migration for Physical AI Course Docs

## Dependencies:
-   This tasks list is dependent on the `spec.md` (specs/001-docusaurus-migration/spec.md) and `plan.md` (specs/001-docusaurus-migration/plan.md) being finalized.
-   The source Markdown files (`constitution.md`, `spec.md`, `plan.md`, `tasks.md`) for migration are assumed to be accessible in the project root or parent directory.

## Implementation Strategy:
-   The implementation will follow a phased approach, mirroring the execution phases outlined in the plan.
-   Tasks are organized by user scenario where applicable, with a logical flow. Parallelization opportunities are marked with `[P]`.

---

## Phase 1: Infrastructure & Scaffolding (US1: Initializing the Docusaurus Project)
**Objective**: Initialize the Docusaurus framework and prepare the workspace.
**Goal**: A running local Docusaurus development server.

- [x] T001 [US1] Generate Docusaurus project: `npx create-docusaurus@latest physical-ai-docs classic`. (development folder)
- [x] T002 [US1] Change directory into the new project: `cd physical-ai-docs`. (development folder)
- [ ] T003 [US1] Start the local development server for verification: `npm start`. (physical-ai-docs/)
- [ ] T004 [US1] Verification: Confirm browser opens `http://localhost:3000` showing default Docusaurus template. (N/A - Manual Check)
- [x] T005 [US1] Remove default `docs/intro.md`. (physical-ai-docs/docs/intro.md)
- [x] T006 [US1] Remove default `docs/tutorial-basics/` directory. (physical-ai-docs/docs/tutorial-basics/)
- [x] T007 [US1] Remove default `docs/tutorial-extras/` directory. (physical-ai-docs/docs/tutorial-extras/)
- [x] T008 [US1] (Optional) Remove `blog/` folder if not required. (physical-ai-docs/blog/)

---

## Phase 2: Content Migration (US2: Structuring Existing Content)
**Objective**: Transform flat Markdown files into a structured documentation hierarchy.
**Goal**: All existing course content correctly placed and renamed within the Docusaurus `docs/` structure.

- [x] T009 [US2] Create directory: `physical-ai-docs/docs/01-intro`. (physical-ai-docs/docs/01-intro/)
- [x] T010 [US2] Create directory: `physical-ai-docs/docs/02-setup`. (physical-ai-docs/docs/02-setup/)
- [x] T011 [US2] Create directory: `physical-ai-docs/docs/03-tracker`. (physical-ai-docs/docs/03-tracker/)
- [x] T012 [P] [US2] Move and rename `constitution.md` to `physical-ai-docs/docs/01-intro/01-constitution.md`. (constitution.md -> physical-ai-docs/docs/01-intro/01-constitution.md)
- [x] T013 [P] [US2] Move and rename `spec.md` (from `specs/001-physical-ai-spec/`) to `physical-ai-docs/docs/02-setup/01-specifications.md`. (specs/001-physical-ai-spec/spec.md -> physical-ai-docs/docs/02-setup/01-specifications.md)
- [x] T014 [P] [US2] Move and rename `plan.md` (from `specs/001-physical-ai-spec/`) to `physical-ai-docs/docs/02-setup/02-execution-plan.md`. (specs/001-physical-ai-spec/plan.md -> physical-ai-docs/docs/02-setup/02-execution-plan.md)
- [x] T015 [P] [US2] Move and rename `tasks.md` (from `specs/001-physical-ai-spec/`) to `physical-ai-docs/docs/03-tracker/01-checklist.md`. (specs/001-physical-ai-spec/tasks.md -> physical-ai-docs/docs/03-tracker/01-checklist.md)

---

## Phase 3: Configuration & Logic (US3: Configuring Navigation Sidebars, US5: Deploying the Documentation Website - part 1)
**Objective**: Define navigation and site metadata.
**Goal**: Functional sidebars and site identity configured.

- [x] T016 [US3] Create `physical-ai-docs/sidebars.js` (or `.ts`) with the specified `courseSidebar` structure. (physical-ai-docs/sidebars.js)
- [x] T017 [US3] Ensure `courseSidebar` contains "Course Overview" category with `intro/constitution`. (physical-ai-docs/sidebars.js)
- [x] T018 [US3] Ensure `courseSidebar` contains "Lab Environment" category with `setup/specifications`, `setup/execution-plan`. (physical-ai-docs/sidebars.js)
- [x] T019 [US3] Ensure `courseSidebar` contains "Student Workspace" category with `tracker/checklist`. (physical-ai-docs/sidebars.js)
- [ ] T020 [US5] Update `physical-ai-docs/docusaurus.config.js` (or `.ts`) to set `title` to "Physical AI & Humanoid Robotics". (physical-ai-docs/docusaurus.config.ts)
- [ ] T021 [US5] Update `physical-ai-docs/docusaurus.config.js` (or `.ts`) to set `url` to GitHub Pages URL (e.g., `https://username.github.io`). (physical-ai-docs/docusaurus.config.ts)
- [ ] T022 [US5] Update `physical-ai-docs/docusaurus.config.js` (or `.ts`) to set `baseUrl` to `/physical-ai-docs/`. (physical-ai-docs/docusaurus.config.ts)
- [ ] T023 [US5] Update `physical-ai-docs/docusaurus.config.js` (or `.ts`) to set `organizationName` (GitHub User). (physical-ai-docs/docusaurus.config.ts)
- [ ] T024 [US5] Update `physical-ai-docs/docusaurus.config.js` (or `.ts`) to set `projectName` (Repo Name). (physical-ai-docs/docusaurus.config.ts)

---

## Phase 4: Visuals & Deployment (US4: Enhancing Content, US5: Deploying the Documentation Website - part 2)
**Objective**: Enhance readability and publish the site.
**Goal**: Published, visually enhanced documentation website.

- [ ] T025 [US4] Open `physical-ai-docs/docs/02-setup/01-specifications.md`. (physical-ai-docs/docs/02-setup/01-specifications.md)
- [x] T026 [US4] Replace "Critical: Do not use..." warning with Docusaurus `:::danger` admonition block. (physical-ai-docs/docs/02-setup/01-specifications.md)
- [x] T027 [US4] Ensure Markdown checkboxes in `physical-ai-docs/docs/03-tracker/01-checklist.md` render correctly. (physical-ai-docs/docs/03-tracker/01-checklist.md)
- [ ] T028 [US4] Open `physical-ai-docs/docs/01-intro/01-constitution.md`. (physical-ai-docs/docs/01-intro/01-constitution.md)
- [x] T029 [US4] Convert static diagram descriptions for Module 1 architecture into Mermaid code blocks. (physical-ai-docs/docs/01-intro/01-constitution.md)
- [x] T030 [US5] Git Initialization: `git init` (if not already done within `physical-ai-docs`). (physical-ai-docs/)
- [x] T031 [US5] Git Add: `git add .` within `physical-ai-docs`. (physical-ai-docs/)
- [x] T032 [US5] Git Commit: `git commit -m "Initial commit of Physical AI Docs"` within `physical-ai-docs`. (physical-ai-docs/)
- [ ] T033 [US5] Publish: `GIT_USER=<your-github-username> npm run deploy` within `physical-ai-docs`. (physical-ai-docs/)

---

## Task Dependencies:
-   Phase 1 must be completed before Phase 2.
-   Phase 2 must be completed before Phase 3.
-   Phase 3 must be completed before Phase 4.
-   Tasks within a phase can be executed sequentially or in parallel if dependencies allow (e.g., T005-T008 can be done in parallel with T009-T011).

## Parallel Execution Examples:
-   T005, T006, T007, T008 (Removal of default Docusaurus content).
-   T009, T010, T011 (Creation of new directory architecture).
-   T012, T013, T014, T015 (Moving and renaming Markdown files once target directories exist).
-   T017, T018, T019 (Updating sidebar items).

## Suggested MVP Scope:
-   Completion of Phase 1 (Infrastructure & Scaffolding) and Phase 2 (Content Migration), ensuring the Docusaurus project runs locally with the migrated content. This would provide the foundational structure before detailed configuration and content enhancement.
