# Feature Specification: Better Auth Implementation

**Feature Branch**: `feature/better-auth`
**Created**: 2025-12-02
**Status**: Draft
**Input**: User request: "implement https://www.better-auth.com/ authentication in my project"

## Architecture Strategy

Since the current backend (`main.py`) is Python (FastAPI) and `better-auth` is a TypeScript-first library, we will implement a **Sidecar Authentication Service**.

1.  **Auth Server**: A dedicated Node.js service (using Hono) running `better-auth`.
2.  **Database**: SQLite (stored in `auth-server/auth.db`) for user data.
3.  **Frontend**: Docusaurus will use the `better-auth` client to handle login/signup.
4.  **Backend**: FastAPI will verify JWTs issued by the Auth Server using a shared secret.

## User Scenarios

### User Story 1 - User Registration & Login (Priority: P1)

As a user, I want to create an account and log in so that I can access the chatbot.

**Acceptance Scenarios**:
1.  **Given** I am on the new `/login` page, **When** I enter valid credentials, **Then** I am redirected to the home page and see my profile in the navbar.
2.  **Given** I am not logged in, **When** I try to use the Chatbot, **Then** the system prompts me to log in (or the API returns 401).

## Requirements

### Functional Requirements

-   **FR-001**: Create `auth-server` directory with a Node.js + Hono + Better Auth setup.
-   **FR-002**: Configure `better-auth` to use SQLite.
-   **FR-003**: Expose endpoints for `signUp`, `signIn`, `signOut`, `getSession`.
-   **FR-004**: Docusaurus MUST have a `Login` page and `Register` page.
-   **FR-005**: The Chatbot component MUST send an `Authorization` header with the JWT/Session token.
-   **FR-006**: The Python backend (`main.py`) MUST validate the `Authorization` header. If invalid, return 401.

### Key Entities

-   **User**: `id`, `email`, `password`, `name`.
-   **Session**: `id`, `userId`, `expiresAt`.

## Success Criteria

-   User can sign up and log in.
-   `/chat` endpoint rejects requests without a valid token.
-   `/chat` endpoint accepts requests with a valid token.
