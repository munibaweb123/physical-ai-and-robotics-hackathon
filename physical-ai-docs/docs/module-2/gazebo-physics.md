---
id: gazebo-physics
title: Gazebo Physics
---

# The Digital Twin (Gazebo & Unity)

## Training in the Matrix

"Before a robot walks in the real world, it must fall a thousand times in the simulation."

Sim2Real (Simulation to Reality) is the critical workflow in modern robotics. It allows us to:
1.  **Iterate Fast**: Recompile and test in seconds, not minutes.
2.  **Safety**: No hardware damage when the robot crashes.
3.  **Scale**: Train 1,000 robots in parallel in the cloud.

## Physics Engines

Gazebo uses physics engines like **ODE (Open Dynamics Engine)** or **Bullet** to simulate Newtonian physics.

### Key Concepts
-   **Gravity**: $F = ma$. Ensuring the robot has mass and responds to gravity.
-   **Friction**: Contact dynamics between feet and the floor.
-   **Inertia**: How hard it is to rotate a limb. Incorrect inertia matrices are the #1 cause of exploding simulations.
-   **Collision Detection**: Calculating when two meshes intersect and applying appropriate reaction forces.

$$
\tau = M(\theta)\ddot{\theta} + C(\theta, \dot{\theta}) + G(\theta)
$$

*The Equation of Motion: Torque equals Mass times Acceleration plus Coriolis/Centrifugal forces plus Gravity.*
