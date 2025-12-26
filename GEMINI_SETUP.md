# Gemini API Setup Guide

This project now uses **Google's Gemini API** with OpenAI-compatible format for personalized content generation and chat completions.

## Why Gemini?

Gemini provides:
- **Cost-effective** API calls compared to OpenAI
- **Fast response times** with `gemini-2.0-flash-exp`
- **OpenAI compatibility** - drop-in replacement using the same SDK
- **High-quality** content generation and adaptations

## Quick Setup

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Update Environment Variables

Update your `.env` file:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other required variables
QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key
AUTH_SERVER_URL=http://localhost:10000
BETTER_AUTH_SECRET=your_better_auth_secret
```

### 3. How It Works

The backend now uses Gemini API with OpenAI-compatible endpoint:

```python
# Configured in main.py
openai_client = AsyncOpenAI(
    api_key=settings.GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# Uses Gemini model for chat completions
model="gemini-2.0-flash-exp"
```

## Features Using Gemini

1. **Personalized Content** (`/api/chapters/{chapter_id}/content/personalized`)
   - Adapts content based on user's experience level
   - Uses AI to rewrite explanations for different skill levels
   - Adds relevant examples based on user profile

2. **RAG Chatbot** (`/chat`)
   - Answers questions using retrieval-augmented generation
   - Provides contextual responses from documentation

3. **Translation** (`/api/translate`)
   - Translates content to Urdu
   - Preserves formatting and technical terms

## Models Used

- **Chat/Personalization**: `gemini-2.0-flash-exp` (fast, cost-effective)
- **Embeddings**: `gemini-embedding-001` (Gemini's native embedding model via OpenAI-compatible API)

## Troubleshooting

### "Invalid or expired token" Error

This error typically occurs when:
1. **Missing API key**: Ensure `GEMINI_API_KEY` is set in `.env`
2. **Invalid API key**: Verify your key from Google AI Studio
3. **Backend not restarted**: Restart FastAPI after updating `.env`

```bash
# Restart the backend
cd path/to/project
uvicorn main:app --reload
```

### Check API Key is Loaded

Add logging to verify:

```python
# In main.py startup_event
logger.info(f"Gemini API Key present: {bool(settings.GEMINI_API_KEY)}")
logger.info(f"Gemini API Key first 10 chars: {settings.GEMINI_API_KEY[:10]}...")
```

### Test Personalization

```bash
curl -X POST "http://localhost:8000/api/chapters/test-chapter/personalize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"activate": true}'
```

## API Rate Limits

Gemini API has generous free tier limits:
- **Free tier**: 15 requests per minute (RPM)
- **Flash models**: Fast and cheap
- **Sufficient** for development and moderate production use

For production, consider:
- Implementing rate limiting
- Adding caching for frequently requested content
- Using Gemini Pro for higher quality when needed

## Migration from OpenAI

If you previously used OpenAI:

1. **Backup** your `.env` file
2. **Replace** `OPENAI_API_KEY` with `GEMINI_API_KEY`
3. **Update** any hardcoded model references to `gemini-2.0-flash-exp`
4. **Restart** backend services

The code automatically handles the API format conversion!

## Next Steps

- [ ] Test personalized content generation
- [ ] Verify chatbot responses
- [ ] Test translation functionality
- [ ] Monitor API usage in Google AI Studio

## Resources

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/openai)
- [Google AI Studio](https://aistudio.google.com/)
- [OpenAI Compatibility Guide](https://ai.google.dev/gemini-api/docs/openai)
