---
id: nav2-stack
title: Nav2 Stack
---

# Nav2 Stack

"Perception precedes action." A robot must map its environment to navigate it effectively. The **Navigation 2** stack is the industry standard for autonomous mobile robots.

## Core Components

### 1. Map Server
Loads a 2D occupancy grid (map) of the environment.
-   **Static Layer**: Walls, furniture.
-   **Inflation Layer**: Safety padding around obstacles.

### 2. Planner (Global)
Calculates the shortest path from A to B.
-   Algorithms: **A*** (A-Star), **Dijkstra**.
-   Output: A list of waypoints.

### 3. Controller (Local)
Follows the global path while avoiding dynamic obstacles (people, pets).
-   Algorithms: **DWB** (Dynamic Window Approach), **MPPI**.
-   Output: Velocity commands (`cmd_vel`) for the wheels/legs.

### 4. Behavior Trees
Orchestrates the logic: "Follow path, if stuck then back up, if still stuck then spin, if still stuck then call for help."
