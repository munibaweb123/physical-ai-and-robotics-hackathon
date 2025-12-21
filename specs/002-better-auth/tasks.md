---
description: "Task list for Better Auth Integration"
---

# Tasks: Better Auth Integration

**Input**: `specs/002-better-auth/plan.md`

## Phase 1: Auth Server Setup (Node.js)

- [ ] T001 Create `auth-server` directory and initialize `package.json`.
- [ ] T002 Install dependencies: `hono`, `better-auth`, `better-sqlite3`, `dotenv`, `tsx`.
- [ ] T003 Create `auth-server/src/db.ts` (SQLite setup).
- [ ] T004 Create `auth-server/src/auth.ts` (Better Auth config).
- [ ] T005 Create `auth-server/src/index.ts` (Hono server entrypoint).
- [ ] T006 Implement a helper endpoint `GET /verify-token` in `index.ts` for the Python backend (optional, or use standard Better Auth headers).
- [ ] T007 Run the server and verify `http://localhost:4000/api/auth/health` (or equivalent).

## Phase 2: Frontend Integration (Docusaurus)

- [ ] T008 Install `better-auth` client in `physical-ai-docs/`.
- [ ] T009 Create `physical-ai-docs/src/lib/auth-client.ts` for the client instance.
- [ ] T010 Create `Login` page component `physical-ai-docs/src/pages/login.tsx`.
- [ ] T011 Create `Register` page component `physical-ai-docs/src/pages/register.tsx`.
- [ ] T012 Update `physical-ai-docs/docusaurus.config.ts` to add Login/Register links.
- [ ] T013 Modify `Chatbot/index.tsx` to fetch the session and attach the token to requests.

## Phase 3: Backend Security (Python)

- [ ] T014 Create `auth_middleware.py` (or function) in `main.py`.
    -   *Logic*: Extract Bearer token. Call `http://localhost:4000/api/auth/get-session` (passing headers) to validate.
- [ ] T015 Protect `/chat` and `/ingest` endpoints with this dependency.

## Phase 4: Verification

- [ ] T016 Test Flow: Register -> Login -> Chat (Success).
- [ ] T017 Test Flow: Logout -> Chat (Fail/401).
