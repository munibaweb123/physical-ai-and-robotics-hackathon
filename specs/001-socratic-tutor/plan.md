# Implementation Plan: Socratic Tutor Subagent

**Branch**: `feature/socratic-tutor` | **Date**: 2025-12-02 | **Spec**: `specs/001-socratic-tutor/spec.md`
**Input**: Feature specification from `specs/001-socratic-tutor/spec.md`

## Summary

Implement a "Socratic Mode" in the existing RAG Chatbot Backend (`main.py`). This mode changes the assistant's behavior from providing direct answers to asking guiding questions based on the retrieved book context. This is achieved by adding a `mode` parameter to the chat API and swapping the system prompt dynamically.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, Pydantic, OpenAI SDK
**Storage**: Qdrant (existing, no schema changes needed)
**Testing**: `pytest` (for contract/integration tests) or simple `curl`/Python script verification.
**Target Platform**: Localhost / Render (deployment target)
**Project Type**: Backend API (FastAPI)
**Performance Goals**: Negligible overhead (<10ms additional latency for logic switch).
**Constraints**: Must not hallucinate; must strictly use RAG context.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Adhering to Conventions**: Yes, using existing `main.py` patterns.
- **Libraries**: No new libraries needed.
- **Tests**: Will include a reproduction script to verify behavior.

## Project Structure

### Documentation (this feature)

```text
specs/001-socratic-tutor/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Implementation tasks
```

### Source Code

```text
main.py                  # Core logic changes here
tests/                   # (Optional) Add test script here if strictly needed, or just a temporary script.
```

**Structure Decision**: Modifying `main.py` directly as it is a single-file microservice (currently).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       |            |                                     |
