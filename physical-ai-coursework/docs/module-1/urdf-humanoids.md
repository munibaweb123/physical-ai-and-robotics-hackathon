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
