$files = @{
    "physical-ai-coursework/docs/intro/preamble.md" = @'
---
id: preamble
title: Preamble
---

We hold these truths to be self-evident: that intelligence is not strictly digital, but must be embodied to truly understand the world. The future of AI extends beyond servers and screens into the physical realm. In this quarter, students will transition from coding agents in a void to architecting Physical AI—systems that function in reality, respect the laws of physics, and interact with humans naturally.
'@
    "physical-ai-coursework/docs/intro/core-objectives.md" = @'
---
id: core-objectives
title: Core Objectives
---

## Embodiment
To grant AI agents a physical form (chassis, sensors, actuators) allowing them to manipulate the world.

## Simulation-to-Reality (Sim2Real)
To master the art of the "Digital Twin," training in risk-free virtual environments before deploying to hardware.

## Cognitive Control
To utilize Large Language Models (LLMs) not just for text, but as the high-level planning cortex for robotic motor function.
'@
    "physical-ai-coursework/docs/module-1/overview.md" = @'
---
id: overview
title: Overview
---

# The Robotic Nervous System (ROS 2)

"The body must obey the mind." This module establishes the fundamental communication infrastructure required to control complex hardware.

**Focus**: Middleware for robot control and inter-process communication.
'@
    "physical-ai-coursework/docs/module-1/nodes-topics.md" = @'
---
id: nodes-topics
title: Nodes & Topics
---

**Key Concepts**: Nodes & Topics: The publish-subscribe architecture of robot data. Services & Actions: Request/response patterns for blocking and non-blocking tasks. rclpy: Bridging high-level Python AI agents to low-level motor controllers.
'@
    "physical-ai-coursework/docs/module-1/urdf-humanoids.md" = @'
---
id: urdf-humanoids
title: URDF for Humanoids
---

**Key Concepts**: URDF (Unified Robot Description Format): Defining the kinematics, joints, and visual geometry of a humanoid robot.
'@
    "physical-ai-coursework/docs/module-2/gazebo-physics.md" = @'
---
id: gazebo-physics
title: Gazebo Physics
---

# The Digital Twin (Gazebo & Unity)

"Training in the matrix." Before a robot walks in the real world, it must fall a thousand times in the simulation.

**Focus**: Physics simulation, environment building, and sensor emulation.

**Key Concepts**: Physics Engines: Simulating gravity, friction, inertia, and collisions in Gazebo.

$$
F = ma
$$
'@
    "physical-ai-coursework/docs/module-2/unity-rendering.md" = @'
---
id: unity-rendering
title: Unity Rendering
---

**Key Concepts**: High-Fidelity Rendering: Using Unity for photorealistic human-robot interaction scenarios.
'@
    "physical-ai-coursework/docs/module-2/sensor-sim.md" = @'
---
id: sensor-sim
title: Sensor Simulation
---

**Key Concepts**: Sensor Simulation: Implementing virtual LiDAR, Depth Cameras, and IMUs (Inertial Measurement Units) to generate noisy, realistic data streams.
'@
    "physical-ai-coursework/docs/module-3/isaac-sim.md" = @'
---
id: isaac-sim
title: NVIDIA Isaac Sim
---

# The AI-Robot Brain (NVIDIA Isaac™)

"Perception precedes action." A robot must map its environment to navigate it effectively.

**Focus**: Advanced perception, synthetic data generation, and navigation.

**Key Concepts**: NVIDIA Isaac Sim: Leveraging photorealism to generate synthetic training data for computer vision models.
'@
    "physical-ai-coursework/docs/module-3/nav2-stack.md" = @'
---
id: nav2-stack
title: Nav2 Stack
---

**Key Concepts**: Nav2 Stack: Implementing path planning algorithms (A*, Dijkstra) specifically tuned for bipedal humanoid movement constraints.
'@
    "physical-ai-coursework/docs/module-3/vslam.md" = @'
---
id: vslam
title: VSLAM
---

**Key Concepts**: Isaac ROS: utilizing hardware acceleration for VSLAM (Visual Simultaneous Localization and Mapping).
'@
    "physical-ai-coursework/docs/module-4/whisper-integration.md" = @'
---
id: whisper-integration
title: Whisper Integration
---

# Vision-Language-Action (VLA)

"From words to motion." The convergence of Generative AI and Robotics.

**Focus**: The intersection of LLMs, Vision Transformers, and Control Theory.

**Key Concepts**: Voice-to-Action: Integrating OpenAI Whisper to process auditory commands.
'@
    "physical-ai-coursework/docs/module-4/llm-planning.md" = @'
---
id: llm-planning
title: LLM Planning
---

**Key Concepts**: Cognitive Planning: Utilizing LLMs (e.g., GPT-4o, Llama 3) to decompose abstract commands ("Clean the room") into a structured sequence of ROS 2 primitives (Locate Object -> Plan Path -> Grasp -> Transport).
'@
    "physical-ai-coursework/docs/module-4/vla-models.md" = @'
---
id: vla-models
title: VLA Models
---

**Key Concepts**: VLA Models: End-to-end models that output robot actions directly from visual and textual inputs.
'@
    "physical-ai-coursework/docs/capstone/autonomous-humanoid.md" = @'
---
id: autonomous-humanoid
title: Autonomous Humanoid Capstone
---

## Article III: The Capstone Project

**Objective**: Students will deploy a full-stack Physical AI system in a high-fidelity simulated environment (household or warehouse). The robot must operate autonomously based on a high-level human request.

**The Workflow**:
- Input: The robot receives a voice command (e.g., "Find the red medical kit and bring it to the couch").
- Perception (Whisper + LLM): The system transcribes audio and parses the intent into a task list.
- Navigation (Isaac ROS + Nav2): The robot generates a map, localizes itself, and plans a path to the target area while avoiding dynamic obstacles.
- Vision (YOLO/Transformer): The robot identifies the specific object using computer vision.
- Manipulation (MoveIt): The robot executes inverse kinematics to grasp the object.
- Completion: The robot navigates to the destination and places the object.

```mermaid
graph TD
    Input[Voice Command] --> Perception[Whisper + LLM]
    Perception --> Navigation[Isaac ROS + Nav2]
    Navigation --> Vision[YOLO/Transformer]
    Vision --> Manipulation[MoveIt]
    Manipulation --> Completion[Task Complete]
```
'@
    "physical-ai-coursework/docs/resources/tech-stack.md" = @'
---
id: tech-stack
title: Tech Stack & Tools
---

## Article IV: Tech Stack & Tools

**Operating System**: Ubuntu Linux (22.04 LTS)
**Middleware**: ROS 2 (Humble Hawksbill)
**Languages**: Python (Logic/AI), C++ (Performance Nodes)
**Simulation**: Gazebo Fortress, Unity, NVIDIA Isaac Sim
**AI/ML**: PyTorch, OpenAI API, Hugging Face Transformers
'@
}

foreach ($key in $files.Keys) {
    $files[$key] | Out-File -FilePath $key -Encoding utf8 -Force
}
