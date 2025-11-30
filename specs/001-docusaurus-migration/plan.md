# Execution Plan: Course Documentation Website

## 1. Feature Name
Docusaurus Migration for Physical AI Course Docs

## 2. Goal
This plan guides the transformation of existing Physical AI Course Markdown files into a structured, navigable Docusaurus website, covering project initialization, file mapping, sidebar configuration, content enhancement, and deployment to GitHub Pages.

## 3. Technical Context

This project involves setting up a Docusaurus documentation site and migrating existing Markdown content into it.

### Tech Stack Overview
-   **Documentation Framework**: Docusaurus v3
-   **Package Manager**: npm
-   **Language**: JavaScript/TypeScript (for Docusaurus config files)
-   **Deployment Target**: GitHub Pages

## 4. Constitution Check

The "Execution Plan: Course Documentation Website" aligns well with the project's updated Constitution (Version 1.1.0).

-   **Course Identity**: Directly supports the goal of providing structured course content for Physical AI & Humanoid Robotics.
-   **Overview & Philosophy**: Facilitates a clear and accessible presentation of the course philosophy and materials.
-   **Curriculum Modules**: The migration aims to structure the content from these modules into a navigable website.
-   **Hardware Constitution & Operational Models**: This plan will make these detailed specifications easily consumable by students through a web interface.
-   **Simplicity**: Docusaurus, as a static site generator, offers a simple yet powerful way to manage documentation.
-   **Maintainability**: Centralizing documentation in a Docusaurus site improves maintainability and discoverability.

## 5. Execution Phases (Detailed Plan from User Input)

### Phase 1: Infrastructure & Scaffolding
**Objective**: Initialize the Docusaurus framework and prepare the workspace.
**Prerequisites**: Node.js (version 18 or higher) installed.

#### Step 1: Framework Installation
-   **Generate Project**: Run `npx create-docusaurus@latest physical-ai-docs classic` in your development folder.
-   **Verification**:
    -   Enter the directory: `cd physical-ai-docs`
    -   Start the local development server: `npm start`
    -   **Success Criteria**: Browser opens `http://localhost:3000` showing the default Docusaurus template.

#### Step 2: Workspace Sanitization
-   **Remove Defaults**:
    -   Delete `docs/intro.md`.
    -   Delete `docs/tutorial-basics/` and `docs/tutorial-extras/`.
    -   (Optional) Remove `blog/` folder if a blog is not required for the course.

### Phase 2: Content Migration
**Objective**: Transform flat Markdown files into a structured documentation hierarchy.

#### Step 3: Directory Architecture
-   Create the following folders inside `physical-ai-docs/docs/`:
    -   `01-intro` (For high-level concepts)
    -   `02-setup` (For technical specs and plans)
    -   `03-tracker` (For student progress)

#### Step 4: Asset Relocation & Renaming
-   **Move existing files to their new homes**:
    -   The Manifesto: `Source: constitution.md` → `Dest: physical-ai-docs/docs/01-intro/01-constitution.md`
    -   The Specs: `Source: spec.md` → `Dest: physical-ai-docs/docs/02-setup/01-specifications.md`
    -   The Strategy: `Source: physical_ai_plan.md` → `Dest: physical-ai-docs/docs/02-setup/02-execution-plan.md`
    -   The Tracker: `Source: tasks.md` → `Dest: physical-ai-docs/docs/03-tracker/01-checklist.md`

### Phase 3: Configuration & Logic
**Objective**: Define navigation and site metadata.

#### Step 5: Sidebar Logic (`sidebars.js`)
-   Replace the default `tutorialSidebar` with a `courseSidebar`.
-   Group items logically:
    -   Group A: "Course Overview" (constitution)
    -   Group B: "Lab Environment" (specifications, execution-plan)
    -   Group C: "Student Workspace" (checklist)

#### Step 6: Site Config (`docusaurus.config.js`)
-   **Identity**: Set `title` to "Physical AI & Humanoid Robotics".
-   **Routing**:
    -   Set `url` to your GitHub Pages URL (e.g., `https://username.github.io`).
    -   Set `baseUrl` to `/physical-ai-docs/`.
-   **Deployment Settings**:
    -   Set `organizationName` (GitHub User).
    -   Set `projectName` (Repo Name).

### Phase 4: Visuals & Deployment
**Objective**: Enhance readability and publish the site.

#### Step 7: Content Enhancement
-   **Safety Warnings**: Open `docs/02-setup/01-specifications.md`. Wrap the "Safe Graphics" warning in a `:::danger` block.
-   **Diagrams**: Open `docs/01-intro/01-constitution.md`. Convert static diagram descriptions into Mermaid code blocks.

#### Step 8: Deployment
-   **Git Initialization**:
    -   `git init`
    -   `git add .`
    -   `git commit -m "Initial commit of Physical AI Docs"`
-   **Publish**: `GIT_USER=<your-github-username> npm run deploy`

## 6. Phase 0: Outline & Research (Summary)
This plan is prescriptive and directly derived from the user's blueprint. No further research is immediately required beyond executing these steps.

## 7. Phase 1: Design & Contracts (Summary)
The API contracts (if any) and data models are implicitly handled by the Docusaurus framework and the migration of existing Markdown files. No new data models or complex API contracts are being designed here.

## 8. Agent Context Update
The key technologies and concepts involved in this plan include:
-   Docusaurus v3
-   npm
-   Markdown
-   Git/GitHub Pages
-   Mermaid.js
-   Docusaurus Admonitions
