---
id: nodes-topics
title: Nodes & Topics
---

# Nodes & Topics

## The Computational Graph

A ROS 2 system is a graph of independent executable programs called **Nodes**. These nodes communicate with each other using a publish-subscribe model.

### Nodes
A Node is a process that performs a specific task (e.g., reading a laser scanner, controlling wheel motors, or path planning).
-   **Modular**: Keeps complexity low.
-   **Decoupled**: Nodes don''t need to know who they are talking to, just *what* they are saying.

### Topics (Publish-Subscribe)
Nodes exchange data over **Topics**.
-   **Publishers**: Send data (e.g., "Sensor Node" sends `LidarScan`).
-   **Subscribers**: Receive data (e.g., "Navigation Node" listens for `LidarScan`).
-   **Many-to-Many**: One topic can have multiple publishers and subscribers.

```python
# Example: Minimal Publisher
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__(''minimal_publisher'')
        self.publisher_ = self.create_publisher(String, ''topic'', 10)
```

## Services & Actions

While Topics are for continuous data streams, sometimes we need specific interactions:

-   **Services (Synchronous)**: Request/Response. "Teleport the robot to X,Y". The client waits for the server to say "Done".
-   **Actions (Asynchronous)**: Goal/Feedback/Result. "Navigate to the kitchen". This takes time. The robot reports progress ("I am 50% there") and a final result ("Arrived").
