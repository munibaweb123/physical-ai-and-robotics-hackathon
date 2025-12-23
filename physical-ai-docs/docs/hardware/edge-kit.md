---
sidebar_position: 2
title: Edge AI Kit
---

# The "Physical AI" Edge Kit

Since full humanoid robots are expensive, we use a "Nervous System on a Desk" approach for the early modules. This kit allows you to deploy ROS 2 nodes to an embedded device, mirroring the constraints of a real robot.

## The Brain: NVIDIA Jetson Orin

We use the **Jetson Orin Nano** or **Orin NX**.

- **Role**: Runs the "Inference" stack (ROS 2 Control, VSLAM, LLM Querying).
- **Constraint**: You must optimize your code to run on 8GB/16GB shared memory.

## The Economy Student Kit (Budget Breakdown)

| Component | Model | Approx Price | Notes |
|-----------|-------|--------------|-------|
| **The Brain** | NVIDIA Jetson Orin Nano Dev Kit (8GB) | ~$249 | 40 TOPS of AI performance. |
| **The Eyes** | Intel RealSense D435i | ~$349 | Must include **IMU** (the "i" model). |
| **The Ears** | ReSpeaker USB Mic Array v2.0 | ~$69 | For "Voice-to-Action" module. |
| **Storage** | 128GB High-Endurance MicroSD | ~$30 | For OS and swap space. |
| **Power** | 5V/4A DC Power Supply | Included | Barrel jack preferred over USB-C. |
| **Total** | | **~$700** | One-time investment. |

## Setup Instructions

1. Flash the Jetson with **JetPack 6.0** (Ubuntu 22.04).
2. Install **ROS 2 Humble**.
3. Configure the RealSense SDK (`librealsense2`).
