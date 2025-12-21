---
id: 35
title: Create Plan for Docusaurus Migration
stage: plan
date_iso: 2025-11-29
surface: agent
model: gemini-1.5-pro
feature: docusaurus-migration
branch: 001-docusaurus-migration
user: Yusuf Traders
command: |
  /sp.plan create plan Execution Plan: Course Documentation WebsitePhase 1: Infrastructure & ScaffoldingObjective: Initialize the Docusaurus framework and prepare the workspace.Prerequisites: Node.js (version 18 or higher) installed.Step 1: Framework InstallationGenerate Project:Run the scaffolding command in your terminal:npx create-docusaurus@latest physical-ai-docs classic
  Verification:Enter the directory and start the local development server:cd physical-ai-docs
  npm start
  Success Criteria: Browser opens http://localhost:3000 showing the default Docusaurus template.Step 2: Workspace SanitizationRemove Defaults:Delete docs/intro.md.Delete docs/tutorial-basics/ and docs/tutorial-extras/.(Optional) Remove blog/ folder if a blog is not required for the course.Phase 2: Content MigrationObjective: Transform flat Markdown files into a structured documentation hierarchy.Step 3: Directory ArchitectureCreate the following folders inside physical-ai-docs/docs/:01-intro (For high-level concepts)02-setup (For technical specs and plans)03-tracker (For student progress)Step 4: Asset Relocation & RenamingMove your existing files to their new homes:The Manifesto:Source: constitution.mdDest: docs/01-intro/01-constitution.mdThe Specs:Source: specify.mdDest: docs/02-setup/01-specifications.mdThe Strategy:Source: physical_ai_plan.mdDest: docs/02-setup/02-execution-plan.mdThe Tracker:Source: tasks.mdDest: docs/03-tracker/01-checklist.mdPhase 3: Configuration & LogicObjective: Define navigation and site metadata.Step 5: Sidebar Logic (sidebars.js)Replace the default tutorialSidebar with a courseSidebar.Group items logically:Group A: "Course Overview" (constitution)Group B: "Lab Environment" (specifications, execution-plan)Group C: "Student Workspace" (checklist)Step 6: Site Config (docusaurus.config.js)Identity: Set title to "Physical AI & Humanoid Robotics".Routing:Set url to your GitHub Pages URL (e.g., https://username.github.io).Set baseUrl to /physical-ai-docs/.Deployment Settings:Set organizationName (GitHub User).Set projectName (Repo Name).Phase 4: Visuals & DeploymentObjective: Enhance readability and publish the site.Step 7: Content EnhancementSafety Warnings:Open docs/02-setup/01-specifications.md.Wrap the "Safe Graphics" warning in a :::danger block.Diagrams:Open docs/01-intro/01-constitution.md.Convert static diagram descriptions into mermaid code blocks.Step 8: DeploymentGit Initialization:git init
  git add .
  git commit -m "Initial commit of Physical AI Docs"
  Publish:GIT_USER=<your-github-username> npm run deploy
labels:
  - plan
  - docusaurus
  - migration
  - frontend
links: {}
files_yaml:
  - specs/001-docusaurus-migration/plan.md
tests_yaml: []
prompt_text: |
  /sp.plan create plan Execution Plan: Course Documentation WebsitePhase 1: Infrastructure & ScaffoldingObjective: Initialize the Docusaurus framework and prepare the workspace.Prerequisites: Node.js (version 18 or higher) installed.Step 1: Framework InstallationGenerate Project:Run the scaffolding command in your terminal:npx create-docusaurus@latest physical-ai-docs classic
  Verification:Enter the directory and start the local development server:cd physical-ai-docs
  npm start
  Success Criteria: Browser opens http://localhost:3000 showing the default Docusaurus template.Step 2: Workspace SanitizationRemove Defaults:Delete docs/intro.md.Delete docs/tutorial-basics/ and docs/tutorial-extras/.(Optional) Remove blog/ folder if a blog is not required for the course.Phase 2: Content MigrationObjective: Transform flat Markdown files into a structured documentation hierarchy.Step 3: Directory ArchitectureCreate the following folders inside physical-ai-docs/docs/:01-intro (For high-level concepts)02-setup (For technical specs and plans)03-tracker (For student progress)Step 4: Asset Relocation & RenamingMove your existing files to their new homes:The Manifesto:Source: constitution.mdDest: docs/01-intro/01-constitution.mdThe Specs:Source: specify.mdDest: docs/02-setup/01-specifications.mdThe Strategy:Source: physical_ai_plan.mdDest: docs/02-setup/02-execution-plan.mdThe Tracker:Source: tasks.mdDest: docs/03-tracker/01-checklist.mdPhase 3: Configuration & LogicObjective: Define navigation and site metadata.Step 5: Sidebar Logic (sidebars.js)Replace the default tutorialSidebar with a courseSidebar.Group items logically:Group A: "Course Overview" (constitution)Group B: "Lab Environment" (specifications, execution-plan)Group C: "Student Workspace" (checklist)Step 6: Site Config (docusaurus.config.js)Identity: Set title to "Physical AI & Humanoid Robotics".Routing:Set url to your GitHub Pages URL (e.g., https://username.github.io).Set baseUrl to /physical-ai-docs/.Deployment Settings:Set organizationName (GitHub User).Set projectName (Repo Name).Phase 4: Visuals & DeploymentObjective: Enhance readability and publish the site.Step 7: Content EnhancementSafety Warnings:Open docs/02-setup/01-specifications.md.Wrap the "Safe Graphics" warning in a :::danger block.Diagrams:Open docs/01-intro/01-constitution.md.Convert static diagram descriptions into mermaid code blocks.Step 8: DeploymentGit Initialization:git init
  git add .
  git commit -m "Initial commit of Physical AI Docs"
  Publish:GIT_USER=<your-github-username> npm run deploy
response_text: |
  The implementation plan for "Docusaurus Migration for Physical AI Course Docs" has been successfully created.

  *   **Branch:** `001-docusaurus-migration`
  *   **Implementation Plan Path:** `specs/001-docusaurus-migration/plan.md`
  *   **Generated Artifacts:**
      *   `specs/001-docusaurus-migration/spec.md` (Feature Specification)
      *   `specs/001-docusaurus-migration/checklists/requirements.md` (Specification Quality Checklist)
      *   `specs/001-docusaurus-migration/plan.md` (Implementation Plan)

  This feature is now ready for task breakdown based on this comprehensive plan.
outcome: Implementation plan created and ready for task breakdown.
evaluation: Plan created successfully with detailed steps.
---
