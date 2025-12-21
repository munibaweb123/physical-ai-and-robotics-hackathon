---
id: "113-fix-cross-site-cookies-config"
title: "Fix Cross-Site Cookies Configuration"
stage: "general"
date: "2025-12-05"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "docusaurus-chatbot-ui"
branch: "feature/docusaurus-chatbot-clean"
user: "User"
command: "fix-cookies-config"
labels:
  - "auth"
  - "cookies"
  - "security"
  - "better-auth"
links:
  - spec: null
  - ticket: null
  - adr: null
  - pr: null
files:
  - "auth-server/src/auth.ts"
  - "DEPLOYMENT_FIX.md"
tests:
  - "manual verification of auth.ts"
prompt: |
  i think its cookies problem
response: |
  Confirmed that the issue is caused by the `secure` cookie attribute defaulting to `false` when `NODE_ENV` is not explicitly set to `production`, causing browsers to block Cross-Site cookies (Vercel -> Hugging Face). Updated `auth-server/src/auth.ts` to force `secure: true` if the `BETTER_AUTH_URL` starts with `https`. Added a troubleshooting section to `DEPLOYMENT_FIX.md`.
---
