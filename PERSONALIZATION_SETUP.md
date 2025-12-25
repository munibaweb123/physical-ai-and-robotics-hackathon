# Personalization Button - Now Functional!

## ✅ What Was Fixed

The "Personalize this content" button is now fully functional and uses **EdDSA JWT tokens** for authentication with the backend.

### Changes Made:

1. **Created Token Utility** (`src/lib/token-utils.ts`)
   - Centralized EdDSA token management
   - Automatic token caching (6 days)
   - Token refresh handling

2. **Updated Personalization Service** (`src/services/personalization-service.ts`)
   - All functions now use EdDSA tokens
   - Removed dependency on non-existent session tokens
   - Functions updated:
     - `toggleChapterPersonalization`
     - `getChapterPersonalizationState`
     - `getPersonalizedChapterContent`
     - `updateUserPreferences`
     - `getUserPreferences`
     - `getPersonalizationHistory`

3. **Updated PersonalizationToggle Component** (`src/components/PersonalizationToggle.tsx`)
   - Uses EdDSA token fetching
   - Better error handling
   - Redirects to login if token unavailable

## 🎯 How It Works

```
┌──────────────────┐
│  User Logs In    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ EdDSA Token      │
│ Auto-Fetched &   │
│ Cached (6 days)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User Clicks      │
│ "Personalize"    │
│ Toggle Button    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check Background │
│ Info Exists      │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Yes        No
    │         │
    │         └─> Redirect to /profile
    │
    ▼
┌──────────────────┐
│ POST to Auth     │
│ Server with      │
│ EdDSA Token      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Personalization  │
│ Activated/       │
│ Deactivated      │
└──────────────────┘
```

## 🚀 Testing the Personalization Button

### Step 1: Login to the Application

```bash
# Make sure auth server is running
cd auth-server
npm run dev
```

```bash
# Make sure frontend is running
cd physical-ai-docs
npm start
```

Navigate to: `http://localhost:3000/login`

### Step 2: Add Background Information

1. Go to your profile: `http://localhost:3000/profile`
2. Fill in:
   - Software Experience Level
   - Hardware Experience Level
   - Technical Skills
   - Hardware Specs (optional)
3. Click "Save Background Information"

### Step 3: Navigate to Any Documentation Page

Example: `http://localhost:3000/docs/intro`

### Step 4: Test the Personalization Toggle

You should see a box at the top of the page:

```
┌─────────────────────────────────────┐
│ Personalize this content  [OFF]     │
│                                     │
│ ○ Content displayed in default mode │
└─────────────────────────────────────┘
```

**Click the toggle button:**

```
┌─────────────────────────────────────┐
│ Personalize this content  [ON]      │
│                                     │
│ ✓ Content is personalized based on  │
│   your profile                      │
│                                     │
│ Based on your profile, content is   │
│ adapted to match your experience    │
│ level and preferences.              │
└─────────────────────────────────────┘
```

### Step 5: Verify Backend Receives Request

Check your **Python backend console** for logs:

```
🎫 Received JWT token (first 50 chars): eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImJl...
🔍 Starting token decode and verification...
🔐 Starting EdDSA token verification...
✓ Signature verified successfully!
✓ Successfully verified EdDSA token for user: xxx, email: test@example.com
```

## 📋 API Endpoints Used

### Toggle Personalization
**POST** `/api/chapters/{chapterId}/personalize`

**Headers:**
```
Authorization: Bearer <eddsa-token>
Content-Type: application/json
```

**Body:**
```json
{
  "activate": true,
  "preferences": {
    "complexityLevel": "intermediate",
    "focusAreas": ["ros2", "physical-ai"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "chapterId": "intro",
  "personalizationActive": true,
  "adaptationsApplied": ["complexity-adjusted", "examples-customized"],
  "message": "Personalization activated for chapter intro"
}
```

### Get Personalization State
**GET** `/api/chapters/{chapterId}/personalize`

**Headers:**
```
Authorization: Bearer <eddsa-token>
```

**Response:**
```json
{
  "success": true,
  "userId": "user-123",
  "chapterId": "intro",
  "personalizationActive": true,
  "adaptationsApplied": ["complexity-adjusted"],
  "lastViewedAt": "2025-12-26T10:30:00Z"
}
```

## 🔧 Troubleshooting

### "Authentication required - please log in"

**Cause:** No EdDSA token available

**Solution:**
1. Make sure you're logged in
2. Check auth server is running on port 10000
3. Check browser console for token fetch errors

### "You haven't provided background information yet"

**Cause:** No user profile data

**Solution:**
1. Go to `/profile`
2. Fill in at least one field
3. Click "Save Background Information"

### Button doesn't respond

**Cause:** Frontend not fetching EdDSA token

**Solution:**
1. Open browser console (F12)
2. Look for errors
3. Check network tab for failed requests to `/api/auth/token/eddsa`

### Python backend returns 401

**Cause:** EdDSA token verification failing

**Solution:**
1. Check Python backend logs for detailed error
2. Verify JWKS endpoint is accessible: `curl http://localhost:10000/api/auth/jwks`
3. Restart both auth server and Python backend

## 📚 Related Files

- **Token Management:** `src/lib/token-utils.ts`
- **Personalization Service:** `src/services/personalization-service.ts`
- **Toggle Component:** `src/components/PersonalizationToggle.tsx`
- **Backend Auth:** `auth/core.py`, `auth/jwks.py`
- **Auth Server:** `auth-server/src/index.ts`

## 🎉 Success Indicators

When everything is working correctly:

✅ Button toggles between ON/OFF smoothly
✅ Status message changes accordingly
✅ Backend logs show EdDSA token verification
✅ Content personalization state is saved
✅ Page reload maintains personalization state

## Next Steps

1. ✅ Personalization button functional
2. 🔲 Implement actual content adaptation based on user profile
3. 🔲 Add personalization analytics
4. 🔲 Create personalization settings page
5. 🔲 Add A/B testing for personalization effectiveness
