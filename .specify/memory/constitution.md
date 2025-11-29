<!--
SYNC IMPACT REPORT
Version Change: 1.0.0 -> 1.1.0
Modified Principles:
- None (Principles retained)
Added Sections:
- The Course Details (Focus, Theme, Goals)
- Quarter Overview (Module breakdown)
Templates Status:
- .specify/templates/plan-template.md: ✅
- .specify/templates/spec-template.md: ✅
- .specify/templates/tasks-template.md: ✅
Follow-up:
- Ensure course modules in docs match the new detailed descriptions.
-->
# Physical AI & Humanoid Robotics Course Constitution

## The Course Details

### Physical AI & Humanoid Robotics
**Focus and Theme**: AI Systems in the Physical World. Embodied Intelligence.  
**Goal**: Bridging the gap between the digital brain and the physical body. Students apply their AI knowledge to control Humanoid Robots in simulated and real-world environments.

### Quarter Overview
The future of AI extends beyond digital spaces into the physical world. This capstone quarter introduces Physical AI—AI systems that function in reality and comprehend physical laws. Students learn to design, simulate, and deploy humanoid robots capable of natural human interactions using ROS 2, Gazebo, and NVIDIA Isaac.

- **Module 1: The Robotic Nervous System (ROS 2)**
  - *Focus*: Middleware for robot control.
  - ROS 2 Nodes, Topics, and Services.
  - Bridging Python Agents to ROS controllers using `rclpy`.
  - Understanding URDF (Unified Robot Description Format) for humanoids.

- **Module 2: The Digital Twin (Gazebo & Unity)**
  - *Focus*: Physics simulation and environment building.
  - Simulating physics, gravity, and collisions in Gazebo.
  - High-fidelity rendering and human-robot interaction in Unity.
  - Simulating sensors: LiDAR, Depth Cameras, and IMUs.

- **Module 3: The AI-Robot Brain (NVIDIA Isaac™)**
  - *Focus*: Advanced perception and training.
  - NVIDIA Isaac Sim: Photorealistic simulation and synthetic data generation.
  - Isaac ROS: Hardware-accelerated VSLAM (Visual SLAM) and navigation.
  - Nav2: Path planning for bipedal humanoid movement.

- **Module 4: Vision-Language-Action (VLA)**
  - *Focus*: The convergence of LLMs and Robotics.
  - Voice-to-Action: Using OpenAI Whisper for voice commands.
  - Cognitive Planning: Using LLMs to translate natural language ("Clean the room") into a sequence of ROS 2 actions.
  - **Capstone Project**: The Autonomous Humanoid. A final project where a simulated robot receives a voice command, plans a path, navigates obstacles, identifies an object using computer vision, and manipulates it.

## Core Principles

### I. Embodied Intelligence First
Physical AI differs fundamentally from digital AI. All systems must account for physical laws, gravity, inertia, and sensor noise. Code is not complete until it operates within the constraints of a physical body (or a high-fidelity physics simulation of one). "Brains without bodies" are insufficient; intelligence must be grounded in sensorimotor interaction.

### II. Simulation-to-Real Fidelity
The "Digital Twin" is mandatory. Before any code touches physical hardware, it must be validated in a high-fidelity simulator (Isaac Sim/Gazebo) utilizing rigid body dynamics and accurate sensor modeling. The "Sim-to-Real" gap must be minimized by using RTX-enabled rendering and precise URDF/SDF robot descriptions.

### III. Hardware-Aware Architecture
Compute loads must be distributed correctly. Training, physics simulation, and heavy rendering belong on High-Performance Workstations (RTX 4070 Ti+, Ubuntu, i7/Ryzen9) or Cloud instances. Real-time inference, control loops, and sensor processing belong on Edge Devices (Jetson Orin). Latency between these layers must be managed explicitly; remote control over the internet is prohibited for dynamic balancing.

### IV. Hybrid AI Stack
The system architecture must integrate deterministic control with probabilistic intelligence.
- **Deterministic**: ROS 2 (Humble/Iron) middleware for reliable communication, real-time control, and navigation stacks.
- **Probabilistic**: Generative AI (LLMs, VLAs, Whisper) for high-level planning, natural language understanding, and semantic reasoning.
These two worlds must bridge seamlessly (e.g., LLM outputs -> ROS 2 Actions).

### V. Open & Modular Hardware
The course supports tiered hardware (Proxy, Miniature, Premium) to ensure accessibility. However, the software stack must remain standard (ROS 2). Proprietary "black box" controllers that prevent custom node injection are prohibited. Hardware choices must support the "Nervous System" concept: Visual Perception (RealSense), Vestibular Sense (IMU), and Actuation.

## Technology Standards

### Core Stack
- **Operating System**: Ubuntu 22.04 LTS (Mandatory for ROS 2 ecosystem compatibility).
- **Middleware**: ROS 2 (Humble or Iron).
- **Simulation**: NVIDIA Isaac Sim (Omniverse), Gazebo, Unity.
- **AI Frameworks**: PyTorch, NVIDIA JetPack, OpenAI API (or local LLM equivalents).

### Hardware Reference
- **Workstation**: NVIDIA RTX 4070 Ti (12GB VRAM min) for Isaac Sim.
- **Edge**: NVIDIA Jetson Orin Nano/NX for robot deployment.
- **Sensors**: Intel RealSense (Depth/RGB), BNO055 (IMU), ReSpeaker (Audio).

## Course Delivery & Assessment

### Structure
The curriculum progresses from "Digital AI" to "Embodied AI" over 13 weeks, culminating in a Capstone Project.
- **Modules**: Foundations -> ROS 2 -> Simulation -> Isaac Platform -> Humanoid Dev -> Conversational AI.
- **Milestones**: Successful Sim setup -> ROS 2 Package -> Sim-to-Real transfer (or Sim-proof).

### Quality Gates
- **Assessment**: Projects are assessed on functional deployment. Code that runs only in a notebook is insufficient; it must control a node in the robot graph.
- **Capstone**: A Simulated Humanoid robot demonstrating conversational capabilities (Speech-to-Action).

## Governance

This Constitution governs the curriculum design, hardware selection, and software architecture of the Physical AI Course.
- **Amendments**: Must be ratified by the lead instructors/maintainers. Changes to hardware requirements must consider student budget impact and availability.
- **Compliance**: All lab instructions, tutorials, and capstone requirements must align with the ROS 2 + Isaac Sim standard.
- **Safety**: Simulation validation is a non-negotiable safety gate before deployment to physical humanoid robots to prevent hardware damage or injury.

**Version**: 1.1.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29