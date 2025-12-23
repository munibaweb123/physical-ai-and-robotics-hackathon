---
id: whisper-integration
title: Whisper Integration
---

# Vision-Language-Action (VLA)

"From words to motion." The convergence of Generative AI and Robotics.

## Voice-to-Action

Traditional robots require complex joystick inputs or code. Physical AI agents interact naturally.

### OpenAI Whisper
We use **Whisper**, a general-purpose speech recognition model, to give the robot "ears".

1.  **Audio Capture**: Microphone buffer captures user command.
2.  **Transcribing**: Whisper converts audio waveform to text.
    -   *Input*: "Robot, please pick up the red apple."
    -   *Output*: Text string.
3.  **Intent Extraction**: This text is passed to the Cognitive Planner (LLM).
