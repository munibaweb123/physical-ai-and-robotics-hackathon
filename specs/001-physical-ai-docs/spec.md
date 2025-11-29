# Feature Specification: Physical AI & Humanoid Robotics Course Docs

**Feature Branch**: `001-physical-ai-docs`
**Created**: 2025-11-29
**Status**: Draft
**Input**: User description: "Update with # Project Specification: Physical AI & Humanoid Robotics Course..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hardware Setup & Lab Configuration (Priority: P1)
As a student, I want a clear, strictly defined hardware guide distinguishing between "Training Workstations" and "Edge Inference Kits" so that I can purchase the correct equipment without wasting money on incompatible hardware (e.g., Macs or non-RTX laptops).

**Why this priority**: Hardware is the primary bottleneck. Without the correct RTX GPU (Training) and Jetson (Edge), students cannot participate in the course.

**Independent Test**:
- Verify `docs/hardware/requirements` page exists.
- Verify it explicitly lists RTX 4070 Ti+ as mandatory for Training.
- Verify it lists Jetson Orin Nano/NX for Edge.
- Verify "Latency Trap" warning is present.

**Acceptance Scenarios**:
1. **Given** a student visiting the hardware section, **When** they read the workstation requirements, **Then** they see a clear warning that Standard Laptops/MacBooks are insufficient and RTX 4070 Ti is required.
2. **Given** a student with a budget, **When** they view the "Robot Lab" options, **Then** they see a comparison table of Proxy (Unitree Go2), Miniature (G1/OP3), and Premium options.

### User Story 2 - Learning Module Navigation (Priority: P1)
As a student, I want to navigate through the course content sequentially from "Foundations" to "Humanoid Development" so that I can build my skills in the correct order (ROS 2 -> Sim -> Isaac -> Humanoid).

**Why this priority**: The curriculum is cumulative. Accessing advanced modules (humanoids) without foundations (ROS 2) will lead to failure.

**Independent Test**:
- Verify Sidebar contains sections 0 through 8 in correct order.
- Verify each slug (e.g., `modules/week3-5-ros2`) is accessible.

**Acceptance Scenarios**:
1. **Given** the documentation sidebar, **When** expanded, **Then** it shows "Section 0: Introduction" through "Section 8: Assessments".
2. **Given** Section 3 (ROS 2), **When** clicked, **Then** it shows topics for Architecture, Nodes, and Package creation.

### User Story 3 - Sim-to-Real Transfer Understanding (Priority: P2)
As a student, I want to understand the "Sim-to-Real" pipeline via visual diagrams so that I know which code runs on the Workstation (Sim) and which runs on the Robot (Edge).

**Why this priority**: This is the core concept of the course ("Physical AI"). Confusion here breaks the architecture.

**Independent Test**:
- Verify inclusion of Mermaid diagrams in the relevant sections.

**Acceptance Scenarios**:
1. **Given** the System Architecture section, **When** viewed, **Then** a Mermaid diagram depicts the flow: Workstation <-> Edge Brain <-> Actuators.

### Edge Cases

- **Cloud-Only Student**: What if a student cannot afford the hardware? The "Cloud vs Local" section MUST provide a viable "Ether Lab" path using AWS, ensuring they can still complete the Capstone (Simulated).
- **Windows/Mac Users**: What if a student refuses to install Linux? The docs MUST be explicit that "Sim-to-Real" is not supported on non-Linux edges, or provide the WSL2/VM caveats (or strictly forbid it to reduce support burden). The current stance is "Mandatory for friction-free experience".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST implement a Sidebar with 9 distinct sections (Section 0 to Section 8) matching the specified Content Architecture.
- **FR-002**: The `hardware/requirements` page MUST distinguish between "Digital Twin Workstation" (Training) and "Edge AI Kit" (Inference).
- **FR-003**: The Hardware section MUST include a "Latency Trap" warning using a Docusaurus `:::danger` admonition regarding cloud robotics control.
- **FR-004**: The Content MUST include a "Cloud vs. Local" comparison table showing AWS OpEx vs. Local CapEx.
- **FR-005**: Section 3 (ROS 2) MUST cover Architecture, Nodes/Topics/Services, and Launch files.
- **FR-006**: Section 5 (Isaac Platform) MUST cover Isaac Sim, VSLAM, and Reinforcement Learning transfer.
- **FR-007**: The Capstone project description in Section 8 MUST define a "Simulated Humanoid with Conversational AI".
- **FR-008**: Mermaid.js diagrams MUST be embedded to visualize:
    - System Architecture (Sim vs Edge vs Robot)
    - ROS 2 Node Graph
    - Sim-to-Real Pipeline

### Key Entities

- **Course Module**: A unit of curriculum (e.g., "ROS 2 Fundamentals") containing multiple topics.
- **Hardware Spec**: A defined set of equipment (Workstation, Edge Kit, Robot) with specific constraints (VRAM, TOPS).
- **Lab Option**: A tiered hardware package (Proxy, Miniature, Premium).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sidebar contains exactly the 9 specified top-level sections.
- **SC-002**: Hardware Requirements page includes specific "RTX 4070 Ti" and "Jetson Orin Nano" keywords.
- **SC-003**: At least 3 Mermaid diagrams are rendered correctly in the documentation pages.
- **SC-004**: The "Latency Trap" warning uses the `:::danger` style class.
- **SC-005**: 100% of the "Weekly Breakdown" topics from the project overview are present in their respective module pages.