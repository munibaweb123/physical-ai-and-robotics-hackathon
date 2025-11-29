---
id: 2
title: Create Docusaurus Course Book Spec
stage: spec
date: 2025-11-28
surface: agent
model: claude-sonnet-4-5-20250929
feature: physical-ai-docs
branch: 001-physical-ai-docs
user: human
command: /sp.specify Project Specification: Physical AI Course Book (Docusaurus)This document specifies the technical requirements and structure for converting the Physical AI & Humanoid Robotics constitution into a static documentation site using Docusaurus.1. Project InitializationFramework: Docusaurus 3.x (Classic Theme)Project Name: physical-ai-courseworkRepository Name: physical-ai-roboticsBase Command:npx create-docusaurus@latest physical-ai-coursework classic
2. Site Configuration (docusaurus.config.js)Title: "Physical AI & Humanoid Robotics"Tagline: "Embodied Intelligence & Sim2Real"URL: https://physical-ai-course.com (Placeholder)Organization: "PAI-400"Project Name: "physical-ai-robotics"Presets:classic preset for docs, blog (optional), and theme.Enable LaTeX support (remark-math, rehype-katex) for physics equations in Module 2.Theme Config:Navbar: Links to "Docs" (Curriculum), "API" (ROS 2 Refs), and "GitHub".Footer: Copyright, links to NVIDIA Isaac / ROS 2 documentation resources.Prism: Enable syntax highlighting for: python, cpp, bash, yaml, xml (for URDF).3. Sidebar Structure (sidebars.js)The sidebar should strictly follow the logical flow of the Constitution.module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/preamble', 'intro/core-objectives'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 Nervous System',
      items: [
        'module-1/overview',
        'module-1/nodes-topics',
        'module-1/urdf-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin',
      items: [
        'module-2/gazebo-physics',
        'module-2/unity-rendering',
        'module-2/sensor-sim',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Robot Brain',
      items: [
        'module-3/isaac-sim',
        'module-3/nav2-stack',
        'module-3/vslam',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        'module-4/whisper-integration',
        'module-4/llm-planning',
        'module-4/vla-models',
      ],
    },
    {
      type: 'doc',
      id: 'capstone/autonomous-humanoid',
      label: 'Capstone Project',
    },
    {
      type: 'doc',
      id: 'resources/tech-stack',
      label: 'Tech Stack & Tools',
    },
  ],
};
4. Content Mapping StrategyWe will split the single constitution.md file into granular Markdown files within the docs/ folder to populate the structure above.A. Introduction Folder (docs/intro/)preamble.md: Contains the "Preamble" section.core-objectives.md: Contains "Article I: Core Objectives".B. Module Folders (docs/module-X/)Each module section from "Article II" will be expanded into sub-pages:Module 1 (ROS 2): Split into middleware concepts and URDF/Geometry.Module 2 (Sim): Split into Physics Engines and Rendering/Sensors.Module 3 (Isaac): Split into Simulation setup and Navigation (Nav2).Module 4 (VLA): Split into Voice (Whisper) and Cognitive Planning (LLMs).C. Capstone (docs/capstone/)autonomous-humanoid.md: Contains "Article III: The Capstone Project" with the detailed workflow.D. Resources (docs/resources/)tech-stack.md: Contains "Article IV: Tech Stack & Tools".5. Required Assets & VisualsHomepage (src/pages/index.js):Hero Header: "Building the Bodies for Artificial Minds."Features: 3 Columns highlighting ROS 2, NVIDIA Isaac, and Embodied AI.Diagrams (Mermaid.js):Implement a flowchart in capstone/autonomous-humanoid.md visualizing the Input -> Perception -> Navigation -> Vision -> Manipulation pipeline.6. Implementation StepsScaffold Project: Run Docusaurus generator.Clean Default Docs: Remove the default "Tutorial" files.Migrate Content: Copy text from constitution.md into the new file structure defined in Section 3.Install Plugins:npm install --save remark-math rehype-katex @docusaurus/theme-mermaid
Configure Math & Mermaid: Update docusaurus.config.js to enable these plugins for rendering physics equations and logic flows.
labels: ["docusaurus", "specification", "course-book", "physical-ai-docs"]
links:
  spec: specs/001-physical-ai-docs/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-physical-ai-docs/spec.md
  - specs/001-physical-ai-docs/checklists/requirements.md
tests: []
---

## Prompt

