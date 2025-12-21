# Implementation Plan: Chapter Content Personalization

**Branch**: `004-chapter-personalization` | **Date**: 2025-12-20 | **Spec**: [specs/004-chapter-personalization/spec.md](specs/004-chapter-personalization/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable logged-in users to personalize content in chapters by pressing a button at the start of each chapter. This involves extending the existing personalization system to work at the chapter level, adding a personalization toggle button to chapter pages, and adapting content based on the user's profile information (software/hardware experience, skills, preferences) collected during signup.

## Technical Context

**Language/Version**: TypeScript (React/Docusaurus), Python 3.11 (FastAPI), JavaScript/React (Docusaurus)
**Primary Dependencies**: Docusaurus, React, Better Auth, FastAPI, Python Personalization Engine
**Storage**: SQLite database (auth server), Markdown files (content), Qdrant Cloud (vector storage)
**Testing**: Jest (Node.js), pytest (Python), React Testing Library (frontend)
**Target Platform**: Web application (multi-service architecture)
**Project Type**: Web (frontend + backend + auth server)
**Performance Goals**: Personalization toggle responds within 500ms, content adaptation happens in real-time without page reload
**Constraints**: Must integrate with existing Docusaurus content structure, maintain security standards for user data, work seamlessly with existing authentication
**Scale/Scope**: Support 10k+ users with personalized chapter content delivery

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the existing constitution file, we need to ensure:
1. Test-first approach: All new functionality must have tests
2. Library-first: New components should be modular and reusable
3. Integration testing: New personalization features must be integration tested with existing auth and content systems
4. Observability: Add logging and monitoring for the new personalization features

## Project Structure

### Documentation (this feature)

```text
specs/004-chapter-personalization/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
auth-server/              # Node.js auth server with Better Auth
├── src/
│   ├── auth.ts          # Better Auth configuration
│   ├── database.ts      # Kysely database configuration
│   └── index.ts         # Server entry point
├── auth_v2.db           # SQLite database
└── package.json

backend/                  # Python FastAPI backend for RAG chatbot
├── src/
│   ├── main.py          # FastAPI application
│   ├── auth.py          # Auth verification middleware
│   ├── models/
│   └── services/
├── services/            # Personalization engine
│   └── personalization_engine.py
└── requirements.txt

physical-ai-docs/         # Docusaurus frontend
├── src/
│   ├── pages/           # Login, register, profile pages
│   ├── components/      # Auth components, personalization controls
│   └── services/        # Auth service, personalization service
├── docs/                # Chapter content (markdown files)
│   ├── 01-foundations/
│   ├── 02-ros2-system/
│   ├── 03-brain-control/
│   ├── 04-cognitive-ai/
│   └── 99-appendices/
├── docusaurus.config.js
└── package.json

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Multi-service web application architecture with separate auth server, backend API, and frontend. This maintains the existing architecture while allowing for proper separation of concerns between authentication, personalization logic, and content presentation. The chapter personalization will be implemented primarily in the frontend with data from the existing personalization engine.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multiple services | Architecture already established | Would require significant refactoring of existing codebase |
| Client-side personalization logic | Need to adapt content without full page reload | Server-side would require complex state management and slower response times |
