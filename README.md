---
title: Physical AI Book Backend
emoji: 🤖
colorFrom: blue
colorTo: red
sdk: docker
app_port: 8000
pinned: false
license: mit
---

# Physical AI Book Backend

This is a RAG (Retrieval-Augmented Generation) chatbot backend for a digital book reader with personalization features. The backend is built with FastAPI and includes:

- **RAG Chatbot**: Book content ingestion and semantic search using Qdrant vector database
- **Dual Chat Modes**: Standard Q&A and Socratic tutoring mode for guided learning
- **Translation Service**: Multi-language support with Urdu translation using GPT
- **Better Auth Integration**: Secure JWT-based authentication with JWKS verification
- **Personalization Engine**: Adaptive content based on user background and preferences
- **Chapter Personalization**: Dynamic content adaptation per chapter
- **GDPR Compliance**: User data export and deletion endpoints

## Environment Variables

The application requires the following environment variables to be set:

- `OPENAI_API_KEY`: Your OpenAI API key
- `QDRANT_URL`: Your Qdrant Cloud URL
- `QDRANT_API_KEY`: Your Qdrant API key
- `AUTH_SERVER_URL`: URL of the Node.js auth server (defaults to http://localhost:7860)

## API Endpoints

- `/health` - Health check endpoint
- `/ingest` - Ingest book content into the vector database
- `/chat` - Chat with the RAG system
- `/api/content/personalized` - Get personalized content
- Various personalization and user preference endpoints

## 🚀 Deployment to Hugging Face

### Quick Deploy

1. **Create a new Space** on [Hugging Face](https://huggingface.co/spaces)
   - Choose **Docker** as SDK
   - Set visibility (Public/Private)

2. **Add Secrets** in Space Settings → Variables and secrets:
   ```bash
   OPENAI_API_KEY=sk-...
   QDRANT_URL=https://your-cluster.qdrant.io
   QDRANT_API_KEY=your-qdrant-key
   AUTH_SERVER_URL=https://your-auth-server.com
   ```

3. **Deploy via Git**:
   ```bash
   git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME
   git push hf main:main
   ```

4. **Access your API** at: `https://YOUR_USERNAME-SPACE_NAME.hf.space`

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Copy .env.example to .env and add your keys
cp .env.example .env

# Run locally
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation

Once deployed, visit `/docs` for interactive Swagger UI documentation.