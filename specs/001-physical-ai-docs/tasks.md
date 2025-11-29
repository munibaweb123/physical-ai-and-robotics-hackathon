# Task Tracker: Physical AI Course Docs

**Branch**: `001-physical-ai-docs` | **Spec**: [Link](../spec.md)
**Status**: Completed

## Phase 1: Setup & Initialization
**Goal**: Initialize the Docusaurus project and configure the base environment.
*Dependencies*: None

- [x] T001 Create Docusaurus project structure in `physical-ai-coursework/`
- [x] T002 [P] Configure `docusaurus.config.ts` with title "Physical AI & Humanoid Robotics" and syntax highlighting
- [x] T003 [P] Install and configure `docusaurus-plugin-mermaid` in `docusaurus.config.ts`
- [x] T004 Clean up default template content (tutorial/blog) from `physical-ai-coursework/`
- [x] T005 Create directory structure for all documentation sections in `physical-ai-coursework/docs/`

## Phase 2: Foundational Content (Blockers)
**Goal**: Establish the critical hardware requirements and introduction.
*Dependencies*: Phase 1

- [x] T006 [US1] Implement `docs/hardware/requirements.md` with Workstation (RTX 4070 Ti) specs
- [x] T007 [US1] Implement `docs/hardware/edge-kit.md` with Jetson Orin Nano details
- [x] T008 [US1] Implement `docs/hardware/robot-lab.md` with Robot Options comparison table
- [x] T009 [US1] Implement `docs/hardware/cloud-vs-local.md` with "Latency Trap" danger admonition
- [x] T010 [US2] Implement `docs/intro/why-physical-ai.md` with definition of Embodied Intelligence
- [x] T011 [US2] Implement `docs/intro/core-objectives.md` with 6 learning outcomes

## Phase 3: User Story 2 - Learning Module Navigation (P1)
**Goal**: Implement the sidebar navigation and core module structure.
*Dependencies*: Phase 2

- [x] T012 [US2] Implement `sidebars.ts` matching the 9-section structure defined in data-model
- [x] T013 [P] [US2] Create `docs/modules/week1-2-foundations.md` (Sensor Systems)
- [x] T014 [P] [US2] Create `docs/modules/week3-5-ros2.md` (ROS 2 Architecture)
- [x] T015 [P] [US2] Create `docs/modules/week6-7-simulation.md` (Gazebo/URDF)
- [x] T016 [P] [US2] Create `docs/modules/week8-10-isaac.md` (Isaac Sim/VSLAM)
- [x] T017 [P] [US2] Create `docs/modules/week11-12-humanoid.md` (Locomotion)
- [x] T018 [P] [US2] Create `docs/modules/week13-conversational.md` (GPT/Whisper)
- [x] T019 [P] [US2] Create `docs/assessments/projects.md` (Capstone requirements)

## Phase 4: User Story 3 - Sim-to-Real Visualization (P2)
**Goal**: Integrate diagrams to visualize the physical AI architecture.
*Dependencies*: Phase 3

- [x] T020 [US3] Add Mermaid diagram for System Architecture to `docs/intro/why-physical-ai.md` or `docs/hardware/requirements.md`
- [x] T021 [US3] Add Mermaid diagram for ROS 2 Node Graph to `docs/modules/week3-5-ros2.md`
- [x] T022 [US3] Add Mermaid diagram for Sim-to-Real Pipeline to `docs/modules/week8-10-isaac.md`

## Phase 5: Polish & Deployment
**Goal**: Final visual checks and deployment configuration.
*Dependencies*: Phase 4

- [x] T023 Customize `src/pages/index.tsx` with "Physical AI" hero banner and tagline
- [x] T024 Verify all Mermaid diagrams render correctly in local build
- [x] T025 Verify all Admonitions (Warning/Danger) render correctly
- [x] T026 Configure GitHub Pages deployment settings in `docusaurus.config.ts`

## Dependencies & Execution Order

1. **Phase 1 (Setup)**: Must happen first to create the files.
2. **Phase 2 (Hardware/Intro)**: Content referenced by other modules.
3. **Phase 3 (Navigation)**: Requires content files to exist for the sidebar to link to.
4. **Phase 4 (Visuals)**: Enhances existing pages.

## Parallel Execution Opportunities

- **Phase 2**: All hardware pages (T006-T009) can be written in parallel.
- **Phase 3**: All module pages (T013-T019) can be written in parallel.
