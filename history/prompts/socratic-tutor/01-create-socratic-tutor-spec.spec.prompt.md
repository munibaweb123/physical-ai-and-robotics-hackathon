---
id: "01-create-socratic-tutor-spec"
title: "Create specification for Socratic Tutor Subagent"
stage: "spec"
date: "2025-12-02"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "socratic-tutor"
branch: "feature/socratic-tutor"
user: "YOusuf Traders"
command: "create socratic tutor subagent in my project"
labels:
  - "socratic-tutor"
  - "backend"
  - "rag"
links:
  spec: "specs/001-socratic-tutor/spec.md"
files_yaml:
  - "specs/001-socratic-tutor/spec.md"
tests_yaml: []
---

User Input:
"""
create socratic tutor subagent in my project
"""

Response:
"""
I have created a specification for the Socratic Tutor Subagent. This feature will introduce a new `mode` parameter to the chat API, allowing the assistant to switch between a "Standard" direct-answer mode and a "Socratic" questioning mode.

I've drafted the spec at `specs/001-socratic-tutor/spec.md`.
"""
