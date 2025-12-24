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
