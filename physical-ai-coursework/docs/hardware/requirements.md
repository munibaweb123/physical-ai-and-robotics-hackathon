---
sidebar_position: 1
title: Workstation Requirements
---

# The Digital Twin Workstation

To successfully complete the "Sim-to-Real" pipeline, you must have a workstation capable of running high-fidelity physics simulations in NVIDIA Isaac Sim.

:::warning VRAM Bottleneck
The primary constraint for Isaac Sim is **VRAM**. Standard laptops with 8GB or less will crash when loading the humanoid USD assets and environment simultaneously.
:::

## Minimum Specifications (Training)

This machine runs Isaac Sim, Gazebo, and trains the VLA models.

| Component | Specification | Reason |
|-----------|---------------|--------|
| **GPU** | **NVIDIA RTX 4070 Ti (12GB VRAM)** | Minimum required for Isaac Sim + VLA model loading. |
| **CPU** | Intel Core i7 (13th Gen) or AMD Ryzen 9 | Physics calculations (Rigid Body Dynamics) are CPU intensive. |
| **RAM** | 64 GB DDR5 | 32GB is absolute minimum; 64GB recommended for stability. |
| **OS** | Ubuntu 22.04 LTS | Mandatory for ROS 2 Humble/Iron compatibility. |

## Recommended Specifications

For smoother frame rates and faster training:

- **GPU**: NVIDIA RTX 3090 or 4090 (24GB VRAM)
- **RAM**: 128 GB DDR5
- **Storage**: 1TB NVMe SSD (Gen 4)

## System Architecture

The flow of data in a Physical AI system involves training in simulation and deploying to the edge.

```mermaid
graph TD
    subgraph Workstation ["Digital Twin Workstation"]
        Isaac[Isaac Sim / Gazebo]
        Trainer[Model Training (GPU)]
    end

    subgraph Edge ["Edge AI Kit (Jetson)"]
        Inference[Inference Engine]
        ROS2[ROS 2 Nodes]
    end

    subgraph Robot ["Physical Robot"]
        Sensors[Sensors (LIDAR/Camera)]
        Actuators[Motors]
    end

    Isaac -- "Synthetic Data" --> Trainer
    Trainer -- "Model Weights" --> Inference
    Sensors -- "Real Data" --> Inference
    Inference -- "Velocity Cmd" --> ROS2
    ROS2 -- "Torque Cmd" --> Actuators
```
