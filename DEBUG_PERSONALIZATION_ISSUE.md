# Debug Personalization Issue

## Problem
Personalized content is showing the same as original content (no AI adaptation happening)

## Checklist to Debug

### 1. ✅ Check Gemini API Key is Set
```bash
# In your .env file, line 3 should have your ACTUAL Gemini API key
grep GEMINI_API_KEY .env
```

Expected: `GEMINI_API_KEY=AIzaSy...` (starts with AIzaSy)
**NOT**: `GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE` ❌

### 2. ✅ Check Backend is Running with Gemini
Look for this log when backend starts:
```
✅ Initialized Gemini API client for chat completions and embeddings
```

If you see errors, the Gemini client didn't initialize.

### 3. ✅ Check Browser Console Logs

Open browser DevTools (F12) and look for these logs:

**When you click "Personalize" button:**
```javascript
✅ Personalization is active, fetching personalized content...
📦 Content result: {success: true, adaptedContent: "..."}
✅ Got personalized content, displaying purple banner
```

**If you see this instead:**
```javascript
❌ Personalization not active - success: true isActive: false
```
→ The personalization state wasn't activated properly

### 4. ✅ Check Network Tab

In browser DevTools → Network tab:

1. **Toggle Personalization Request:**
   - URL: `POST /api/chapters/{chapter_id}/personalize`
   - Body: `{"activate": true}`
   - Response should have: `{"success": true, "personalizationActive": true}`

2. **Get Personalized Content Request:**
   - URL: `GET /api/chapters/{chapter_id}/content/personalized`
   - Response should have: `{"content": "...HTML...", "adaptationsApplied": [...]}`

### 5. ✅ Check Backend Logs

Look for these logs in your backend terminal:

```
🔍 Fetching content for chapter: {chapter_id}
✅ Chapter content loaded: XXX chars
🎨 Adapting content for user profile: {complexity_level}
🤖 Requesting AI adaptation for {level} level user with Gemini API
✅ AI adaptation complete: XXX chars, adaptations: [...]
```

**If you see:**
```
⚠️ No OpenAI client, using basic adaptations
```
→ Gemini client is not initialized (check API key!)

**If you see:**
```
❌ AI adaptation failed: ...
```
→ Gemini API call failed (check API key validity, rate limits, etc.)

## Quick Fix Steps

### Step 1: Verify Gemini API Key

1. Open https://aistudio.google.com/app/apikey
2. Copy your API key (should start with `AIzaSy`)
3. Open `.env` file
4. Replace line 3:
   ```bash
   GEMINI_API_KEY=AIzaSyYourActualKeyHere
   ```

### Step 2: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Start again
uvicorn main:app --reload
```

### Step 3: Clear Browser Cache & Reload

```
Ctrl+Shift+R (hard reload)
```

### Step 4: Test Personalization

1. Log in to frontend
2. Go to any chapter
3. Open browser console (F12)
4. Click "Personalize" button
5. Watch the console logs

## Common Issues

### Issue 1: "GEMINI_API_KEY Field required"
**Cause:** API key not in `.env` file
**Fix:** Add `GEMINI_API_KEY=your_key` to `.env`

### Issue 2: Content shows but not personalized
**Cause:** Gemini API key is placeholder, not real key
**Fix:** Get real key from Google AI Studio

### Issue 3: "401 Unauthorized" errors
**Cause:** Invalid Gemini API key
**Fix:** Regenerate key at https://aistudio.google.com/app/apikey

### Issue 4: Same content returned
**Possible Causes:**
- Gemini API not being called (client not initialized)
- AI adaptation failing silently
- User profile is empty (no complexity level set)

**Debug:**
Check backend logs for:
```
🤖 Requesting AI adaptation for {level} level user with Gemini API
```

If missing, the AI adaptation is not happening.

## Test API Manually

Test if Gemini API is working:

```bash
curl "http://localhost:8000/api/chapters/test-chapter/content/personalized" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "content": "<p>...HTML content...</p>",
  "adaptationsApplied": ["simplified-explanations", "added-context"],
  "relevanceScore": 0.85
}
```

## Expected Behavior

**Before Personalization:**
- Shows original markdown content
- No purple banner
- No adaptations

**After Clicking "Personalize":**
- Purple banner appears: "✨ Personalized Content"
- Content is different (simplified or enhanced based on user level)
- Adaptations listed: "simplified-explanations", "added-context", etc.
- Relevance score shown

## Still Not Working?

Provide these details:
1. Output of `grep GEMINI_API_KEY .env` (first 20 chars only!)
2. Backend startup logs
3. Browser console logs when clicking "Personalize"
4. Network tab response for `/api/chapters/.../personalize` endpoint
