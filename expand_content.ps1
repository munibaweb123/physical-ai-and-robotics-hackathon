$files = @{
    "physical-ai-coursework/docs/module-1/overview.md" = @'
---
id: overview
title: Overview
---

# The Robotic Nervous System (ROS 2)

## The Body Must Obey the Mind

In this module, we establish the fundamental communication infrastructure required to control complex hardware. Just as a biological nervous system transmits signals between the brain and muscles, **Robot Operating System 2 (ROS 2)** serves as the middleware that connects our AI algorithms to physical actuators and sensors.

## Why ROS 2?

Robotics is a system integration challenge. You have cameras, IMUs, motor controllers, and high-level planners all running at different frequencies and often on different hardware (e.g., microcontrollers vs. GPUs). ROS 2 provides:

-   **Middleware**: Handles inter-process communication (IPC) efficiently.
-   **Hardware Abstraction**: Write code once, run it on different robots.
-   **Tools**: Visualization (Rviz), Simulation (Gazebo/Isaac), and Debugging.

## Learning Objectives

By the end of this module, you will be able to:
1.  Understand the **Graph Architecture** of ROS 2.
2.  Write Python **Nodes** that communicate via **Topics**.
3.  Control a robot's description using **URDF**.
'@

    "physical-ai-coursework/docs/module-1/nodes-topics.md" = @'
---
id: nodes-topics
title: Nodes & Topics
---

# Nodes & Topics

## The Computational Graph

A ROS 2 system is a graph of independent executable programs called **Nodes**. These nodes communicate with each other using a publish-subscribe model.

### Nodes
A Node is a process that performs a specific task (e.g., reading a laser scanner, controlling wheel motors, or path planning).
-   **Modular**: Keeps complexity low.
-   **Decoupled**: Nodes don''t need to know who they are talking to, just *what* they are saying.

### Topics (Publish-Subscribe)
Nodes exchange data over **Topics**.
-   **Publishers**: Send data (e.g., "Sensor Node" sends `LidarScan`).
-   **Subscribers**: Receive data (e.g., "Navigation Node" listens for `LidarScan`).
-   **Many-to-Many**: One topic can have multiple publishers and subscribers.

```python
# Example: Minimal Publisher
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__(''minimal_publisher'')
        self.publisher_ = self.create_publisher(String, ''topic'', 10)
```

## Services & Actions

While Topics are for continuous data streams, sometimes we need specific interactions:

-   **Services (Synchronous)**: Request/Response. "Teleport the robot to X,Y". The client waits for the server to say "Done".
-   **Actions (Asynchronous)**: Goal/Feedback/Result. "Navigate to the kitchen". This takes time. The robot reports progress ("I am 50% there") and a final result ("Arrived").
'@

    "physical-ai-coursework/docs/module-1/urdf-humanoids.md" = @'
---
id: urdf-humanoids
title: URDF for Humanoids
---

# URDF (Unified Robot Description Format)

## Defining the Physical Body

Before a robot can be simulated or controlled, its physical properties must be defined. **URDF** is an XML format used to describe the kinematics, dynamics, and visuals of a robot.

## Key Components

### Links
Links represent the rigid parts of the robot (e.g., "thigh", "shin", "foot").
-   **Visual**: The 3D mesh (DAE/STL) that we see.
-   **Collision**: Simplified geometry (cylinder, box) used for physics calculations.
-   **Inertial**: Mass and Moment of Inertia matrix.

### Joints
Joints connect links and define motion constraints.
-   **Revolute**: Rotates around an axis (e.g., elbow).
-   **Prismatic**: Slides along an axis (e.g., linear actuator).
-   **Fixed**: No movement (e.g., camera mounted on a head).

## Example Snippet

```xml
<link name="base_link">
  <visual>
    <geometry>
      <cylinder length="0.6" radius="0.2"/>
    </geometry>
  </visual>
</link>

<joint name="knee_joint" type="revolute">
  <parent link="thigh"/>
  <child link="shin"/>
  <axis xyz="0 1 0"/>
</joint>
```
'@

    "physical-ai-coursework/docs/module-2/gazebo-physics.md" = @'
---
id: gazebo-physics
title: Gazebo Physics
---

# The Digital Twin (Gazebo & Unity)

## Training in the Matrix

"Before a robot walks in the real world, it must fall a thousand times in the simulation."

Sim2Real (Simulation to Reality) is the critical workflow in modern robotics. It allows us to:
1.  **Iterate Fast**: Recompile and test in seconds, not minutes.
2.  **Safety**: No hardware damage when the robot crashes.
3.  **Scale**: Train 1,000 robots in parallel in the cloud.

## Physics Engines

Gazebo uses physics engines like **ODE (Open Dynamics Engine)** or **Bullet** to simulate Newtonian physics.

### Key Concepts
-   **Gravity**: $F = ma$. Ensuring the robot has mass and responds to gravity.
-   **Friction**: Contact dynamics between feet and the floor.
-   **Inertia**: How hard it is to rotate a limb. Incorrect inertia matrices are the #1 cause of exploding simulations.
-   **Collision Detection**: Calculating when two meshes intersect and applying appropriate reaction forces.

$$
\tau = M(\theta)\ddot{\theta} + C(\theta, \dot{\theta}) + G(\theta)
$$

*The Equation of Motion: Torque equals Mass times Acceleration plus Coriolis/Centrifugal forces plus Gravity.*
'@

    "physical-ai-coursework/docs/module-2/unity-rendering.md" = @'
---
id: unity-rendering
title: Unity Rendering
---

# High-Fidelity Rendering

While Gazebo excels at physics, game engines like **Unity** and **Unreal Engine** excel at rendering. For Visual AI, the robot needs to "see" the world as a camera would.

## Photorealism for Computer Vision

If we train a Vision Transformer on cartoonish graphics, it will fail in the real world. We use Unity to generate **Photorealistic** environments.

-   **Ray Tracing**: Simulating light photons for realistic shadows and reflections.
-   **Texture Mapping**: High-resolution materials (wood, metal, carpet).
-   **Domain Randomization**: Randomizing lighting, colors, and object positions to make the AI robust to environmental changes.
'@

    "physical-ai-coursework/docs/module-2/sensor-sim.md" = @'
---
id: sensor-sim
title: Sensor Simulation
---

# Sensor Simulation

A robot perceives the world through noisy sensors. A perfect simulation must be perfectly imperfect.

## Virtual Sensors

We implement software plugins that mimic real hardware specifications:

### LiDAR (Light Detection and Ranging)
-   Simulates laser rays scanning the environment.
-   Output: Point clouds or 2D scan arrays.
-   **Noise**: Gaussian noise is added to range measurements to simulate sensor error.

### Depth Cameras (RGB-D)
-   Simulates stereo vision or Time-of-Flight.
-   Output: Color image + Depth map (distance to each pixel).

### IMU (Inertial Measurement Unit)
-   Simulates Accelerometer and Gyroscope.
-   Crucial for balancing a humanoid robot.
-   **Bias**: Simulated drift over time (Random Walk).
'@

    "physical-ai-coursework/docs/module-3/isaac-sim.md" = @'
---
id: isaac-sim
title: NVIDIA Isaac Sim
---

# The AI-Robot Brain (NVIDIA Isaac™)

## Next-Gen Simulation

NVIDIA Isaac Sim™ is an extensible robotics simulation application built on the **Omniverse** platform. It leverages USD (Universal Scene Description) and RTX rendering to bridge the gap between visual fidelity and physical accuracy.

## Key Features

-   **GPU Physics**: Simulating thousands of rigid bodies on the GPU (PhysX 5).
-   **Synthetic Data Generation (SDG)**: Automatically generating labeled training data (segmentation masks, bounding boxes) for training YOLO/VLA models.
-   **ROS 2 Bridge**: Seamless integration with our ROS 2 stack.

## The Workflow
1.  Import Robot (URDF/USD).
2.  Build Environment (Assets library).
3.  Connect ROS Bridge.
4.  Run Simulation.
'@

    "physical-ai-coursework/docs/module-3/nav2-stack.md" = @'
---
id: nav2-stack
title: Nav2 Stack
---

# Nav2 Stack

"Perception precedes action." A robot must map its environment to navigate it effectively. The **Navigation 2** stack is the industry standard for autonomous mobile robots.

## Core Components

### 1. Map Server
Loads a 2D occupancy grid (map) of the environment.
-   **Static Layer**: Walls, furniture.
-   **Inflation Layer**: Safety padding around obstacles.

### 2. Planner (Global)
Calculates the shortest path from A to B.
-   Algorithms: **A*** (A-Star), **Dijkstra**.
-   Output: A list of waypoints.

### 3. Controller (Local)
Follows the global path while avoiding dynamic obstacles (people, pets).
-   Algorithms: **DWB** (Dynamic Window Approach), **MPPI**.
-   Output: Velocity commands (`cmd_vel`) for the wheels/legs.

### 4. Behavior Trees
Orchestrates the logic: "Follow path, if stuck then back up, if still stuck then spin, if still stuck then call for help."
'@

    "physical-ai-coursework/docs/module-3/vslam.md" = @'
---
id: vslam
title: VSLAM
---

# VSLAM (Visual Simultaneous Localization and Mapping)

To navigate, a robot must know where it is ($x, y, \theta$).

## The Problem
-   **Mapping**: Building a map of an unknown environment.
-   **Localization**: Determining location within that map.
-   **Simultaneous**: Doing both at once.

## Visual SLAM (Isaac ROS)
Using cameras (and IMUs) to track features in the environment.
-   **Feature Tracking**: Identify corners, edges, and unique textures.
-   **Loop Closure**: Recognizing "I have been here before" to correct accumulated drift error.
-   **VIO (Visual Inertial Odometry)**: Fusing camera data with high-frequency IMU data for robust tracking during fast motion.
'@

    "physical-ai-coursework/docs/module-4/whisper-integration.md" = @'
---
id: whisper-integration
title: Whisper Integration
---

# Vision-Language-Action (VLA)

"From words to motion." The convergence of Generative AI and Robotics.

## Voice-to-Action

Traditional robots require complex joystick inputs or code. Physical AI agents interact naturally.

### OpenAI Whisper
We use **Whisper**, a general-purpose speech recognition model, to give the robot "ears".

1.  **Audio Capture**: Microphone buffer captures user command.
2.  **Transcribing**: Whisper converts audio waveform to text.
    -   *Input*: "Robot, please pick up the red apple."
    -   *Output*: Text string.
3.  **Intent Extraction**: This text is passed to the Cognitive Planner (LLM).
'@

    "physical-ai-coursework/docs/module-4/llm-planning.md" = @'
---
id: llm-planning
title: LLM Planning
---

# Cognitive Planning with LLMs

Large Language Models (GPT-4, Llama 3) serve as the high-level "Prefrontal Cortex" of the robot.

## Chain-of-Thought for Robotics

We don''t just ask the LLM to "chat". We ask it to **plan**.

### The Prompt Strategy
We provide the LLM with a list of **Primitives** (available functions):
-   `navigate_to(location)`
-   `detect_object(object_name)`
-   `pick_up(object_name)`

### The Task
**User**: "Clean the living room."
**LLM Output**:
1.  `navigate_to("living_room")`
2.  `detect_object("trash")`
3.  `pick_up("trash")`
4.  `navigate_to("bin")`
5.  `drop()`

This output is parsed into ROS 2 Action Goal calls.
'@

    "physical-ai-coursework/docs/module-4/vla-models.md" = @'
---
id: vla-models
title: VLA Models
---

# VLA Models (Vision-Language-Action)

## End-to-End Control

While LLMs plan high-level steps, **VLA Models** (like Google's RT-1 or RT-2) operate end-to-end.

-   **Input**: Current Camera Image + Text Instruction.
-   **Output**: Robot Arm Actions ($x, y, z, roll, pitch, yaw, gripper$).

## The Transformer Architecture
VLA models tokenise images and text into the same latent space. The model "predicts" the next motor token just like a GPT predicts the next word token.

This represents the frontier of Embodied AI: a single neural network controlling the physical body based on semantic understanding.
'@

    "physical-ai-coursework/docs/capstone/autonomous-humanoid.md" = @'
---
id: autonomous-humanoid
title: Autonomous Humanoid Capstone
---

# The Capstone Project

**Objective**: Students will deploy a full-stack Physical AI system in a high-fidelity simulated environment (household or warehouse). The robot must operate autonomously based on a high-level human request.

## The Pipeline

The final system integrates all modules into a coherent "Robotic Application".

```mermaid
graph TD
    User[User Command] -->|Voice| Whisper[Whisper STT]
    Whisper -->|Text| Brain[LLM Planner]
    Brain -->|Action Plan| Behav[Behavior Tree]
    
    subgraph "ROS 2 Control Loop"
        Behav -->|Goal: Location| Nav[Nav2 Stack]
        Behav -->|Goal: Object| Vision[YOLO/VLA]
        Vision -->|Coordinates| Manip[MoveIt Manipulation]
        Nav -->|Cmd_Vel| Wheels
        Manip -->|Joint Trajectory| Arm
    end
    
    Wheels --> Sim[Simulation/Reality]
    Arm --> Sim
    Sim -->|Sensors| Nav
    Sim -->|Camera| Vision
```

**(Note: Diagram rendered as text block for build stability. Enable Mermaid plugin to view visual graph.)**

## Evaluation Criteria
1.  **Success Rate**: Did the robot retrieve the correct object?
2.  **Autonomy**: Was there any manual intervention?
3.  **Robustness**: Did it handle dynamic obstacles (e.g., walking person)?
4.  **Latency**: Time from command to execution.
'@

    "physical-ai-coursework/docs/resources/tech-stack.md" = @'
---
id: tech-stack
title: Tech Stack & Tools
---

# Tech Stack & Tools

## Core Infrastructure
-   **Operating System**: Ubuntu Linux 22.04 LTS (Jammy Jellyfish).
-   **Middleware**: ROS 2 Humble Hawksbill.

## Languages
-   **Python**: High-level logic, AI integration, Scripting.
-   **C++**: High-performance nodes, Vision processing, Control loops.

## Simulation
-   **Gazebo Fortress**: General purpose physics.
-   **Unity**: High-fidelity rendering.
-   **NVIDIA Isaac Sim**: GPU-accelerated simulation & Gym RL training.

## AI & Machine Learning
-   **PyTorch**: Deep Learning framework.
-   **OpenAI API**: Access to GPT-4 and Whisper.
-   **Hugging Face**: Transformers library for local models.
'@
}

foreach ($key in $files.Keys) {
    $files[$key] | Out-File -FilePath $key -Encoding utf8 -Force
}

