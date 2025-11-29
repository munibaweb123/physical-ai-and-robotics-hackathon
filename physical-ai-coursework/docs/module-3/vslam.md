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
