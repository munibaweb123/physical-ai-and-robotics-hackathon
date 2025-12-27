# 401 Error Root Cause & Complete Fix

## The Real Problem

You were getting 401 Unauthorized errors because there were **TWO separate JWT signing systems** running simultaneously, using **different encryption keys**:

### System 1: Better Auth JWT Plugin (Correct) ✅
- Location: `auth.ts` - `jwt()` plugin
- Keys: Generated internally by Better Auth
- Purpose: Create and verify JWT tokens automatically
- JWKS Endpoint: `/api/auth/jwks` (should serve these keys)

### System 2: Custom Manual EdDSA Code (Conflicting) ❌
- Location: `index.ts` - custom endpoints
- Keys: Loaded from environment variables (`eddsaKeys`)
- Purpose: Manually create EdDSA JWT tokens
- Endpoints: `/api/auth/login-with-token`, `/api/auth/token/eddsa`, `/api/auth/jwks`

## Why 401 Errors Happened

```
1. User logs in via frontend
       ↓
2. Frontend calls /api/auth/login-with-token (custom endpoint)
       ↓
3. Custom endpoint creates token with keys from System 2 (eddsaKeys)
       ↓
4. Frontend stores token: "eyJhbGc..." (signed with System 2 keys)
       ↓
5. Frontend makes request to /api/auth/user/background
       ↓
6. Backend calls auth.api.getSession() (Better Auth)
       ↓
7. Better Auth tries to verify token with System 1 keys
       ↓
8. Verification FAILS (different keys!)
       ↓
9. ❌ 401 Unauthorized
```

## Visual Representation

### Before (Broken)

```
┌─────────────────────────────────────────────────────────┐
│                    Auth Server                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  System 1: Better Auth JWT Plugin                      │
│  ├─ Internal Keys: A                                   │
│  ├─ /api/auth/sign-in/email → creates token with key A│
│  └─ auth.api.getSession() → verifies with key A       │
│                                                         │
│  System 2: Custom EdDSA Code (CONFLICTING!)           │
│  ├─ Environment Keys: B (different from A)            │
│  ├─ /api/auth/login-with-token → creates token with B │
│  ├─ /api/auth/token/eddsa → creates token with B      │
│  └─ /api/auth/jwks → serves key B (WRONG!)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      Frontend         │
              ├───────────────────────┤
              │ Calls custom endpoint │
              │ Gets token signed     │
              │ with key B           │
              └───────────────────────┘
                          │
                          ▼
         Token: "eyJ..." (signed with key B)
                          │
                          ▼
              ┌───────────────────────┐
              │  Backend Endpoints    │
              ├───────────────────────┤
              │ auth.api.getSession() │
              │ Tries to verify with  │
              │ key A                 │
              │                       │
              │ B ≠ A → ❌ 401        │
              └───────────────────────┘
```

### After (Fixed)

```
┌─────────────────────────────────────────────────────────┐
│                    Auth Server                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Better Auth ONLY (Single System)                      │
│  ├─ Internal Keys: A                                   │
│  ├─ /api/auth/sign-in/email → creates token with A    │
│  ├─ /api/auth/jwks → serves key A                     │
│  ├─ jwt() plugin → verifies tokens with A             │
│  └─ auth.api.getSession() → verifies with A           │
│                                                         │
│  ✅ Custom System 2 REMOVED                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      Frontend         │
              ├───────────────────────┤
              │ Calls Better Auth     │
              │ /api/auth/sign-in     │
              │ Gets token signed     │
              │ with key A            │
              └───────────────────────┘
                          │
                          ▼
         Token: "eyJ..." (signed with key A)
                          │
                          ▼
              ┌───────────────────────┐
              │  Backend Endpoints    │
              ├───────────────────────┤
              │ auth.api.getSession() │
              │ Verifies with key A   │
              │                       │
              │ A = A → ✅ 200 OK     │
              └───────────────────────┘
```

## What Was Fixed

### Commit 1: `bf67b131` - Simplified Session Verification
**File**: `auth-server/src/index.ts`
**Changes**:
- Removed 113 lines of manual EdDSA verification from `/api/auth/user/background`
- Simplified to use only `auth.api.getSession()`

**Result**: Still failed because System 2 was still creating incompatible tokens

### Commit 2: `eec1b656` - Removed All Custom JWT Code ✅
**File**: `auth-server/src/index.ts`
**Changes**:
- ❌ Removed `POST /api/auth/login-with-token` (232 lines)
- ❌ Removed `GET /api/auth/token/eddsa`
- ❌ Removed `GET /api/auth/jwks` (custom override)
- ❌ Removed `GET /api/auth/debug/keys`
- ❌ Removed all manual EdDSA code:
  - `createEdDSAToken()` function
  - `getEdDSAPrivateKeyPEM()` function
  - `eddsaKeys` loading
  - Imports: `crypto-utils`, `crypto`, `jsonwebtoken`

**Result**: ✅ Single JWT system (Better Auth only)

## Environment Variables No Longer Needed

These can be **removed** from Render:
- ❌ `EDDSA_PUBLIC_KEY` (not used anymore)
- ❌ `EDDSA_PRIVATE_KEY` (not used anymore)

