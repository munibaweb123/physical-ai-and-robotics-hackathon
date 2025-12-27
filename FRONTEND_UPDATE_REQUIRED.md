# Frontend Update Required - Better Auth Native Endpoints

## Critical: Custom Login Endpoint Removed

The custom `/api/auth/login-with-token` endpoint has been **removed** because it was creating JWT tokens with incompatible keys, causing 401 errors.

## Current Frontend Code (BROKEN)

Your frontend is currently calling:
```javascript
POST https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/login-with-token
{
  "email": "alice@gmail.com",
  "password": "password"
}
```

This endpoint **no longer exists** ❌

## New Frontend Code (REQUIRED)

### Option 1: Use Better Auth Client Library (Recommended)

Install Better Auth client:
```bash
npm install better-auth
```

Update your login code:
```typescript
import { createAuthClient } from "better-auth/client"

const authClient = createAuthClient({
    baseURL: "https://physical-ai-and-robotics-hackathon.onrender.com"
})

// Login
async function login(email: string, password: string) {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
    })

    if (error) {
        console.error("Login failed:", error)
        return null
    }

    // Better Auth automatically manages session cookies
    // For Bearer token access (Python backend), get the session token:
    const session = await authClient.getSession()
    if (session) {
        // Store token for API requests
        localStorage.setItem('auth_token', session.session.token)
        console.log("✓ Logged in:", session.user.email)
        return session
    }
}

// Get current session
async function getCurrentUser() {
    const session = await authClient.getSession()
    return session?.user
}

// Logout
async function logout() {
    await authClient.signOut()
    localStorage.removeItem('auth_token')
}
```

### Option 2: Manual Fetch Calls

If you can't use the Better Auth client library, use Better Auth's native REST endpoints:

```typescript
// Login
async function login(email: string, password: string) {
    const response = await fetch(
        'https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/sign-in/email',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify({ email, password })
        }
    )

    if (!response.ok) {
        console.error('Login failed:', response.status)
        return null
    }

    const data = await response.json()
    console.log('✓ Login successful:', data.user.email)

    // Get session to extract token
    const sessionResponse = await fetch(
        'https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/get-session',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    const session = await sessionResponse.json()
    if (session.session?.token) {
        localStorage.setItem('auth_token', session.session.token)
    }

    return data
}

// Get current user
async function getCurrentUser() {
    const response = await fetch(
        'https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/get-session',
        {
            method: 'GET',
            credentials: 'include'
        }
    )

    if (!response.ok) {
        return null
    }

    const data = await response.json()
    return data.user
}

// Logout
async function logout() {
    await fetch(
        'https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/sign-out',
        {
            method: 'POST',
            credentials: 'include'
        }
    )
    localStorage.removeItem('auth_token')
}
```

### Option 3: Use Session Cookies Only (Simplest)

Better Auth automatically creates secure session cookies. You don't need to manually store tokens:

```typescript
// Login
async function login(email: string, password: string) {
    const response = await fetch(
        'https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/sign-in/email',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Browser handles cookies automatically
            body: JSON.stringify({ email, password })
        }
    )

    const data = await response.json()
    return data.user
}

// Make authenticated requests
async function fetchUserBackground() {
    const response = await fetch(
        'https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/user/background',
        {
            credentials: 'include' // Include session cookie
        }
    )

    return response.json()
}
```

## Key Changes Summary

| Before (Custom) | After (Better Auth) |
|----------------|---------------------|
| `POST /api/auth/login-with-token` ❌ | `POST /api/auth/sign-in/email` ✅ |
| Manual EdDSA token in response | Session cookie + JWT via plugin |
| Store token manually | Use session cookies or get token via `/api/auth/get-session` |
| Bearer token only | Cookie + Bearer token support |

## API Endpoints Now Available

Better Auth provides these standard endpoints:

### Authentication
- `POST /api/auth/sign-in/email` - Email/password login
- `POST /api/auth/sign-up/email` - Register new user
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session

### User Management
- `GET /api/auth/user` - Get current user
- `POST /api/auth/user/update` - Update user profile

### Token Management
- `GET /api/auth/jwks` - Get public keys (for Python backend)
- `POST /api/auth/refresh-token` - Refresh expired tokens

### Custom Endpoints (Unchanged)
- `GET /api/auth/user/background` - Get user background info ✅
- `POST /api/auth/user/background` - Update user background info ✅
- `GET /api/auth/chapters/:id/personalize` - Get personalization state ✅
- `POST /api/auth/chapters/:id/personalize` - Update personalization ✅

## Testing After Update

1. **Update frontend code** to use Better Auth endpoints
2. **Redeploy frontend** to Vercel
3. **Wait for auth server deployment** on Render (~2-3 minutes)
4. **Clear browser data**:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   ```
5. **Log in again** with new endpoints
6. **Verify no 401 errors**

## Expected Behavior After Fix

### Login Flow
```
User enters email/password
    ↓
Frontend calls POST /api/auth/sign-in/email
    ↓
Better Auth validates credentials
    ↓
Better Auth creates:
  - Session cookie (auth_session)
  - JWT token (via jwt() plugin)
    ↓
Frontend receives:
  {
    "user": { "id": "...", "email": "..." },
    "session": { "token": "...", "expiresAt": "..." }
  }
    ↓
Session cookie stored automatically by browser
Token available for Bearer auth (optional)
    ↓
✅ All API requests work with session cookie OR Bearer token
```

### API Request Flow
```
Frontend makes request to protected endpoint
    ↓
Includes: credentials: 'include' (cookie)
    OR
Includes: Authorization: Bearer <token>
    ↓
Better Auth's auth.api.getSession() verifies:
  - Session cookie OR
  - Bearer token via bearer() plugin OR
  - JWT token via jwt() plugin
    ↓
Verification succeeds
    ↓
✅ 200 OK with data
```

## Troubleshooting

### Still getting 401 errors?

1. **Check frontend is using new endpoints**:
   - Look for calls to `/api/auth/login-with-token` ❌
   - Should use `/api/auth/sign-in/email` ✅

2. **Verify cookies are being sent**:
   - DevTools → Application → Cookies
   - Should see `auth_session` cookie
   - Domain: `.onrender.com`
   - SameSite: `None`, Secure: `✓`

3. **Check CORS credentials**:
   ```javascript
   // MUST include this in all authenticated requests
   fetch(url, { credentials: 'include' })
   ```

4. **Verify auth server deployment**:
   ```bash
   curl https://physical-ai-and-robotics-hackathon.onrender.com/api/db/health
   # Should return: {"status":"healthy"}
   ```

5. **Check JWKS endpoint** (should be Better Auth's, not custom):
   ```bash
   curl https://physical-ai-and-robotics-hackathon.onrender.com/api/auth/jwks
   # Should return Better Auth's JWT plugin keys
   ```

## Where to Update Frontend Code

Look for these files in your frontend codebase:
- Authentication service/module (likely `auth.ts`, `authService.ts`, or similar)
- Login component (likely `Login.tsx`, `LoginPage.tsx`, etc.)
- API client configuration
- Token storage logic

Search for:
- `/api/auth/login-with-token` ❌ (replace with `/api/auth/sign-in/email`)
- `/api/auth/token/eddsa` ❌ (no longer needed)
- Manual token storage logic (simplify to use session cookies)

---

**Status**: Auth server deployed ✅
**Next Step**: Update frontend to use Better Auth endpoints ⏳
**Date**: 2025-12-27
**Author**: Claude (Anthropic)
