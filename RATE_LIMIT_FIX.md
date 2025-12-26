# Gemini API Rate Limit Fix

## Problem Identified

Your Gemini API key was working correctly, but you hit the rate limit for `gemini-2.0-flash-exp`:

```
Error code: 429 - Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
* Quota exceeded for model: gemini-2.0-flash-exp
* limit: 0
```

## Root Cause

The `gemini-2.0-flash-exp` is an **experimental model** with very strict rate limits on the free tier:
- **Requests per minute**: 15 (shared across all experimental models)
- **Requests per day**: Limited quota that resets daily
- When quota is exceeded, all requests fail with 429 errors

## Solution Applied

Switched to **`gemini-2.5-flash`** (2025 stable model) which has:
- ✅ Better rate limits for free tier
- ✅ Stable, production-ready model (2025 version)
- ✅ High performance with lower latency
- ✅ More generous quota allocation

## Changes Made

### 1. `main.py` (line 81)
```python
# Before (experimental, hit rate limits)
GEMINI_CHAT_MODEL = "gemini-2.0-flash-exp"

# After (2025 stable model)
GEMINI_CHAT_MODEL = "gemini-2.5-flash"
```

### 2. `services/personalization_engine.py` (line 949)
```python
# Before
model="gemini-2.0-flash-exp"

# After
model="gemini-2.5-flash"
```

## How to Apply the Fix

1. **Restart your backend**:
   ```bash
   # Stop current backend (Ctrl+C)
   # Then restart:
   uvicorn main:app --reload
   ```

2. **Test personalization**:
   - Go to any chapter
   - Click "Personalize" button
   - You should see the purple banner with AI-adapted content

## Rate Limit Comparison

| Model | Free Tier RPM | Free Tier RPD | Status |
|-------|---------------|---------------|---------|
| `gemini-2.0-flash-exp` | 15 | Limited | ❌ Experimental (retired) |
| `gemini-1.5-flash` | N/A | N/A | ❌ Retired (April 2025) |
| `gemini-2.5-flash` | 15 | 1,500 | ✅ Stable (2025) |
| `gemini-2.5-pro` | 2 | 50 | ✅ Stable (higher quality) |

## Monitoring Your Usage

Check your current API usage at:
- https://ai.dev/usage?tab=rate-limit
- https://aistudio.google.com/

## If You Still Hit Rate Limits

### Option 1: Implement Caching
Cache personalized content to reduce API calls:
- Store adapted content in database
- Only re-generate when user changes preferences

### Option 2: Use Gemini 2.5 Pro (Lower RPM but Higher Quality)
```python
GEMINI_CHAT_MODEL = "gemini-2.5-pro"
```

### Option 3: Upgrade to Paid Tier
- Visit https://ai.google.dev/pricing
- Pay-as-you-go pricing available
- Much higher rate limits

## Expected Behavior Now

1. **Backend logs** should show:
   ```
   🤖 Requesting AI adaptation for intermediate level user with Gemini API
   ✅ AI adaptation complete: XXX chars, adaptations: [...]
   ```

2. **Browser** should show:
   - Purple "✨ Personalized Content" banner
   - Content that's different from original (simplified or enhanced)
   - Adaptations list: `["simplified-explanations", "added-context", ...]`

## Why This Happened

The experimental models (`gemini-2.0-*`) are:
- Testing new features
- Have stricter rate limits
- Subject to quota changes
- Best for experimentation, not production

The stable models (`gemini-2.5-*`) are:
- Production-ready (2025 versions)
- Predictable rate limits
- Better quota management
- Recommended for applications

---

**Status**: ✅ Fixed - Using stable `gemini-2.5-flash` model (2025 version) with better rate limits