/sp.specify Project Specification: Physical AI Course Book (Docusaurus)This document specifies the technical requirements and structure for converting the Physical AI & Humanoid Robotics constitution into a static documentation site using Docusaurus.1. Project InitializationFramework: Docusaurus 3.x (Classic Theme)Project Name: physical-ai-courseworkRepository Name: physical-ai-roboticsBase Command:npx create-docusaurus@latest physical-ai-coursework classic
2. Site Configuration (docusaurus.config.js)Title: "Physical AI & Humanoid Robotics"Tagline: "Embodied Intelligence & Sim2Real"URL: https://physical-ai-course.com (Placeholder)Organization: "PAI-400"Project Name: "physical-ai-robotics"Presets:classic preset for docs, blog (optional), and theme.Enable LaTeX support (remark-math, rehype-katex) for physics equations in Module 2.Theme Config:Navbar: Links to "Docs" (Curriculum), "API" (ROS 2 Refs), and "GitHub".Footer: Copyright, links to NVIDIA Isaac / ROS 2 documentation resources.Prism: Enable syntax highlighting for: python, cpp, bash, yaml, xml (for URDF).3. Sidebar Structure (sidebars.js)The sidebar should strictly follow the logical flow of the Constitution.module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/preamble', 'intro/core-objectives'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 Nervous System',
      items: [
        'module-1/overview',
        'module-1/nodes-topics',
        'module-1/urdf-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin',
      items: [
        'module-2/gazebo-physics',
        'module-2/unity-rendering',
        'module-2/sensor-sim',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Robot Brain',
      items: [
        'module-3/isaac-sim',
        'module-3/nav2-stack',
        'module-3/vslam',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        'module-4/whisper-integration',
        'module-4/llm-planning',
        'module-4/vla-models',
      ],
    },
    {
      type: 'doc',
      id: 'capstone/autonomous-humanoid',
      label: 'Capstone Project',
    },
    {
      type: 'doc',
      id: 'resources/tech-stack',
      label: 'Tech Stack & Tools',
    },
  ],
};
4. Content Mapping StrategyWe will split the single constitution.md file into granular Markdown files within the docs/ folder to populate the structure above.A. Introduction Folder (docs/intro/)preamble.md: Contains the "Preamble" section.core-objectives.md: Contains "Article I: Core Objectives".B. Module Folders (docs/module-X/)Each module section from "Article II" will be expanded into sub-pages:Module 1 (ROS 2): Split into middleware concepts and URDF/Geometry.Module 2 (Sim): Split into Physics Engines and Rendering/Sensors.Module 3 (Isaac): Split into Simulation setup and Navigation (Nav2).Module 4 (VLA): Split into Voice (Whisper) and Cognitive Planning (LLMs).C. Capstone (docs/capstone/)autonomous-humanoid.md: Contains "Article III: The Capstone Project" with the detailed workflow.D. Resources (docs/resources/)tech-stack.md: Contains "Article IV: Tech Stack & Tools".5. Required Assets & VisualsHomepage (src/pages/index.js):Hero Header: "Building the Bodies for Artificial Minds."Features: 3 Columns highlighting ROS 2, NVIDIA Isaac, and Embodied AI.Diagrams (Mermaid.js):Implement a flowchart in capstone/autonomous-humanoid.md visualizing the Input -> Perception -> Navigation -> Vision -> Manipulation pipeline.6. Implementation StepsScaffold Project: Run Docusaurus generator.Clean Default Docs: Remove the default "Tutorial" files.Migrate Content: Copy text from constitution.md into the new file structure defined in Section 3.Install Plugins:npm install --save remark-math rehype-katex @docusaurus/theme-mermaid
Configure Math & Mermaid: Update docusaurus.config.js to enable these plugins for rendering physics equations and logic flows.

## Response snapshot

The specification for "Physical AI Course Book (Docusaurus)" has been successfully created and validated.

## Outcome

- ✅ Impact: Spec file created and validated, ready for planning.
- 🧪 Tests: No explicit tests were run as part of spec creation, but validation checklist passed.
- 📁 Files: specs/001-physical-ai-docs/spec.md and specs/001-physical-ai-docs/checklists/requirements.md created/updated.
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: Encountered and resolved git repository corruption, successfully created and validated the spec.

## Evaluation notes (flywheel)

- Failure modes observed: `create-new-feature.ps1` failed due to long branch name and git ref issues, resolved by manually reinitializing git repo and making initial commit before creating feature branch. `create-phr.sh` also not found.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Ensure `create-new-feature.ps1` and `create-phr.sh` are correctly placed and executable, or provide agent-native alternatives by default.
