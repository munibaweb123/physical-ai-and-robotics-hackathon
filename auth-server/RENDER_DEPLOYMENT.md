# Deploy Auth Server to Render

Quick guide to deploy your Better Auth server to Render.

## 📋 Prerequisites

✅ Neon PostgreSQL database (you already have this!)
✅ GitHub repository
✅ Render account (free tier available)

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

Your auth server code needs to be on GitHub (it already is!).

### Step 2: Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub
3. Authorize Render to access your repos

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `physical-ai-and-robotics-hackathon`
3. **Configure Service:**

```
Name: physical-ai-auth
Region: Oregon (or closest to you)
Branch: 002-expand-course-content (or main)
Root Directory: auth-server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

4. **Select Plan:** Free

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment secrets:

```bash
# Database Configuration
DATABASE_PROVIDER = neon
NEON_DATABASE_URL = postgresql://neondb_owner:npg_iNRjY5zP9hDK@ep-winter-darkness-a4njqdir-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Session Secret (generate a random 32+ character string)
SESSION_COOKIE_SECRET = your-super-secret-key-minimum-32-characters-long

# Auth Server URL (will be provided after deployment)
BETTER_AUTH_URL = https://physical-ai-auth.onrender.com

# Frontend URL (your Vercel site)
FRONTEND_URL = https://your-site.vercel.app
```

**IMPORTANT:** Replace placeholders with:
- Your actual Vercel frontend URL
- A strong random secret for SESSION_COOKIE_SECRET

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies
   - Build your app
   - Deploy it

**Build time:** ~3-5 minutes

### Step 6: Get Your Auth Server URL

After deployment succeeds, you'll see your URL:
```
https://physical-ai-auth.onrender.com
```

Copy this URL!

## 🔄 Update Other Services

### 1. Update Vercel Frontend

Go to Vercel → Settings → Environment Variables:

**Update:**
```
DOCUSAURUS_BETTER_AUTH_URL = https://physical-ai-auth.onrender.com
```

**Redeploy Vercel** to apply changes.

### 2. Update Hugging Face Backend

Go to HF Space → Settings → Variables and secrets:

**Update:**
```
AUTH_SERVER_URL = https://physical-ai-auth.onrender.com
```

Space will auto-restart.

### 3. Update Render Auth Server

Go back to Render → Your Service → Environment:

**Update:**
```
BETTER_AUTH_URL = https://physical-ai-auth.onrender.com
```

Save and redeploy.

## ✅ Verify Deployment

### Test Health Endpoint

```bash
curl https://physical-ai-auth.onrender.com/api/db/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Test Auth Endpoints

Visit: `https://physical-ai-auth.onrender.com/api/auth/get-session`

Should return a 401 or session data (not an error).

## 🐛 Troubleshooting

### Build Fails

- Check **Logs** tab in Render
- Verify `auth-server` directory path is correct
- Ensure `package.json` has correct scripts

### Database Connection Errors

- Verify `NEON_DATABASE_URL` is correct
- Check Neon database is active
- Ensure SSL mode is set correctly

### CORS Errors

Check `src/index.ts` CORS configuration includes your domains:
```typescript
app.use('/*', cors({
  origin: [
    'http://localhost:3000',
    'https://your-site.vercel.app',
    'https://muniba123-physical-ai-book.hf.space'
  ],
  credentials: true
}))
```

## 📊 Monitor Your Service

### View Logs
- Render Dashboard → Your Service → Logs
- Real-time logs show requests and errors

### Restart Service
- Render Dashboard → Your Service → Manual Deploy
- Click "Clear build cache & deploy"

## 💡 Free Tier Limits

Render Free Tier:
- ✅ 750 hours/month (enough for always-on)
- ✅ Auto-sleep after 15 min inactivity
- ✅ Wakes up on request (~30 seconds)
- ✅ Custom domain support

## 🎯 Next Steps After Deployment

1. ✅ Test authentication on your frontend
2. ✅ Verify JWT token generation works
3. ✅ Check user registration/login flow
4. ✅ Monitor logs for errors

---

**Need help?** Check the logs or reach out!
