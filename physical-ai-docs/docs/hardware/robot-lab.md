---
sidebar_position: 3
title: Robot Lab Options
---

# The Robot Lab

For the physical deployment phase, you have three options depending on your budget and goals.

## Comparison Table

| Option | Robot Type | Model | Approx Cost | Pros | Cons |
|--------|------------|-------|-------------|------|------|
| **A: Proxy** | Quadruped | Unitree Go2 Edu | ~$3,000 | Durable, Excellent ROS 2 support. | Not a biped; kinematics differ. |
| **B: Miniature** | Humanoid (Small) | Unitree G1 / Robotis OP3 | ~$12k - $16k | Real bipedal dynamics. | Expensive; Balance is fragile. |
| **C: Premium** | Humanoid (Full) | Unitree G1 Humanoid | Market Price | Full Sim-to-Real fidelity. | Very high cost; Safety risks. |

## Option A: The "Proxy" Approach (Recommended)

We recommend the **Unitree Go2** for most students. While it has 4 legs instead of 2, the software stack (ROS 2, VSLAM, Navigation) transfers 90% effectively to humanoids.

## Option B: Miniature Humanoids

If you must have a biped:
- **Robotis OP3**: Older but stable documentation.
- **Hiwonder TonyPi**: Cheap (~$600) but uses Raspberry Pi (too weak for Isaac ROS). Use only for kinematics learning.
