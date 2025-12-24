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
