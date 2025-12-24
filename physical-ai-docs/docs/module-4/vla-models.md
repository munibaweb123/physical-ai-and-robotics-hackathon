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
