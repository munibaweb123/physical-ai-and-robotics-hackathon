---
id: autonomous-humanoid
title: Autonomous Humanoid Capstone
---

# The Capstone Project

**Objective**: Students will deploy a full-stack Physical AI system in a high-fidelity simulated environment (household or warehouse). The robot must operate autonomously based on a high-level human request.

## The Pipeline

The final system integrates all modules into a coherent "Robotic Application".

```text
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

**(Note: Diagram rendered as text block for build stability. Enable Mermaid plugin to view visual graph.)**

## Evaluation Criteria
1.  **Success Rate**: Did the robot retrieve the correct object?
2.  **Autonomy**: Was there any manual intervention?
3.  **Robustness**: Did it handle dynamic obstacles (e.g., walking person)?
4.  **Latency**: Time from command to execution.
