# Quickstart Guide: Signup Background Questions

## Overview
This guide provides instructions for setting up and working with the background questions feature for user signup. This feature collects user's software and hardware experience during signup to enable personalized content delivery.

## Prerequisites
- Node.js 18+ (for auth server)
- Python 3.11+ (for backend)
- Docusaurus-compatible environment (Node.js 18+)
- SQLite (for auth database)
- Access to Qdrant Cloud (for vector storage)

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
BETTER_AUTH_URL=http://localhost:3001
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

## Key Endpoints for Background Questions Feature

### API Endpoints
- `POST /api/user/background` - Update user's background information
- `GET /api/user/background` - Get user's background information
- `GET /api/content/personalized` - Get personalized content based on background
- Enhanced `POST /api/auth/register` - Registration with optional background info

### Frontend Pages
- `/register` - Registration page with background questions
- `/profile` - Profile page where users can update background info

## Development Workflow

### 1. Database Schema Changes
When extending the Better Auth user schema:
1. Update the database adapter in `auth-server/src/database.ts`
2. Update the auth configuration in `auth-server/src/auth.ts`
3. Test the changes with the existing auth flow

### 2. Frontend Components
Key files for the background questions feature:
- `physical-ai-docs/src/pages/register.tsx` - Registration page with background questions
- `physical-ai-docs/src/components/BackgroundQuestionForm.tsx` - Form component for background questions
- `physical-ai-docs/src/services/auth-service.ts` - Updated auth service with background info methods

### 3. Backend Services
Key files for personalization:
- `backend/src/services/personalization.py` - Personalization engine
- `backend/src/api/background.py` - Background information API endpoints
- `backend/src/models/user_profile.py` - User profile model with background data

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
# End-to-end tests for the background questions flow
# These should test the complete flow from signup to personalized content
```

## Common Tasks

### Adding New Background Question Types
1. Update the database schema to include new fields
2. Update the API contracts to include new fields
3. Update the frontend form to collect the new information
4. Update the personalization engine to use the new information

### Updating Personalization Algorithm
1. Modify the personalization engine in the backend
2. Update the API response format if needed
3. Test with different user profiles to ensure proper content delivery

## Troubleshooting

### Auth Issues
- Ensure all services are using the same Better Auth configuration
- Check that the auth server is running and accessible from other services
- Verify that cookies are properly configured for cross-origin requests

### Database Issues
- If extending the Better Auth schema, ensure the adapter properly handles the new fields
- Check that the SQLite database has the correct permissions
- Verify that migrations are properly handled

### Personalization Issues
- Verify that user background information is being stored correctly
- Check that the personalization algorithm is receiving the correct data
- Test with different user profiles to ensure appropriate content delivery