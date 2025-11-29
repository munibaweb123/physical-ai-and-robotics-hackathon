---
id: llm-planning
title: LLM Planning
---

# Cognitive Planning with LLMs

Large Language Models (GPT-4, Llama 3) serve as the high-level "Prefrontal Cortex" of the robot.

## Chain-of-Thought for Robotics

We don''t just ask the LLM to "chat". We ask it to **plan**.

### The Prompt Strategy
We provide the LLM with a list of **Primitives** (available functions):
-   `navigate_to(location)`
-   `detect_object(object_name)`
-   `pick_up(object_name)`

### The Task
**User**: "Clean the living room."
**LLM Output**:
1.  `navigate_to("living_room")`
2.  `detect_object("trash")`
3.  `pick_up("trash")`
4.  `navigate_to("bin")`
5.  `drop()`

This output is parsed into ROS 2 Action Goal calls.
