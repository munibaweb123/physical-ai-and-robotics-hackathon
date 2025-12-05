# Deployment Troubleshooting Guide

## 1. Architecture Requirement
Your application consists of **three** distinct parts that need to be deployed and connected:

1.  **Frontend (Vercel):** The Docusaurus documentation website.
2.  **Auth Server (Hugging Face Space A):** The Node.js `auth-server` handling logins.
3.  **Chat Backend (Hugging Face Space B):** The Python `main.py` handling the RAG chatbot.

**Crucial:** You cannot run both the Node.js Auth Server and the Python Chat Backend in the *same* Hugging Face Space unless you use a complex Docker setup (e.g., Supervisor). It is highly recommended to use **two separate Spaces**.

---

## 2. Configuration Checklist

### A. Auth Server (Hugging Face Space #1)
*Deploy the `auth-server/` directory here.*
Set these **Secrets/Environment Variables** in the Space settings:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `BETTER_AUTH_URL` | `https://YOUR-AUTH-SPACE-NAME.hf.space` | The public URL of this Auth Space. |
| `FRONTEND_URL` | `https://YOUR-VERCEL-PROJECT.vercel.app` | Your Vercel frontend URL. |
| `NODE_ENV` | `production` | Enables secure cookies. |
| `SESSION_COOKIE_SECRET` | `(A random strong string)` | Secret for signing cookies. |

### B. Chat Backend (Hugging Face Space #2)
*Deploy the root directory (with `main.py` and `Dockerfile`) here.*
Set these **Secrets/Environment Variables** in the Space settings:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `AUTH_SERVER_URL` | `https://YOUR-AUTH-SPACE-NAME.hf.space` | URL of Space #1 (Auth). |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI Key. |
| `QDRANT_URL` | `...` | Qdrant Cloud URL. |
| `QDRANT_API_KEY` | `...` | Qdrant API Key. |

### C. Frontend (Vercel)
*Deploy the `physical-ai-docs/` directory here.*
Set these **Environment Variables** in Vercel Project Settings:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `BETTER_AUTH_URL` | `https://YOUR-AUTH-SPACE-NAME.hf.space` | URL of Space #1 (Auth). |
| `NEXT_PUBLIC_API_URL` | `https://YOUR-CHAT-SPACE-NAME.hf.space` | URL of Space #2 (Chat). |

**Important:** After setting these variables in Vercel, you **must redeploy** the project (Deployment -> Redeploy) for them to take effect, as they are embedded at build time.

---

## 3. Common Issues

1.  **Login button redirects to localhost:**
    *   This means `BETTER_AUTH_URL` was not present during the Vercel build.
    *   **Fix:** Check Vercel env vars and **redeploy**.

2.  **"Login to Chat" works, but sending a message fails:**
    *   This means `NEXT_PUBLIC_API_URL` is missing or wrong.
    *   **Fix:** Ensure it points to the *Chat Backend* Space, not the Auth Space.

3.  **CORS Errors (Console):**
    *   Ensure `FRONTEND_URL` in the Auth Server matches your Vercel URL exactly (including `https://` and no trailing slash).

---

## 4. Troubleshooting Cookies (The "Login Loop")
If you login but are immediately redirected back or the "Login to Chat" button never changes:
1.  **The Problem:** Modern browsers block Cross-Site cookies if they are not marked `Secure`.
2.  **The Fix:**
    *   We updated `auth-server/src/auth.ts` to force `secure: true` when running on HTTPS.
    *   **Action:** Redeploy your **Auth Server** Space.
3.  **Verification:**
    *   Open Chrome DevTools -> Application -> Cookies.
    *   Look for `auth_session`.
    *   Ensure `Secure` is checked and `SameSite` is `None`.
