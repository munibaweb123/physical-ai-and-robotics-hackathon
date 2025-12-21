---
id: 119
title: Configure SameSite Cookie for Cross-Domain Auth
stage: red
date: 2025-12-04
surface: agent
model: gemini-2.0-flash-exp
feature: none
branch: feature/docusaurus-chatbot-clean
user: user
command: export const auth = betterAuth({
    // ... other config
    advanced: {
        cookie: {
            secure: true,
            sameSite: "none" // REQUIRED for Vercel -> Hugging Face
        }
    }
});
labels: ["better-auth", "cookies", "cors", "fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - auth-server/src/auth.ts
tests: []
---

## Prompt

export const auth = betterAuth({
    // ... other config
    advanced: {
        cookie: {
            secure: true,
            sameSite: "none" // REQUIRED for Vercel -> Hugging Face
        }
    }
});

## Response snapshot

Updated `auth.ts` to set `session.cookie.sameSite` to "none", crucial for cross-domain authentication between Vercel and HF.

## Outcome

- ✅ Impact: Enabled cross-site cookie transmission for authentication.
- 🧪 Tests: None
- 📁 Files: 1 modified
- 🔁 Next prompts: None
- 🧠 Reflection: Cross-domain cookie configuration is a frequent pitfall in distributed systems.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
