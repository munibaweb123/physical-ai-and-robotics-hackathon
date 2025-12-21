# Quickstart Guide: Chapter Content Personalization

## Overview
This guide provides instructions for setting up and working with the chapter content personalization feature. This feature allows logged-in users to personalize content in chapters by pressing a button at the start of each chapter, adapting the material to their experience level and preferences.

## Prerequisites
- Node.js 18+ (for auth server and frontend)
- Python 3.11+ (for backend)
- Docusaurus-compatible environment (Node.js 18+)
- SQLite (for auth database)
- Access to Qdrant Cloud (for vector storage)
- Existing user profile with background information

## Setup Instructions

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies for auth server
cd auth-server
npm install

# Install dependencies for backend
cd ../backend
pip install -r requirements.txt

# Install dependencies for frontend
cd ../physical-ai-docs
npm install
```

### 2. Database Configuration
```bash
# The auth server uses SQLite - no additional setup needed
# The database file is auth_v2.db in the auth-server directory
```

### 3. Environment Variables
Create `.env` files in each service directory:

**auth-server/.env**:
```env
DATABASE_URL=file:./auth_v2.db
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:7860
```

**backend/.env**:
```env
QDRANT_URL=your-qdrant-cloud-url
OPENAI_API_KEY=your-openai-api-key
AUTH_SERVER_URL=http://localhost:3001
```

**physical-ai-docs/.env**:
```env
AUTH_SERVER_URL=http://localhost:3001
BACKEND_API_URL=http://localhost:8000
```

## Running the Services

### 1. Start Auth Server
```bash
cd auth-server
npm run dev
# Auth server will run on http://localhost:3001
```

### 2. Start Backend
```bash
cd backend
uvicorn src.main:app --reload --port 8000
# Backend will run on http://localhost:8000
```

### 3. Start Frontend
```bash
cd physical-ai-docs
npm run start
# Frontend will run on http://localhost:3000
```

## Key Endpoints for Chapter Personalization Feature

### API Endpoints
- `POST /api/chapters/{chapterId}/personalize` - Activate/deactivate personalization for a chapter
- `GET /api/chapters/{chapterId}/personalize` - Get current personalization state for a chapter
- `PUT /api/user/personalization/preferences` - Update global personalization preferences
- `GET /api/user/personalization/preferences` - Get user's global personalization preferences
- `GET /api/chapters/{chapterId}/content/personalized` - Get personalized chapter content
- `GET /api/user/personalization/history` - Get personalization history and metrics

### Frontend Components
- Chapter pages with personalization toggle button
- User profile page with personalization preference controls
- Personalization settings modal/component

## Development Workflow

### 1. Personalization Engine Enhancement
Key files for the personalization logic:
- `backend/services/personalization_engine.py` - Core personalization algorithm
- `backend/src/main.py` - API endpoints for personalization
- `physical-ai-docs/src/components/PersonalizationToggle.jsx` - Frontend toggle component

### 2. Frontend Components
Key files for the chapter personalization feature:
- `physical-ai-docs/src/components/ChapterPersonalization.jsx` - Main personalization component
- `physical-ai-docs/src/pages/docs/DocsPage.jsx` - Modified documentation page to include personalization controls
- `physical-ai-docs/src/services/personalization-service.js` - Service for interacting with personalization API

### 3. Content Adaptation Logic
- `backend/services/content_adaptation.py` - Logic for adapting content based on user profile
- Implements difficulty adjustment, example substitution, and terminology modification

## Testing

### Unit Tests
```bash
# Auth server tests
cd auth-server
npm test

# Backend tests
cd backend
pytest

# Frontend tests
cd physical-ai-docs
npm test
```

### Integration Tests
```bash
# End-to-end tests for the personalization flow
# These should test the complete flow from toggling personalization to seeing adapted content
```

## Common Tasks

### Activating Personalization for a Chapter
1. Navigate to a chapter page
2. Click the personalization toggle button at the start of the chapter
3. The content should adapt based on the user's profile information

### Updating Personalization Preferences
1. Go to user profile page or personalization settings modal
2. Modify preferences like complexity level, preferred examples, or focus areas
3. Changes will be applied to new chapters and can be applied to current chapter

### Debugging Personalization Issues
1. Check that the user has profile information in the database
2. Verify that the personalization engine is receiving the correct user data
3. Check API responses for adaptation rules and scores
4. Review client-side content replacement logic

## Troubleshooting

### Personalization Button Not Appearing
- Ensure the user is logged in and authenticated
- Check that the chapter page includes the personalization component
- Verify the API endpoint is accessible

### Content Not Adapting
- Confirm that the user has sufficient profile information
- Check that the personalization engine is properly calculating relevance scores
- Verify that the content adaptation logic is working correctly

### API Errors
- Check that the auth server is running and accessible
- Verify that the backend is properly validating user sessions
- Ensure all required environment variables are set