# Hugging Face Deployment Guide

Complete guide to deploy the Physical AI Backend to Hugging Face Spaces.

## 📋 Prerequisites

- [Hugging Face account](https://huggingface.co/join)
- Git installed
- Your environment variables ready:
  - `OPENAI_API_KEY`
  - `QDRANT_URL`
  - `QDRANT_API_KEY`
  - `AUTH_SERVER_URL`

## 🚀 Quick Deploy (Option 1: Using Deployment Script)

### Step 1: Run the Deployment Script

**On Windows:**
```bash
deploy-to-hf.bat
```

**On Mac/Linux:**
```bash
chmod +x deploy-to-hf.sh
./deploy-to-hf.sh
```

This will create a `hf-backend-deploy/` directory with only the necessary backend files.

### Step 2: Navigate to Deployment Directory

```bash
cd hf-backend-deploy
```

### Step 3: Initialize Git and Push to Hugging Face

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial backend deployment for Hugging Face"

# Add Hugging Face remote (replace YOUR_USERNAME and SPACE_NAME)
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME

# Push to Hugging Face
git push -u origin main
```

### Step 4: Add Environment Secrets

1. Go to your Hugging Face Space
2. Click **Settings** → **Variables and secrets**
3. Add the following secrets:

```
OPENAI_API_KEY = sk-your-openai-key
QDRANT_URL = https://your-cluster.qdrant.io
QDRANT_API_KEY = your-qdrant-api-key
AUTH_SERVER_URL = https://your-auth-server.com
```

### Step 5: Wait for Build

- Hugging Face will automatically build your Docker container
- Check the **Logs** tab to monitor progress
- Once complete, your API will be live!

## 🔧 Manual Deploy (Option 2: Direct Push from Main Repo)

If you prefer to push directly from your main repository:

### Step 1: Create Hugging Face Space

1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Name**: `physical-ai-backend`
   - **License**: MIT (or your choice)
   - **SDK**: **Docker**
   - **Visibility**: Public or Private

### Step 2: Add .hfignore (Already Created ✅)

The `.hfignore` file is already in your project root and will exclude:
- Frontend files (`physical-ai-docs/`)
- Node modules
- Auth server
- Python cache files

### Step 3: Push to Hugging Face

```bash
# From your main project directory
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/physical-ai-backend

# Push current branch
git push hf fix/002-expand-course-content:main
```

## 📁 What Gets Deployed

### ✅ Included Files:
```
README.md                          # HF Space metadata
Dockerfile                         # Container configuration
huggingface_app.py                # Application entry point
main.py                           # FastAPI app
requirements.txt                  # Python dependencies
auth_utils.py                     # Authentication utilities
services/                         # Service modules
  └── personalization_engine.py
.claude/agents/                   # AI agent prompts
  └── socratic_tutor.md
```

### ❌ Excluded Files:
```
physical-ai-docs/                 # Frontend (deploy to Vercel)
auth-server/                      # Auth server (deploy separately)
node_modules/                     # Node dependencies
.env                              # Local secrets (use HF Secrets)
__pycache__/                      # Python cache
```

## 🔍 Verify Deployment

### Test Health Endpoint
```bash
curl https://YOUR_USERNAME-SPACE_NAME.hf.space/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "All services are operational."
}
```

### Access API Documentation
Visit: `https://YOUR_USERNAME-SPACE_NAME.hf.space/docs`

## 🔗 Update Frontend Configuration

After deployment, update your frontend to use the new backend URL:

**In physical-ai-docs:**

```typescript
// Update API_BASE_URL to your HF Space URL
const API_BASE_URL = "https://YOUR_USERNAME-SPACE_NAME.hf.space";
```

**Update CORS in main.py:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app",
        "https://YOUR_USERNAME-SPACE_NAME.hf.space"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🐛 Troubleshooting

### Build Fails

1. Check **Logs** tab in your HF Space
2. Common issues:
   - Missing dependencies in `requirements.txt`
   - Port configuration (must be 8000)
   - Missing environment variables

### Services Unavailable

1. Ensure all secrets are added in HF Space settings
2. Check if Qdrant and OpenAI services are accessible
3. Review logs for connection errors

### Startup Errors

The `huggingface_app.py` is configured to start even if external services fail:
- Check logs for specific service errors
- Verify your API keys are correct
- Ensure URLs are properly formatted

## 📊 Monitoring

### View Logs
- Go to your HF Space → **Logs** tab
- Real-time logs show startup and runtime information

### Restart Space
- Settings → **Factory reboot**
- Use when you need to reload environment variables

## 🎯 Next Steps

1. ✅ Deploy backend to Hugging Face
2. Deploy frontend to Vercel
3. Deploy auth-server (Node.js) to Render/Railway/Vercel
4. Update all CORS and API URLs
5. Test end-to-end integration

## 📚 Resources

- [Hugging Face Spaces Documentation](https://huggingface.co/docs/hub/spaces)
- [Docker SDK Guide](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [Managing Secrets](https://huggingface.co/docs/hub/spaces-overview#managing-secrets)

## 💡 Tips

- **Free Tier**: HF Spaces offers a generous free tier
- **Custom Domains**: Available on paid plans
- **Persistent Storage**: Use HF Datasets for file storage
- **GPU Access**: Available if needed (paid)
- **Monitoring**: Enable for production deployments

---

Need help? Check the logs or reach out to the team!
