# Feature Specification: Socratic Tutor Subagent

**Feature Branch**: `feature/socratic-tutor`
**Created**: 2025-12-02
**Status**: Draft
**Input**: User description: "create socratic tutor subagent in my project"

## User Scenarios & Testing

### User Story 1 - Enable Socratic Mode (Priority: P1)

As a learner reading the Physical AI course material, I want to interact with a "Socratic Tutor" that guides me to understanding concepts through questions, rather than just receiving direct answers, so that I can deepen my learning and critical thinking.

**Why this priority**: This is the core request. It adds a distinct pedagogical mode to the chatbot.

**Independent Test**: Send a request to the `/chat` endpoint with `mode="socratic"` and verify the response is a guiding question, not a direct answer.

**Acceptance Scenarios**:

1. **Given** the backend is running, **When** I send a POST request to `/chat` with `user_query="What is a PID controller?"` and `mode="socratic"`, **Then** the response should ask me what I already know about feedback loops or control systems, rather than defining PID directly.
2. **Given** the backend is running, **When** I send a POST request to `/chat` with `mode="standard"` (or omitted), **Then** the response should directly define a PID controller based on the text.

---

### Edge Cases

- What happens if `mode` is set to an invalid string (e.g., "pirate")?
  - System should default to "standard" or return a validation error. (Decision: Default to "standard" for robustness, or validate if using Pydantic Enum).
- What happens if the context is missing?
  - The Socratic tutor should probably admit it doesn't know the specific book answer but can still try to guide based on general knowledge (or strictly refuse if strictly grounded). (Decision: Stick to strict grounding to avoid hallucinations, similar to standard mode).

## Requirements

### Functional Requirements

- **FR-001**: The `ChatRequest` model in `main.py` MUST accept an optional `mode` field (string), defaulting to "standard".
- **FR-002**: The system MUST recognize "socratic" as a valid mode.
- **FR-003**: When `mode` is "socratic", the OpenAI system prompt MUST be replaced with a specific Socratic Tutor persona.
- **FR-004**: The Socratic persona MUST:
    - Base questions on the provided RAG context.
    - Ask one question at a time.
    - Avoid giving the answer away immediately.
    - Be encouraging and concise.
- **FR-005**: The Standard mode MUST remain unchanged (direct helpful assistant).

### Key Entities

- **ChatRequest**: Updated to include `mode`.
- **SystemPrompts**: A new dictionary or mapping to hold different prompts for different modes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A curl request with `mode="socratic"` returns a response ending in a question mark or clearly structured as a question 90% of the time.
- **SC-002**: Existing standard chat functionality is not regressed (tests pass).
