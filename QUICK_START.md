# Quick Start Guide - EdDSA Authentication

## Hybrid Authentication Approach

Your authentication system now uses a **hybrid approach**:

1. **Frontend ↔ Auth Server**: Session-based authentication (cookies)
2. **Python Backend**: EdDSA JWT tokens for API verification

## Architecture Flow

```
┌──────────────┐
│   Frontend   │
│  (Next.js)   │
└──────┬───────┘
       │ Session Cookie
       │ (Better Auth)
       ▼
┌──────────────────┐        EdDSA JWT         ┌──────────────────┐
│   Auth Server    │ ────────────────────>    │ Python Backend   │
│  (Better Auth)   │                           │    (FastAPI)     │
│   Port 10000     │                           │    Port 8000     │
└────────┬─────────┘                           └─────────┬────────┘
         │                                               │
         └───────────────┬───────────────────────────────┘
                         │
                 ┌───────▼────────┐
                 │ Neon Database  │
                 │  (PostgreSQL)  │
                 └────────────────┘
```

## Setup Steps

### 1. Start Auth Server

```bash
cd auth-server
npm install  # if not already done
npm run dev
```

**Expected Output:**
```
✓ Using existing EdDSA keys from environment
📋 Serving JWKS with EdDSA public key
Server is running on port 10000
```

### 2. Start Python Backend

```bash
# From project root
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Verify Setup

**Test JWKS Endpoint:**
```bash
curl http://localhost:10000/api/auth/jwks
```

**Test Database Health:**
```bash
curl http://localhost:10000/api/db/health
```

## Authentication Flow for Python Backend

### Step 1: User Signs Up/Logs In (Frontend)

The frontend uses Better Auth's session-based authentication. No changes needed here.

### Step 2: Get EdDSA JWT Token

After the user is authenticated, call the new endpoint:

```javascript
// In your frontend code
const response = await fetch('http://localhost:10000/api/auth/token/eddsa', {
  credentials: 'include' // Include session cookie
});

const { token } = await response.json();
// Store this token for Python backend API calls
```

Or via curl (with session cookie):
```bash
curl http://localhost:10000/api/auth/token/eddsa \
  -H "Cookie: auth_session=<session-cookie-value>"
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "expiresIn": 604800,
  "tokenType": "Bearer",
  "algorithm": "EdDSA"
}
```

### Step 3: Use Token with Python Backend

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <eddsa-token>" \
  -d '{
    "user_query": "What is this book about?",
    "mode": "standard"
  }'
```

## New Endpoints

### `/api/auth/token/eddsa` (GET)

**Description:** Get an EdDSA JWT token for Python backend authentication

**Authentication:** Requires active Better Auth session (cookie)

**Response:**
```json
{
  "token": "eyJhbGciOiJFZERTQSIsImtpZCI6ImJldHRlci1hdXRoLWVkZHNhLWtleSJ9...",
  "expiresIn": 604800,
  "tokenType": "Bearer",
  "algorithm": "EdDSA"
}
```

**Usage:**
```javascript
// After user login
const tokenResponse = await fetch('/api/auth/token/eddsa', {
  credentials: 'include'
});
const { token } = await tokenResponse.json();

// Use with Python backend
const chatResponse = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_query: 'Your question here',
    mode: 'standard'
  })
});
```

### `/api/auth/jwks` (GET)

**Description:** Get public key for EdDSA token verification

**Authentication:** None (public endpoint)

**Response:**
```json
{
  "keys": [{
    "kty": "OKP",
    "use": "sig",
    "alg": "EdDSA",
    "kid": "better-auth-eddsa-key",
    "crv": "Ed25519",
    "x": "KjettIXkTcNcmdgd1XNXsL54mvSX9faXL42umIrC_jI"
  }]
}
```

## Testing Complete Flow

### 1. Sign Up a Test User

```bash
curl -X POST http://localhost:10000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "name": "Test User"
  }'
```

### 2. Sign In

```bash
curl -X POST http://localhost:10000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

### 3. Get EdDSA Token

```bash
curl http://localhost:10000/api/auth/token/eddsa \
  -b cookies.txt
```

Copy the `token` value from the response.

### 4. Test Python Backend

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token-here>" \
  -d '{
    "user_query": "Test query",
    "mode": "standard"
  }'
```

## Troubleshooting

### "Authentication required" when getting EdDSA token

**Cause:** No active session cookie

**Solution:** Ensure you're passing the session cookie from the sign-in response

### "EdDSA token verification failed" in Python backend

**Cause:** Public key mismatch or token corruption

**Solution:**
1. Restart auth server (keys load on startup)
2. Get a fresh token
3. Verify JWKS endpoint is accessible

### Session errors (500) from Better Auth

**Cause:** Database connection issues

**Solution:**
```bash
# Check database health
curl http://localhost:10000/api/db/health

# Verify Neon connection string in auth-server/.env
```

## Why This Approach?

1. **Best of Both Worlds**: Session cookies for frontend security, JWT for backend scalability
2. **Better Auth Compatibility**: Uses Better Auth's strengths (session management)
3. **EdDSA Security**: Modern, secure algorithm for Python backend
4. **Neon Integration**: Full PostgreSQL support with SSL

## Next Steps

- ✅ Frontend: Store EdDSA token after login
- ✅ Python Backend: Verify EdDSA tokens (already implemented)
- 🔲 Add token refresh mechanism
- 🔲 Implement token revocation
- 🔲 Add rate limiting

For detailed information, see `AUTH_EDDSA_SETUP.md`
