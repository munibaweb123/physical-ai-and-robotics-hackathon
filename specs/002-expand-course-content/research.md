# Research: Content Mapping & Strategy

## Structural Alignment Problem
The Constitution defines 4 logical **Modules** (1: ROS2, 2: Sim, 3: Isaac, 4: VLA).
The Directory structure defines 6 **Time Blocks** (Weeks 1-2, 3-5, 6-7, 8-10, 11-12, 13).

### Decision: Explicit Mapping in Sidebar
We will not rename directories to avoid breaking existing links/bookmarks. Instead, we will use the Sidebar labels and Page titles to enforce the Module structure.

| Directory (Weeks) | Constitution Module | Sidebar Label | Key Topics |
|-------------------|---------------------|---------------|------------|
| `week1-2-foundations` | *Pre-requisite* | Foundations | Sensor Systems, Intro |
| `week3-5-ros2` | **Module 1** | Module 1: ROS 2 | Nodes, Topics, URDF |
| `week6-7-simulation` | **Module 2** | Module 2: Sim | Gazebo, Physics, Sensors |
| `week8-10-isaac` | **Module 3** | Module 3: Isaac | Isaac Sim, VSLAM, Nav2 |
| `week11-12-humanoid` | **Module 3** (Advanced) | Module 3: Humanoid | Locomotion, Dynamics |
| `week13-conversational`| **Module 4** | Module 4: VLA | Whisper, LLM Planning |

## Content Depth Strategy
Each module page must move beyond bullet points to include:
1. **Concept Explanation**: 1-2 paragraphs defining the core technology (e.g., "What is a ROS Node?").
2. **Physical AI Context**: Why does this matter for a robot? (e.g., "Latency in nodes affects balance").
3. **Lab Activity**: A high-level description of the weekly lab (e.g., "Build a `py_pubsub` package").
