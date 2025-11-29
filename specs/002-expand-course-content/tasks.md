# Task Tracker: Expand Course Content

**Branch**: `002-expand-course-content` | **Spec**: [Link](../spec.md)
**Status**: Pending

## Phase 1: Setup & Sidebar Configuration (Foundation)
**Goal**: Update the navigation structure to map "Weeks" to "Constitution Modules".
*Dependencies*: None

- [ ] T001 Update `physical-ai-coursework/sidebars.ts` to use Module 1-4 labels per data-model
- [ ] T002 [P] Update frontmatter title/label in `physical-ai-coursework/docs/modules/week3-5-ros2.md` (Module 1)
- [ ] T003 [P] Update frontmatter title/label in `physical-ai-coursework/docs/modules/week6-7-simulation.md` (Module 2)
- [ ] T004 [P] Update frontmatter title/label in `physical-ai-coursework/docs/modules/week8-10-isaac.md` (Module 3)
- [ ] T005 [P] Update frontmatter title/label in `physical-ai-coursework/docs/modules/week13-conversational.md` (Module 4)

## Phase 2: Module 1 & 2 Content (User Story 1)
**Goal**: Populate ROS 2 and Simulation pages with detailed curriculum content.
*Dependencies*: Phase 1

- [ ] T006 [US1] Implement detailed content for "Module 1: ROS 2" in `physical-ai-coursework/docs/modules/week3-5-ros2.md` (Nodes, Topics, Services, rclpy)
- [ ] T007 [US1] Implement detailed content for "Module 2: Digital Twin" in `physical-ai-coursework/docs/modules/week6-7-simulation.md` (Gazebo physics, URDF, Sensors)

## Phase 3: Module 3 & 4 Content (User Story 1)
**Goal**: Populate Isaac, Humanoid, and VLA pages with detailed curriculum content.
*Dependencies*: Phase 2

- [ ] T008 [US1] Implement detailed content for "Module 3: Isaac" in `physical-ai-coursework/docs/modules/week8-10-isaac.md` (Isaac Sim, VSLAM, Nav2)
- [ ] T009 [US1] Implement detailed content for "Module 3: Humanoid" in `physical-ai-coursework/docs/modules/week11-12-humanoid.md` (Kinematics, Locomotion)
- [ ] T010 [US1] Implement detailed content for "Module 4: VLA" in `physical-ai-coursework/docs/modules/week13-conversational.md` (Whisper, LLM Planning)

## Phase 4: Capstone & Curriculum Alignment (User Story 1 & 2)
**Goal**: Finalize the Capstone requirements and ensure full alignment with Constitution.
*Dependencies*: Phase 3

- [ ] T011 [US1] Update Capstone details in `physical-ai-coursework/docs/assessments/projects.md` with the 5-step Autonomous Humanoid workflow
- [ ] T012 [US2] Verify/Update `physical-ai-coursework/docs/modules/week1-2-foundations.md` to align with "Pre-requisite" context (Foundations)

## Dependencies & Execution Order

1. **Phase 1**: Sidebar and Frontmatter updates must happen first to establish the new structure.
2. **Phase 2**: ROS 2 and Sim content (Modules 1 & 2).
3. **Phase 3**: Isaac and VLA content (Modules 3 & 4).
4. **Phase 4**: Capstone and final alignment checks.

## Parallel Execution Opportunities

- **Phase 1**: Frontmatter updates (T002-T005) can be done in parallel.
- **Phase 2 & 3**: Content writing for different files can be done in parallel if multiple agents were available (T006-T010).
