# Debug Personalized Content Not Showing

## Expected Flow

When you toggle personalization ON, you should see these console logs:

### 1. Toggle Activation (You're seeing this ✓)
```
✓ Using EdDSA token for personalization request
Calling URL: http://localhost:8000/api/chapters/foundations/era-of-physical-ai/personalize
Response status: 200
Parsed response data: {success: true, chapterId: "...", personalizationActive: true, ...}
```

### 2. Fetch Personalization State (Check if you see this)
```
✓ Using EdDSA token for personalization request
Calling URL: http://localhost:8000/api/chapters/foundations/era-of-physical-ai/personalize
Response status: 200
```

### 3. Fetch Personalized Content (MISSING - Check if you see this)
```
✓ Using EdDSA token for personalization request
Calling URL: http://localhost:8000/api/chapters/foundations/era-of-physical-ai/content/personalized
Response status: 200
Response: {
  chapterId: "...",
  title: "...",
  content: "...",  <-- This is the adapted HTML content
  adaptationsApplied: [...],
  relevanceScore: 0.95
}
```

## What to Check

### 1. Is auth server running?
```bash
curl http://localhost:10000/api/auth/jwks
```

Expected output:
```json
{
  "keys": [
    {
      "kty": "OKP",
      "crv": "Ed25519",
      "x": "...",
      "alg": "EdDSA",
      "kid": "better-auth-eddsa-key"
    }
  ]
}
```

### 2. Check browser console for errors

Look for:
- ❌ "Could not fetch personalized content: ..."
- ❌ "No EdDSA token available for personalized content"
- ❌ Any 401 or 500 errors

### 3. Check Python backend logs

When you load the page with personalization ON, you should see:

```
🎫 Received JWT token (first 50 chars): eyJhbGci...
🔍 Starting token decode and verification...
🔐 Starting EdDSA token verification...
✓ Signature verified successfully!
GET /api/chapters/foundations/era-of-physical-ai/personalize - 200
GET /api/chapters/foundations/era-of-physical-ai/content/personalized - 200
```

If you see:
```
GET /api/chapters/foundations/era-of-physical-ai/content/personalized - 401
```

This means the EdDSA token verification is failing for the content endpoint.

### 4. Test the endpoints directly

**Test personalization state:**
```bash
# First, get your EdDSA token from browser console:
# Open DevTools → Network tab → Find a successful request → Copy the Authorization header

curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8000/api/chapters/foundations/era-of-physical-ai/personalize
```

Expected:
```json
{
  "success": true,
  "userId": "...",
  "chapterId": "foundations/era-of-physical-ai",
  "personalizationActive": true,
  "adaptationsApplied": [],
  "lastViewedAt": "..."
}
```

**Test personalized content:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8000/api/chapters/foundations/era-of-physical-ai/content/personalized
```

Expected:
```json
{
  "chapterId": "foundations/era-of-physical-ai",
  "title": "Chapter foundations/era-of-physical-ai - Personalized Content",
  "content": "Personalized content for chapter...",
  "adaptationsApplied": [...],
  "relevanceScore": 0.85,
  "metadata": {...}
}
```

## Common Issues

### Issue 1: Auth server not running
**Symptom**: `ERR_CONNECTION_REFUSED on port 10000`
**Fix**:
```bash
cd auth-server
npm run dev
```

### Issue 2: No background info provided
**Symptom**: Error saying "You haven't provided background information"
**Fix**: Go to `/profile` and add your background info

### Issue 3: EdDSA token not being fetched
**Symptom**: Console log "No EdDSA token available for personalized content"
**Fix**:
1. Make sure you're logged in
2. Check auth server is running
3. Try logging out and back in

### Issue 4: Backend returns 500
**Symptom**: `Response status: 500`
**Fix**: Check Python backend logs for the actual error

### Issue 5: Content endpoint not called at all
**Symptom**: No logs showing content/personalized request
**Fix**: This means the component is not reaching the content fetch step. Check:
1. Is personalization state returning `isActive: true`?
2. Are there any JavaScript errors in console?
3. Is the component mounted correctly?

## What the Purple Banner Should Look Like

When everything works, you'll see:

```
┌─────────────────────────────────────────────────────────┐
│ ✨ Personalized Content                                 │
│                                                         │
│ This content has been adapted to match your             │
│ experience level and preferences                        │
│                                                         │
│ Adaptations applied:                                    │
│ • complexity-adjusted  • examples-customized            │
│                                                         │
│ Relevance Score: 85%                                    │
└─────────────────────────────────────────────────────────┘

[Personalized content appears here instead of original content]
```

## Next Steps

1. Open browser console (F12)
2. Navigate to a doc page with personalization toggle
3. Toggle personalization ON
4. Copy ALL console logs and send them to me
5. Also send Python backend terminal logs

This will help me identify exactly where the flow is breaking!
