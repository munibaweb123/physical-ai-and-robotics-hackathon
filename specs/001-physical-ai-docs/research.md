# Research: Physical AI Course Curriculum

## Curriculum Design & Hardware Decisions

### 1. Hardware Architecture
**Decision**: Split hardware into "Workstation" (Sim/Training) and "Edge" (Inference).
**Rationale**: 
- Physics simulation (Isaac Sim) requires high-end RTX GPUs (4070 Ti+).
- Mobile robots need low-power, high-efficiency compute (Jetson Orin).
- Attempting to run Sim on the robot is impossible; attempting to run robot code on a desktop without a real-time OS link introduces latency.
**Alternatives Considered**: 
- *Cloud-only*: Rejected for robot control due to "Latency Trap" (dangerous for balancing robots), but accepted for Simulation/Training to lower access barriers.
- *Raspberry Pi*: Rejected for AI/VSLAM workloads as it lacks CUDA cores required for modern VLA models and Isaac ROS.

### 2. Simulation Platform
**Decision**: Dual-track with Gazebo (Standard ROS 2) and Isaac Sim (High-Fidelity/RTX).
**Rationale**:
- Gazebo is the industry standard for open-source robotics and lighter to run.
- Isaac Sim is required for photorealistic perception training and "Sim-to-Real" utilizing NVIDIA's gems.
**Alternatives Considered**:
- *Unity/Unreal*: Unity is included for visualization, but Isaac Sim is prioritized for physics accuracy in NVIDIA hardware ecosystems.

### 3. Software Stack
**Decision**: ROS 2 (Humble/Iron) + Python.
**Rationale**:
- ROS 1 is EOL.
- C++ is standard for performance, but Python is chosen for accessibility in an introductory "Physical AI" course, except where performance dictates C++.
- Docusaurus v3 chosen for documentation for its React-based extensibility and versioning support.

## Documentation Framework
**Decision**: Docusaurus v3.
**Rationale**:
- Built-in support for versioning (crucial for course iterations).
- MDX support allows embedding interactive diagrams (Mermaid) and components.
- "Docs-as-Code" approach fits the target audience (CS/Robotics engineers).
