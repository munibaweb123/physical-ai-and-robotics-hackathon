# Implementation Plan: Expand Course Content

**Branch**: `002-expand-course-content` | **Date**: 2025-11-29 | **Spec**: [specs/002-expand-course-content/spec.md](../spec.md)
**Input**: Feature specification from `specs/002-expand-course-content/spec.md`

## Summary

Expand the existing Docusaurus documentation to include detailed content for Modules 1-4 and the Capstone project, aligning with the newly ratified Constitution v1.1.0. This involves updating existing placeholder pages and ensuring the sidebar structure clearly maps the "Week X-Y" directory structure to the "Module Z" conceptual structure.

## Technical Context

**Language/Version**: Markdown/MDX (Docusaurus v3 compatible)
**Primary Dependencies**: Docusaurus Core (existing), Mermaid (existing)
**Storage**: Static MDX files
**Testing**: Visual verification via `docusaurus serve`
**Target Platform**: Web (Static Site)
**Project Type**: Documentation
**Performance Goals**: N/A (Static content)
**Constraints**: Must adhere to the strict module definitions in Constitution v1.1.0.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Embodied Intelligence First**: Content must emphasize physical constraints.
- [x] **Simulation-to-Real Fidelity**: Module 2 & 3 content must enforce "Digital Twin" workflow.
- [x] **Hardware-Aware Architecture**: Content must reference Workstation vs Edge separation.
- [x] **Hybrid AI Stack**: Module 4 content must cover VLA/LLM integration.

## Project Structure

### Documentation (this feature)

```text
specs/002-expand-course-content/
├── plan.md              # This file
├── research.md          # Phase 0 output (Content Mapping)
├── data-model.md        # Phase 1 output (Sidebar Updates)
├── quickstart.md        # Phase 1 output (N/A - existing)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
physical-ai-coursework/docs/
├── modules/
│   ├── week1-2-foundations.md  # Pre-reqs
│   ├── week3-5-ros2.md         # Module 1
│   ├── week6-7-simulation.md   # Module 2
│   ├── week8-10-isaac.md       # Module 3
│   ├── week11-12-humanoid.md   # Module 3 (Advanced)
│   └── week13-conversational.md# Module 4
└── assessments/
    └── projects.md             # Capstone
```

**Structure Decision**: Maintain existing directory structure but update content headers and Sidebars to reflect "Module" mapping.

## Complexity Tracking

No violations.