---
title: NVIDIA Isaac Platform
sidebar_label: Week 8-10 Isaac
---

# Week 8-10: NVIDIA Isaac Platform

## Topics
- **Isaac Sim**: High-fidelity photorealistic simulation.
- **Isaac SDK**: Accelerated gems for navigation and perception.
- **VSLAM**: Visual Simultaneous Localization and Mapping.
- **Reinforcement Learning**: Training agents in Isaac Gym.
- **Sim-to-Real**: Domain Randomization techniques.

## Lab
- Set up Isaac Sim on the Workstation.
- Run the Carter Navigation tutorial.

## Sim-to-Real Pipeline

The process of transferring a policy learned in simulation to the real world.

```mermaid
flowchart LR
    subgraph Sim ["Simulation (Isaac)"]
        Agent[Agent]
        Env[Physics Environment]
        DomainRand[Domain Randomization]
    end

    subgraph Transfer ["Transfer"]
        Export[Export ONNX/TensorRT]
    end

    subgraph Real ["Real World"]
        Robot[Physical Robot]
        RealEnv[Real Environment]
    end

    Agent -- "Action" --> Env
    Env -- "Observation + Reward" --> Agent
    Env --> DomainRand --> Env
    Agent --> Export --> Robot
    Robot -- "Action" --> RealEnv
    RealEnv -- "Noisy Observation" --> Robot
```
