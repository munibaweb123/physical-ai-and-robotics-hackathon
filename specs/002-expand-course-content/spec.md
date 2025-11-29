# Feature Specification: Expand Course Content

**Feature Branch**: `002-expand-course-content`
**Created**: 2025-11-29
**Status**: Draft
**Input**: User description: "Expand Course Content based on Constitution"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Detailed Module Content (Priority: P1)
As a student, I want to access comprehensive documentation for Modules 1 through 4 so that I can follow the curriculum detailed in the Course Constitution.

**Why this priority**: The constitution was updated with specific module details, but the current docs are placeholders. This content is essential for the course.

**Independent Test**:
- Verify `docs/modules/week1-2-foundations` contains detailed "Module 1" content (ROS 2).
- Verify `docs/modules/week3-5-ros2` reflects "Module 2" simulation content.
- Verify `docs/modules/week6-7-simulation` reflects "Module 3" Isaac content.
- Verify `docs/modules/week8-10-isaac` and beyond align with the new 4-module structure.
- **Note**: The Constitution defines 4 modules, but the directory structure has 8 weeks/sections. Mapping must be clarified or adjusted in content.

**Acceptance Scenarios**:
1. **Given** the "Module 1" section (ROS 2), **When** a student reads it, **Then** they see topics on Nodes, Topics, Services, and `rclpy`.
2. **Given** the "Module 4" section (VLA), **When** a student reads it, **Then** they see guides on Whisper, LLM planning, and the Capstone.

### User Story 2 - Curriculum Alignment (Priority: P2)
As an instructor, I want the documentation sidebar and pages to match the "Course Details" definitions in the Constitution so that there is no ambiguity between the syllabus and the course book.

**Why this priority**: Consistency between governance (Constitution) and artifacts (Docs) is critical for course integrity.

**Independent Test**:
- Verify sidebar categories match the Constitution's "Module 1", "Module 2", etc., naming convention where appropriate, or map them clearly.

**Acceptance Scenarios**:
1. **Given** the sidebar, **When** viewing "Section 2: Foundations", **Then** it should align with "Module 1: The Robotic Nervous System".
2. **Given** "Section 7: Conversational Robotics", **Then** it should align with "Module 4: Vision-Language-Action".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The content of `docs/modules/week1-2-foundations` MUST be updated to cover "Module 1: The Robotic Nervous System (ROS 2)" as defined in the Constitution.
- **FR-002**: The content of `docs/modules/week6-7-simulation` MUST be updated to cover "Module 2: The Digital Twin (Gazebo & Unity)" including physics and sensor simulation.
- **FR-003**: The content of `docs/modules/week8-10-isaac` MUST be updated to cover "Module 3: The AI-Robot Brain (NVIDIA Isaac)" including Isaac Sim and Nav2.
- **FR-004**: The content of `docs/modules/week13-conversational` MUST be updated to cover "Module 4: Vision-Language-Action (VLA)" including Whisper and Cognitive Planning.
- **FR-005**: The Capstone project page (`docs/assessments/projects.md`) MUST be updated to reflect the "Autonomous Humanoid" project defined in the Constitution.

### Key Entities

- **Course Module**: Maps a specific time period (Weeks) to a Constitution Module (Topic).
- **Topic**: A specific subject (e.g., "ROS 2 Nodes") within a module.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the specific bullet points from the Constitution's "Quarter Overview" are present in the respective documentation pages.
- **SC-002**: The Capstone project description includes the exact 5-step workflow (Command -> Plan -> Navigate -> Identify -> Manipulate) defined in the Constitution.

## Edge Cases

- **Module Mapping Mismatch**: The Constitution defines 4 Modules, but the directory structure has 6+ "Week" folders.
  - *Resolution*: Map Constitution Module 1 -> Weeks 3-5 (ROS 2), Module 2 -> Weeks 6-7 (Sim), Module 3 -> Weeks 8-10 (Isaac), Module 4 -> Week 13 (VLA). Weeks 1-2 (Foundations) remain as pre-requisite context.