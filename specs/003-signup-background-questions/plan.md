# Implementation Plan: Signup Background Questions

**Branch**: `003-signup-background-questions` | **Date**: 2025-12-20 | **Spec**: [specs/003-signup-background-questions/spec.md](specs/003-signup-background-questions/spec.md)
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement background questions during signup to collect user's software and hardware experience, which will be used to personalize content delivery. This involves extending the existing Better Auth user schema, updating the Docusaurus frontend signup flow, and creating a personalization engine in the FastAPI backend.

## Technical Context

**Language/Version**: TypeScript (Node.js 18+), Python 3.11, JavaScript/React (Docusaurus)
**Primary Dependencies**: Better Auth, FastAPI, Docusaurus, SQLite, Kysely, React
**Storage**: SQLite database (existing auth server), Qdrant Cloud (vector storage)
**Testing**: Jest (Node.js), pytest (Python), React Testing Library (frontend)
**Target Platform**: Web application (multi-service architecture)
**Project Type**: Web (frontend + backend + auth server)
**Performance Goals**: Signup flow remains under 2 minutes, personalization engine responds within 500ms
**Constraints**: Must integrate with existing auth system, maintain security standards for user data, GDPR compliance for background info
**Scale/Scope**: Support 10k+ users with personalized content delivery

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the existing constitution file, we need to ensure:
1. Test-first approach: All new functionality must have tests
2. Library-first: New components should be modular and reusable
3. CLI Interface: If applicable, provide CLI tools for admin tasks
4. Integration testing: New auth flows and personalization must be integration tested
5. Observability: Add logging and monitoring for the new personalization features

## Project Structure

### Documentation (this feature)

```text
specs/003-signup-background-questions/
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
└── requirements.txt

physical-ai-docs/         # Docusaurus frontend
├── src/
│   ├── pages/           # Login, register, profile pages
│   ├── components/      # Auth components
│   └── services/        # Auth service
├── docusaurus.config.js
└── package.json

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Multi-service web application architecture with separate auth server, backend API, and frontend. This maintains the existing architecture while allowing for proper separation of concerns between authentication, business logic, and presentation layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multiple services | Architecture already established | Would require significant refactoring of existing codebase |
| Database schema extension | Need to store user background data | Direct DB access would bypass Better Auth security |
