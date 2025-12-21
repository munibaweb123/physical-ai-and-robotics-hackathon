# Auth Server with Neon PostgreSQL

## Overview
This authentication server has been migrated from SQLite to Neon PostgreSQL for improved scalability, performance, and concurrent user support. The migration maintains all existing functionality while providing better database performance.

## Features
- User authentication (registration, login, sessions)
- User profile management
- User background information collection for personalization
- Chapter personalization settings
- Neon PostgreSQL database with connection pooling
- Database migration tools and monitoring

## Setup

### Prerequisites
- Node.js 18+
- Neon PostgreSQL account and database instance

### Installation
```bash
npm install
```

### Environment Configuration
Create a `.env` file with the following variables:
```bash
SESSION_COOKIE_SECRET="your-super-secret-key"
NEON_DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname
SQLITE_DATABASE_URL=file:./auth_v2.db
DATABASE_PROVIDER=neon
```

### Running the Server
```bash
npm run dev
```

## Database Migration

### Migrating from SQLite to Neon PostgreSQL
1. Set up your Neon PostgreSQL database instance
2. Update environment variables with your Neon connection string
3. Run the migration script: `npm run migrate:neon`
4. Verify migration status: `curl http://localhost:7860/api/db/migration/status`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `GET /api/auth/user/background` - Get user background info
- `POST /api/auth/user/background` - Update user background info

### Chapter Personalization
- `POST /api/auth/chapters/:chapterId/personalize` - Activate/deactivate personalization
- `GET /api/auth/chapters/:chapterId/personalize` - Get personalization state

### Database Migration
- `POST /api/db/migration/start` - Start database migration
- `GET /api/db/migration/status` - Get migration status
- `GET /api/db/health` - Check database health

## Testing

### Running Tests
```bash
npm test
```

### Migration Tests
```bash
npm run test:migration
```

### Authentication Tests
```bash
npm run test:auth
```

### Data Verification
```bash
npm run verify-data
```

## Environment Variables
- `SESSION_COOKIE_SECRET` - Secret for signing session cookies
- `NEON_DATABASE_URL` - Connection string for Neon PostgreSQL
- `SQLITE_DATABASE_URL` - Connection string for SQLite (migration source)
- `DATABASE_PROVIDER` - Database provider ('neon' or 'sqlite')
- `BETTER_AUTH_URL` - Base URL for the auth server
- `FRONTEND_URL` - URL of the frontend application