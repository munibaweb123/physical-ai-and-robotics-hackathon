---
id: 13
title: Add Course Details to Constitution
stage: constitution
date: 2025-11-29
surface: agent
model: gemini-2.0-flash
feature: physical-ai-docs
branch: 001-physical-ai-docs
user: user
command: /sp.constitution add
labels: ["constitution", "update", "course-details"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
null
---

## Prompt

/sp.constitution add this in starting of constitution The Course Details 
Physical AI & Humanoid Robotics 
Focus and Theme: AI Systems in the Physical World. Embodied Intelligence. 
Goal: Bridging the gap between the digital brain and the physical body. Students 
apply their AI knowledge to control Humanoid Robots in simulated and real-world 
environments. 
Quarter Overview 
The future of AI extends beyond digital spaces into the physical world. This capstone 
quarter introduces Physical AI—AI systems that function in reality and comprehend 
physical laws. Students learn to design, simulate, and deploy humanoid robots 
capable of natural human interactions using ROS 2, Gazebo, and NVIDIA Isaac. 
● Module 1: The Robotic Nervous System (ROS 2) 
○ Focus: Middleware for robot control. 
○ ROS 2 Nodes, Topics, and Services. 
○ Bridging Python Agents to ROS controllers using rclpy. 
○ Understanding URDF (Unified Robot Description Format) for 
humanoids. 
● Module 2: The Digital Twin (Gazebo & Unity) 
○ Focus: Physics simulation and environment building. 
○ Simulating physics, gravity, and collisions in Gazebo. 
○ High-fidelity rendering and human-robot interaction in Unity. 
○ Simulating sensors: LiDAR, Depth Cameras, and IMUs. 
● Module 3: The AI-Robot Brain (NVIDIA Isaac™) 
○ Focus: Advanced perception and training. 
○ NVIDIA Isaac Sim: Photorealistic simulation and synthetic data 
generation. 
○ Isaac ROS: Hardware-accelerated VSLAM (Visual SLAM) and 
navigation. 
○ Nav2: Path planning for bipedal humanoid movement. 
● Module 4: Vision-Language-Action (VLA) 
○ Focus: The convergence of LLMs and Robotics.  
○ Voice-to-Action: Using OpenAI Whisper for voice commands. 
○ Cognitive Planning: Using LLMs to translate natural language ("Clean 
the room") into a sequence of ROS 2 actions. 
○ Capstone Project: The Autonomous Humanoid. A final project where a 
simulated robot receives a voice command, plans a path, navigates 
obstacles, identifies an object using computer vision, and manipulates 
it.

## Response snapshot

Updated Constitution to v1.1.0.
Added "Course Details" section at the beginning, detailing the Focus, Goals, and Quarter Overview (Modules 1-4 + Capstone).

## Outcome

- ✅ Impact: Constitution now includes specific curriculum details.
- 🧪 Tests: N/A
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: null
- 🧠 Reflection: Integrated unstructured course text into structured constitution format.

## Evaluation notes (flywheel)

- Failure modes observed: null
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
