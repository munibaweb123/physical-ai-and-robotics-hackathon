# Deploy Auth Server to Fix Production Errors

## 🔴 Current Problem

Your Vercel deployment shows these errors:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:10000/api/auth/get-session
```

**Why?** The frontend is trying to connect to `localhost:10000`, which only works on your local machine, not in production.

## ✅ Solution: Deploy Auth Server

Your auth server (`auth-server/`) needs to be deployed separately from the docs site.

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Create vercel.json for Auth Server

Create `auth-server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### Step 2: Deploy Auth Server

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Deploy auth server
cd auth-server
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: physical-ai-auth-server
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**You'll get a URL like**: `https://physical-ai-auth-server.vercel.app`

#### Step 3: Set Environment Variables in Auth Server Vercel Project

In your auth server Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add these variables:
   ```
   BETTER_AUTH_SECRET=super-secret-key-please-change-me-in-production
   BETTER_AUTH_URL=https://physical-ai-auth-server.vercel.app
   DATABASE_URL=<your-neon-database-url>
   ```

#### Step 4: Set Environment Variable in Docs Vercel Project

In your **docs site** Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   ```
   DOCUSAURUS_BETTER_AUTH_URL=https://physical-ai-auth-server.vercel.app
   ```

#### Step 5: Redeploy Both Projects

```bash
# Redeploy auth server
cd auth-server
vercel --prod

# Redeploy docs (or trigger from Vercel dashboard)
cd ../physical-ai-docs
# Push to git, Vercel will auto-deploy
```

### Option 2: Deploy to Railway

#### Step 1: Create railway.json

Create `auth-server/railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### Step 2: Deploy to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub repo
3. Select `auth-server` directory
4. Add environment variables:
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (will be your Railway domain)
   - `DATABASE_URL`
5. Deploy

**You'll get a URL like**: `https://physical-ai-auth-server.up.railway.app`

#### Step 3: Update Docs Environment Variable

In Vercel (docs project):
```
DOCUSAURUS_BETTER_AUTH_URL=https://physical-ai-auth-server.up.railway.app
```

### Option 3: Deploy to Render

See `auth-server/RENDER_DEPLOYMENT.md` for detailed Render instructions.

## 🔧 Quick Fix: Disable Auth Features Temporarily

If you want to deploy the docs without auth features working:

### Update docusaurus.config.ts

```typescript
customFields: {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.vercel.app',
  authBaseUrl: process.env.DOCUSAURUS_BETTER_AUTH_URL || null, // Disable auth
},
```

### Make Auth Components Handle No Auth Server

But this will break personalization, chatbot login, and other features.

## 📋 Complete Deployment Checklist

- [ ] Deploy auth server to Vercel/Railway/Render
- [ ] Set `BETTER_AUTH_SECRET` in auth server environment
- [ ] Set `BETTER_AUTH_URL` in auth server environment (deployed URL)
- [ ] Set `DATABASE_URL` in auth server environment (Neon DB URL)
- [ ] Set `DOCUSAURUS_BETTER_AUTH_URL` in docs environment (auth server URL)
- [ ] Redeploy both projects
- [ ] Test login on production docs site
- [ ] Verify no `localhost:10000` errors in console

## 🎯 Expected Result

After deployment:
- ✅ No `ERR_CONNECTION_REFUSED` errors
- ✅ Login works on production site
- ✅ Personalization features work
- ✅ Chatbot authentication works

## 🔗 Architecture

```
User's Browser
     ↓
Vercel (Docs Site) → https://your-app.vercel.app
     ↓
Vercel/Railway (Auth Server) → https://auth-server.vercel.app
     ↓
Neon Database (PostgreSQL)
```

## 💡 Pro Tip

Use different auth servers for:
- **Development**: `localhost:10000`
- **Staging**: `https://auth-staging.vercel.app`
- **Production**: `https://auth.vercel.app`

Set environment variables accordingly in each Vercel environment.

---

**TL;DR**: Deploy `auth-server/` to Vercel, get the URL, set `DOCUSAURUS_BETTER_AUTH_URL` in your docs Vercel environment, redeploy docs.
