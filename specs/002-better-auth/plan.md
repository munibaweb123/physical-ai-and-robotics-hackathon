# Implementation Plan: Better Auth Integration

**Branch**: `feature/better-auth` | **Date**: 2025-12-02 | **Spec**: `specs/002-better-auth/spec.md`

## Summary

Implement a sidecar Node.js service (`auth-server`) to handle authentication using `better-auth`. Update the Docusaurus frontend to use this service for login/signup. Secure the Python backend (`main.py`) by validating session tokens.

## Technical Context

-   **Auth Server**: Node.js (v20+), Hono, `better-auth`, SQLite.
-   **Frontend**: React (Docusaurus), `better-auth/client`.
-   **Backend**: Python (FastAPI).
-   **Communication**: HTTP (REST).
-   **Token Strategy**: Bearer Token (using the session token).

## Project Structure

```text
auth-server/
├── package.json
├── src/
│   ├── index.ts         # Hono server setup
│   ├── auth.ts          # Better Auth configuration
│   └── db.ts            # Database connection
└── auth.db              # SQLite database
```

## Dependencies

-   **Node.js**: `hono`, `better-auth`, `better-sqlite3` (or similar adapter).
-   **Frontend**: `better-auth`.
-   **Python**: No new major libs, just logic to verify token (via a shared secret or introspect endpoint - *Decision: We will use a shared secret for verification or simple DB lookup if feasible, but for this MVP, we might just pass the token and have the Python backend call the Auth Server to validate it, or share the secret if using JWTs. Better Auth uses session tokens by default, so we'll create a /verify endpoint on the Auth Server that Python calls.*)

**Refined Strategy for Verification**:
To keep Python simple:
1.  Frontend sends Session Token in header.
2.  Python Backend calls `POST http://localhost:4000/api/auth/get-session` (or similar) with the token to validate.
    *   *Optimization*: For high perf, we'd share the DB or use JWTs, but for MVP, API validation is safest and easiest across languages.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New Service | Python backend can't run Better Auth | Better Auth is TS only. |
