---
description: "Task list for Socratic Tutor Subagent"
---

# Tasks: Socratic Tutor Subagent

**Input**: Design documents from `specs/001-socratic-tutor/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup & Verification

**Purpose**: Verify current behavior and prepare for TDD-style implementation.

- [ ] T001 Create reproduction script `repro_socratic.py` to test "standard" vs "socratic" behavior.
    -   *Goal*: Script should send requests to `localhost:8000/chat`.
    -   *Expectation*: "standard" works, "socratic" fails (or defaults to standard without distinction) before changes.

## Phase 2: Foundational & Core Logic (User Story 1)

**Purpose**: Implement the Socratic mode logic in the backend.

- [ ] T002 Modify `ChatRequest` model in `main.py`.
    -   *Action*: Add `mode: Optional[str] = "standard"` to the Pydantic model.
- [ ] T003 Define System Prompts in `main.py`.
    -   *Action*: Create a `SYSTEM_PROMPTS` dictionary constant.
    -   *Key*: `standard` -> Existing prompt.
    -   *Key*: `socratic` -> New Socratic persona prompt (guiding questions, no direct answers).
- [ ] T004 Implement Prompt Switching Logic in `chat_with_rag`.
    -   *Action*: Select the prompt based on `request.mode`. Handle invalid modes gracefully (fallback to standard).

## Phase 3: Validation

**Purpose**: Ensure the new feature works and existing features are not broken.

- [ ] T005 Run `repro_socratic.py` to verify "socratic" mode returns questions.
- [ ] T006 Run `repro_socratic.py` to verify "standard" mode still returns direct answers.
- [ ] T007 Manual smoke test with a few sample queries to check quality.

## Phase 4: Cleanup

- [ ] T008 Remove `repro_socratic.py` (or move to `tests/` if keeping).
