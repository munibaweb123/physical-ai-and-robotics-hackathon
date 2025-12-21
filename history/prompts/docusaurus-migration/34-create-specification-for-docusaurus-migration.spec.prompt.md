---
id: 34
title: Create Specification for Docusaurus Migration
stage: spec
date_iso: 2025-11-29
surface: agent
model: gemini-1.5-pro
feature: docusaurus-migration
branch: 001-docusaurus-migration
user: Yusuf Traders
command: |
  /sp.specify Docusaurus Migration Blueprint: Physical AI CourseThis guide outlines how to transform the current flat Markdown files into a structured Docusaurus website.1. Project InitializationRun the following inside your development folder:npx create-docusaurus @latest physical-ai-docs classic
  cd physical-ai-docs
  npm start
  2. File Mapping StrategyMove and rename your existing artifacts into the docs/ folder to create a logical hierarchy.Current FileTarget Path in DocusaurusRoleconstitution.mddocs/01-intro/01-constitution.mdThe Manifesto: Course overview and philosophy.specify.mddocs/02-setup/01-specifications.mdHardware/Software Specs: Technical requirements.physical_ai_plan.mddocs/02-setup/02-execution-plan.mdThe Strategy: Weekly breakdown and phase plan.tasks.mddocs/03-tracker/01-checklist.mdProgress Tracker: Interactive checkbox list.3. Sidebar Configuration (sidebars.js)Edit sidebars.js to enforce the chronological learning path defined in your Constitution./** @type {import(' @docusaurus/plugin-content-docs').SidebarsConfig} */
  const sidebars = {
    courseSidebar: [
      {
        type: 'category',
        label: 'Course Overview',
        items: ['intro/constitution'],
        collapsible: false,
      },
      {
        type: 'category',
        label: 'Lab Environment',
        items: [
          'setup/specifications',
          'setup/execution-plan',
        ],
      },
      {
        type: 'category',
        label: 'Student Workspace',
        items: ['tracker/checklist'],
      },
    ],
  };

  module.exports = sidebars;
  4. Enhancing Content with Docusaurus FeaturesYou can enhance the raw Markdown files with React components for better readability.A. Admonitions for Safety (Edit specify.md)Wrap critical warnings in Docusaurus admonitions to make them pop.Change this:Critical: Do not use "Safe Graphics" mode during install...To this::::danger CRITICAL INSTALLATION STEP
  **Do not use "Safe Graphics" mode during install.** It conflicts with NVIDIA drivers later and will prevent Isaac Sim from launching.
  :::
  B. Interactive Checklists (Edit tasks.md)Docusaurus renders standard Markdown checkboxes (- [ ]) natively.Tip: You can add the formatting <input type="checkbox" checked disabled> for completed items if you want a read-only view, or keep standard markdown for a copy-pasteable student view.C. Diagrams (Edit constitution.md)You can use Mermaid.js (built-in to Docusaurus) to render the architecture diagrams dynamically instead of using static images.Example for Module 1:graph TD;
      A[Python Agent] -->|rclpy| B(ROS 2 Node);
      B -->|Topic: /cmd_vel| C{Robot Hardware};
      C -->|Topic: /odom| B;
  5. DeploymentSince this is a course, you likely want to publish this to GitHub Pages.Open docusaurus.config.js.Set organizationName (your GitHub username) and projectName (repo name).Run:GIT_USER=<YourUserName> npm run deploy
  This will create a gh-pages branch and publish the "book" accessible via web browser for your students.
labels:
  - specification
  - docusaurus
  - migration
  - frontend
links: {}
files_yaml:
  - specs/001-docusaurus-migration/spec.md
  - specs/001-docusaurus-migration/checklists/requirements.md
tests_yaml: []
prompt_text: |
  Docusaurus Migration Blueprint: Physical AI CourseThis guide outlines how to transform the current flat Markdown files into a structured Docusaurus website.1. Project InitializationRun the following inside your development folder:npx create-docusaurus @latest physical-ai-docs classic
  cd physical-ai-docs
  npm start
  2. File Mapping StrategyMove and rename your existing artifacts into the docs/ folder to create a logical hierarchy.Current FileTarget Path in DocusaurusRoleconstitution.mddocs/01-intro/01-constitution.mdThe Manifesto: Course overview and philosophy.specify.mddocs/02-setup/01-specifications.mdHardware/Software Specs: Technical requirements.physical_ai_plan.mddocs/02-setup/02-execution-plan.mdThe Strategy: Weekly breakdown and phase plan.tasks.mddocs/03-tracker/01-checklist.mdProgress Tracker: Interactive checkbox list.3. Sidebar Configuration (sidebars.js)Edit sidebars.js to enforce the chronological learning path defined in your Constitution./** @type {import(' @docusaurus/plugin-content-docs').SidebarsConfig} */
  const sidebars = {
    courseSidebar: [
      {
        type: 'category',
        label: 'Course Overview',
        items: ['intro/constitution'],
        collapsible: false,
      },
      {
        type: 'category',
        label: 'Lab Environment',
        items: [
          'setup/specifications',
          'setup/execution-plan',
        ],
      },
      {
        type: 'category',
        label: 'Student Workspace',
        items: ['tracker/checklist'],
      },
    ],
  };

  module.exports = sidebars;
  4. Enhancing Content with Docusaurus FeaturesYou can enhance the raw Markdown files with React components for better readability.A. Admonitions for Safety (Edit specify.md)Wrap critical warnings in Docusaurus admonitions to make them pop.Change this:Critical: Do not use "Safe Graphics" mode during install...To this::::danger CRITICAL INSTALLATION STEP
  **Do not use "Safe Graphics" mode during install.** It conflicts with NVIDIA drivers later and will prevent Isaac Sim from launching.
  :::
  B. Interactive Checklists (Edit tasks.md)Docusaurus renders standard Markdown checkboxes (- [ ]) natively.Tip: You can add the formatting <input type="checkbox" checked disabled> for completed items if you want a read-only view, or keep standard markdown for a copy-pasteable student view.C. Diagrams (Edit constitution.md)You can use Mermaid.js (built-in to Docusaurus) to render the architecture diagrams dynamically instead of using static images.Example for Module 1:graph TD;
      A[Python Agent] -->|rclpy| B(ROS 2 Node);
      B -->|Topic: /cmd_vel| C{Robot Hardware};
      C -->|Topic: /odom| B;
  5. DeploymentSince this is a course, you likely want to publish this to GitHub Pages.Open docusaurus.config.js.Set organizationName (your GitHub username) and projectName (repo name).Run:GIT_USER=<YourUserName> npm run deploy
  This will create a gh-pages branch and publish the "book" accessible via web browser for your students.
response_text: |
  The feature specification for "Docusaurus Migration for Physical AI Course Docs" has been successfully created.

  *   **Branch:** `001-docusaurus-migration`
  *   **Specification Path:** `specs/001-docusaurus-migration/spec.md`
  *   **Checklist Path:** `specs/001-docusaurus-migration/checklists/requirements.md`

  The spec is complete and contains detailed information on the Docusaurus migration process. It is now ready for the planning phase.
outcome: Feature specification created and ready for planning.
evaluation: Specification created successfully with all required details.
---
