# Render Deployment Guide

Complete guide for deploying the Physical AI and Robotics Hackathon platform to Render.

## Architecture Overview

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend  │────────▶│  Auth Server     │────────▶│   PostgreSQL    │
│  (Vercel)   │         │  (Render/Node)   │         │   (Neon)        │
└─────────────┘         └──────────────────┘         └─────────────────┘
       │                         │
       │                         │ /api/auth/jwks
       │                         ▼
       │                ┌──────────────────┐         ┌─────────────────┐
       └───────────────▶│  Python Backend  │────────▶│   Qdrant        │
                        │  (Render/Docker) │         │   (Vector DB)   │
                        └──────────────────┘         └─────────────────┘
```

## Services

### 1. Auth Server (Node.js)
- **Name**: `physical-ai-auth`
- **Runtime**: Node.js 20
- **Location**: `auth-server/`
- **Endpoints**:
  - `/api/auth/*` - Better Auth endpoints
  - `/api/auth/jwks` - EdDSA public keys (for Python backend)
  - `/api/auth/user/background` - User background info
  - `/api/db/health` - Health check

### 2. Python Backend (FastAPI)
- **Name**: `physical-ai-backend`
- **Runtime**: Docker
- **Location**: `hf-backend-deploy/`
- **Endpoints**:
  - `/` - Health check
  - `/chat` - RAG chatbot endpoint
  - Other API endpoints

---

## Step-by-Step Deployment

### Prerequisites

1. **GitHub Repository**: Code pushed to your repo
2. **Render Account**: https://render.com
3. **Neon Database**: PostgreSQL database URL
4. **Qdrant Cloud**: Vector database URL + API key
5. **OpenAI API Key**: For embeddings and chat

---

### Step 1: Generate Secrets

Run this command in the `auth-server` directory:

```bash
cd auth-server
node scripts/generate-eddsa-keys.js
```

This will output:
- `EDDSA_PUBLIC_KEY`
- `EDDSA_PRIVATE_KEY`
- `BETTER_AUTH_SECRET`

**Keep these values** - you'll need them in the next steps.

---

### Step 2: Deploy to Render via Blueprint

#### Option A: Automatic Deployment (Recommended)

1. Go to https://render.com/dashboard
2. Click **"New" → "Blueprint"**
3. Connect your GitHub repository
4. Select branch: `002-expand-course-content`
5. Render will detect `render.yaml` and create both services
6. Continue to Step 3 to configure environment variables

#### Option B: Manual Deployment

If automatic detection doesn't work:

**Deploy Auth Server:**
1. New → Web Service
2. Connect repository: `auth-server/`
3. Name: `physical-ai-auth`
4. Runtime: Node
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Continue to environment variables

**Deploy Python Backend:**
1. New → Web Service
2. Connect repository: `hf-backend-deploy/`
3. Name: `physical-ai-backend`
4. Runtime: Docker
5. Dockerfile Path: `./Dockerfile`
6. Continue to environment variables

---

### Step 3: Configure Environment Variables

#### Auth Server (`physical-ai-auth`)

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Auto-set |
| `DATABASE_PROVIDER` | `neon` | Auto-set |
| `SESSION_COOKIE_SECRET` | [Auto-generated] | Auto-set |
| `NEON_DATABASE_URL` | `postgresql://...` | **Your Neon DB URL** |
| `BETTER_AUTH_URL` | `https://physical-ai-auth.onrender.com` | **Your auth service URL** |
| `BETTER_AUTH_SECRET` | [From Step 1] | **Copy from generated secrets** |
| `EDDSA_PUBLIC_KEY` | [From Step 1] | **Copy from generated secrets** |
| `EDDSA_PRIVATE_KEY` | [From Step 1] | **Copy from generated secrets** |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Your Vercel URL** |

#### Python Backend (`physical-ai-backend`)

| Variable | Value | Notes |
|----------|-------|-------|
| `OPENAI_API_KEY` | `sk-...` | **Your OpenAI key** |
| `QDRANT_URL` | `https://...` | **Your Qdrant URL** |
| `QDRANT_API_KEY` | `...` | **Your Qdrant API key** |
| `AUTH_SERVER_URL` | [Auto from service] | Auto-linked to auth service |
| `BETTER_AUTH_SECRET` | [From Step 1] | **SAME as auth server!** |
| `FRONTEND_URL` | `https://your-app.vercel.app` | **Your Vercel URL** |

**CRITICAL**: `BETTER_AUTH_SECRET` must be **IDENTICAL** on both services!

---

### Step 4: Verify Deployment

#### Check Auth Server

1. Go to: `https://physical-ai-auth.onrender.com/api/db/health`
2. Should return: `{"status": "ok"}`

3. Check JWKS endpoint: `https://physical-ai-auth.onrender.com/api/auth/jwks`
4. Should return:
   ```json
   {
     "keys": [{
       "kty": "OKP",
       "use": "sig",
       "alg": "EdDSA",
       "kid": "better-auth-eddsa-key",
       "crv": "Ed25519",
       "x": "..."
     }]
   }
   ```

#### Check Python Backend

1. Go to: `https://physical-ai-backend.onrender.com/`
2. Should return: `{"message": "Physical AI Book Backend is running", "status": "healthy"}`

3. Check logs for:
   ```
   ✓ JWKS fetched successfully - EdDSA token verification enabled
   - Loaded key: kid=better-auth-eddsa-key, alg=EdDSA
   ```

---

### Step 5: Update Frontend

Update your Vercel environment variables:

```bash
NEXT_PUBLIC_AUTH_URL=https://physical-ai-auth.onrender.com
NEXT_PUBLIC_API_URL=https://physical-ai-backend.onrender.com
```

Redeploy your frontend on Vercel.

---

## Troubleshooting

### Issue: 401 Unauthorized on `/api/auth/user/background`

**Cause**: EdDSA keys not set or BETTER_AUTH_SECRET mismatch

**Solution**:
1. Verify `EDDSA_PUBLIC_KEY` and `EDDSA_PRIVATE_KEY` are set on auth server
2. Verify `BETTER_AUTH_SECRET` is **identical** on both services
3. Regenerate keys if needed: `node scripts/generate-eddsa-keys.js`
4. Redeploy both services

### Issue: Python backend fails to fetch JWKS

**Cause**: `AUTH_SERVER_URL` not set or incorrect

**Solution**:
1. Check `AUTH_SERVER_URL` environment variable
2. Should be: `https://physical-ai-auth.onrender.com` (no trailing slash)
3. Verify auth server is running and accessible
4. Check Python backend logs for connection errors

### Issue: Docker build fails

**Cause**: Missing dependencies or incorrect Dockerfile

**Solution**:
1. Check `requirements.txt` includes all dependencies
2. Verify Dockerfile syntax
3. Check Render logs for specific error
4. Try building locally: `docker build -t test-build .`

### Issue: Frontend can't connect to backend

**Cause**: CORS or environment variable issues

**Solution**:
1. Verify `FRONTEND_URL` is set correctly on both services
2. Check CORS middleware in backend allows your domain
3. Verify frontend has correct `NEXT_PUBLIC_API_URL`

---

## Performance Optimization

### Free Tier Considerations

Render free tier services **spin down after 15 minutes of inactivity**. First request after spin-down takes ~30-60 seconds.

**Solutions**:
1. Upgrade to paid tier ($7/month per service)
2. Use a cron job to ping services every 10 minutes
3. Implement a loading state in frontend for cold starts

### Production Recommendations

1. **Upgrade to Starter Plan**: $7/month per service
   - No spin down
   - Faster builds
   - More resources

2. **Use CDN**: Serve static assets via CDN

3. **Database Connection Pooling**: Already configured in auth server

4. **Monitoring**: Set up Render's built-in monitoring + external uptime monitor

---

## Security Checklist

- [x] Environment variables use `sync: false` (not in git)
- [x] EdDSA keys are secret and unique
- [x] `BETTER_AUTH_SECRET` is strong (32+ chars)
- [x] Database credentials are secure
- [x] CORS is configured correctly
- [x] Docker runs as non-root user
- [x] Health checks are configured
- [x] HTTPS is enforced (Render auto-provides)

---

## Files Modified

1. ✅ `hf-backend-deploy/Dockerfile` - Optimized for Render
2. ✅ `hf-backend-deploy/.dockerignore` - Exclude unnecessary files
3. ✅ `hf-backend-deploy/main.py` - Added JWKS fetch on startup
4. ✅ `render.yaml` - Added EdDSA keys, updated Python backend config
5. ✅ `auth-server/scripts/generate-eddsa-keys.js` - Key generation script

---

## Next Steps

1. ✅ Generate secrets: `node auth-server/scripts/generate-eddsa-keys.js`
2. ✅ Deploy to Render (via Blueprint or manual)
3. ✅ Configure environment variables on both services
4. ✅ Verify health checks pass
5. ✅ Update frontend environment variables
6. ✅ Test authentication flow end-to-end
7. ✅ Monitor logs for errors

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Better Auth**: https://better-auth.com
- **Render Discord**: https://discord.gg/render

---

**Last Updated**: 2025-12-27
**Author**: Claude (Anthropic)
**Status**: Ready for deployment ✅
