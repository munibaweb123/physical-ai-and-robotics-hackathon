---
id: 1701388800
title: "Amend constitution for physical AI course platform"
stage: constitution
date: 2025-11-30
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "001-docusaurus-chatbot-ui"
user: "user"
command: "/sp.constitution create chapters in docs folder add # Constitution: Physical AI & Humanoid Robotics Course Platform"
labels: ["constitution", "initial-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - .specify/memory/constitution.md
tests_yaml: []
outcome: "Constitution updated to version 1.0.0 with new content and sync impact report."
evaluation: "The constitution was successfully updated based on the provided content. Manual follow-ups are recommended for dependent templates."
---

## User Input

```text
 create chapters in docs folder add # Constitution: Physical AI & Humanoid Robotics Course Platform

## 1. Project Overview
**Name:** Physical AI & Humanoid Robotics Course
**Goal:** Create a comprehensive, high-performance Docusaurus documentation site serving as the textbook and lab manual for the "Physical AI & Humanoid Robotics" curriculum.
**Theme:** Cybernetic, Industrial, High-Tech. Focus on the convergence of Digital Brains and Physical Bodies.

## 2. Technical Architecture
- **Framework:** Docusaurus 3.x (Classic Preset)
- **Deployment:** Vercel/Render
- **Content Format:** MDX (Markdown + React Components for diagrams/formulas)
- **Mathematical Notation:** LaTeX enabled (KaTeX plugin) for kinematics/dynamics equations.

## 3. Directory & Sidebar Structure
The content must be organized into four distinct "Parts" (Sidebar Groups), containing specific Chapters (Docs).

### Part I: Foundations of Embodied Intelligence
*Folder: `docs/01-foundations`*

* **Chapter 1: The Era of Physical AI**
    * *File:* `01-era-of-physical-ai.md`
    * *Concept:* Transition from digital models to embodied intelligence; physics, gravity, thermodynamics; the humanoid form factor advantage.
* **Chapter 2: The Physical AI Lab**
    * *File:* `02-infrastructure-setup.md`
    * *Concept:* Hardware requirements (RTX 4090/4070 Ti), Ubuntu 22.04 Setup, Jetson Orin Nano edge setup, and robot hardware tiers (Proxy vs. Humanoid).

### Part II: The Robotic Nervous System
*Folder: `docs/02-ros2-system`*

* **Chapter 3: Mastering ROS 2**
    * *File:* `01-ros2-fundamentals.md`
    * *Concept:* Architecture (Nodes, Topics, Services); `rclpy` bridge; URDF descriptions for humanoids.
* **Chapter 4: The Digital Twin (Simulation)**
    * *File:* `02-gazebo-unity-sim.md`
    * *Concept:* Gazebo physics setup; Sensor simulation (LiDAR, Depth); Unity for HRI visualization; URDF to SDF conversion.

### Part III: The AI-Robot Brain
*Folder: `docs/03-brain-control`*

* **Chapter 5: NVIDIA Isaac™ Platform**
    * *File:* `01-isaac-platform.md`
    * *Concept:* Isaac Sim (Omniverse); Isaac ROS hardware acceleration; VSLAM and Nav2 for bipedal navigation.
* **Chapter 6: Humanoid Mechanics & Control**
    * *File:* `02-kinematics-dynamics.md`
    * *Concept:* Kinematics/Dynamics math; Bipedal locomotion algorithms; Grasping/Manipulation control.

### Part IV: The Cognitive Convergence
*Folder: `docs/04-cognitive-ai`*

* **Chapter 7: Vision-Language-Action (VLA)**
    * *File:* `01-vla-models.md`
    * *Concept:* Integrating LLMs with Robotics; OpenAI Whisper (Voice-to-Action); Cognitive planning (Text-to-ROS actions).
* **Chapter 8: Capstone - The Autonomous Humanoid**
    * *File:* `02-capstone-project.md`
    * *Concept:* The full pipeline integration: Voice Command -> LLM Plan -> Nav2 Path -> Vision ID -> Manipulation -> Action.

### Appendices
*Folder: `docs/99-appendices`*

* **Appendix A: Cloud Lab Setup** (`01-cloud-workstation.md`) - AWS g5.2xlarge setup guides.
* **Appendix B: Hardware BOM** (`02-bill-of-materials.md`) - Economy Jetson Student Kit parts list.
* **Appendix C: Troubleshooting** (`03-troubleshooting.md`) - ROS 2 Linux vs. Windows issues.

## 4. Content Guidelines
1.  **Tone:** Academic yet applied. Use "Industry Standard" terminology.
2.  **Visuals:** Placeholders for architectural diagrams (ROS Graphs) and screenshots (Isaac Sim).
3.  **Code Blocks:** All code examples must be in Python (ROS 2 Humble compatible) or Bash.
4.  **Callouts:** Use Docusaurus Admonitions (`:::info`, `:::danger`) for hardware safety warnings (e.g., LiPo battery handling, High VRAM requirements).

## 5. Next Steps for Agent
1.  Initialize Docusaurus project structure.
2.  Create the folder hierarchy defined in Section 3.
3.  Generate `sidebar.js` to reflect the Parts I-IV structure.
4.  Draft the `intro.md` (Course Overview) and individual Chapter files.
```

## Assistant Response

```text
Constitution updated to version 1.0.0 (major bump due to a complete restructuring of the constitution).

**Manual Follow-up Required:**
*   `.specify/templates/plan-template.md`
*   `.specify/templates/spec-template.md`
*   `.specify/templates/tasks-template.md`
*   `.specify/templates/commands/*.md`
*   `README.md`, `docs/quickstart.md`, or agent-specific guidance files

These templates and guidance documents require a manual review to ensure they align with the new constitution.

**Suggested commit message:**
`docs: amend constitution to v1.0.0 (initial physical AI course platform constitution)`
```