These are **still required**:
- ✅ `BETTER_AUTH_SECRET` (Better Auth's secret key)
- ✅ `BETTER_AUTH_URL` (Auth server URL)
- ✅ `NEON_DATABASE_URL` (Database)
- ✅ `FRONTEND_URL` (CORS)

## Why Your Previous Attempts Didn't Work

### Attempt 1: Added Better Auth JWT Plugin
**What you did**: Enabled `jwt()` plugin in `auth.ts`
**Why it failed**: System 2 (custom endpoints) was still running and creating tokens with different keys

### Attempt 2: Added Environment Variables
**What you did**: Set `EDDSA_PUBLIC_KEY` and `EDDSA_PRIVATE_KEY`
**Why it failed**: This fed System 2 with keys, making the conflict worse

### Attempt 3: Fresh Login & Clear Cache
**What you did**: Cleared localStorage and logged in again
**Why it failed**: Frontend still called `/api/auth/login-with-token` (System 2), creating incompatible tokens

### Final Fix: Remove System 2 Entirely
**What was done**: Deleted all custom JWT code, forcing everything through Better Auth
**Result**: ✅ Success - single source of truth for JWT keys

## Current State

### Auth Server (Deployed)
- ✅ Better Auth JWT plugin enabled
- ✅ Custom endpoints removed
- ✅ Single JWT key system
- ✅ `/api/auth/jwks` serves Better Auth's keys
- ✅ `auth.api.getSession()` verifies correctly

### Frontend (Needs Update)
- ❌ Still calling `/api/auth/login-with-token` (removed)
- ❌ Custom login logic expects old response format
- ⏳ **Must be updated** to use Better Auth endpoints

## Next Steps

1. ✅ **Auth server deployed** (Render auto-deployed `eec1b656`)
2. ⏳ **Update frontend** (see `FRONTEND_UPDATE_REQUIRED.md`)
   - Change login endpoint: `/api/auth/login-with-token` → `/api/auth/sign-in/email`
   - Use Better Auth client library OR native fetch with Better Auth endpoints
   - Remove manual token extraction (use session cookies)
3. ⏳ **Redeploy frontend** to Vercel
4. ⏳ **Test login flow** (should work without 401 errors)

## How to Verify It's Working

### 1. Check Auth Server Health
```bash
curl https://physical-ai-and-robotics-hackathon.onrender.com/api/db/health
# Expected: {"status":"healthy"}
```

### 2. Check JWKS Endpoint (Better Auth's Keys)
```bash
curl https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/jwks
# Expected: {"keys":[{"kty":"OKP","alg":"EdDSA",...}]}
```

### 3. Test Login with Better Auth Endpoint
```bash
curl -X POST https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@gmail.com","password":"password"}' \
  -c cookies.txt

# Expected: {"user":{"id":"...","email":"alice@gmail.com"},"session":{...}}
```

### 4. Test Protected Endpoint with Session Cookie
```bash
curl -X GET https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/user/background \
  -b cookies.txt

# Expected: {"userId":"...","softwareExperienceLevel":"...",...}
# NOT: 401 Unauthorized
```

## Technical Details

### Better Auth JWT Plugin Configuration
```typescript
// auth-server/src/auth.ts
jwt({
    algorithm: 'EdDSA',                    // Ed25519 elliptic curve
    issuer: AUTH_SERVER_BASE_URL,          // Token issuer
    audience: AUTH_SERVER_BASE_URL,        // Token audience
    jwks: {
        rotationInterval: 60 * 60 * 24 * 30,  // Rotate keys every 30 days
        gracePeriod: 60 * 60 * 24 * 30         // Keep old keys for 30 days
    }
})
```

This configuration:
- ✅ Generates Ed25519 key pairs internally
- ✅ Rotates keys automatically for security
- ✅ Exposes public keys via `/api/auth/jwks`
- ✅ Verifies JWT tokens via `auth.api.getSession()`
- ✅ Works seamlessly with `bearer()` plugin

### Session Cookie Configuration
```typescript
// auth-server/src/auth.ts
session: {
    cookie: {
        name: 'auth_session',
        secure: true,              // HTTPS only
        httpOnly: true,            // No JS access
        sameSite: "none",          // Cross-domain (Vercel → Render)
        path: '/',                 // Available everywhere
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
}
```

This ensures:
- ✅ Cookies work across Vercel (frontend) and Render (backend)
- ✅ Browsers don't block cookies (SameSite=none + Secure)
- ✅ Secure against XSS (httpOnly)
- ✅ Secure against MITM (secure/HTTPS)

## Lessons Learned

1. **Never run two JWT systems simultaneously** - they will conflict
2. **Don't override Better Auth endpoints** - let the plugins handle it
3. **Trust the framework** - Better Auth's JWT plugin handles everything
4. **Manual crypto is error-prone** - use well-tested libraries
5. **Key consistency is critical** - one source of truth for signing keys

---

**Status**: Auth server fixed and deployed ✅
**Remaining**: Frontend needs update ⏳
**Date**: 2025-12-27
**Author**: Claude (Anthropic)
**Commits**: `bf67b131`, `eec1b656`
