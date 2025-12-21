# Quickstart Guide: Neon Database Migration

## Overview
This guide provides instructions for migrating the authentication database from SQLite to Neon PostgreSQL. This migration will improve scalability, performance, and concurrent user support for the application.

## Prerequisites
- Neon PostgreSQL account and database instance
- Access to current SQLite database file (auth_v2.db)
- Node.js 18+ (for auth server)
- Python 3.11+ (for backend)
- Environment variables for both SQLite (current) and Neon (target) connections
- Backup of current database

## Setup Instructions

### 1. Environment Configuration
```bash
# In auth-server/.env
NEON_DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname
SQLITE_DATABASE_URL=file:./auth_v2.db  # Temporary, for migration
DATABASE_PROVIDER=neon  # Switch from 'sqlite' after migration
```

### 2. Install Required Dependencies
```bash
# In auth-server directory
npm install @neondatabase/serverless  # Neon serverless driver
npm install kysely-codegen  # For generating TypeScript types
```

### 3. Database Schema Setup
```bash
# Generate database schema for PostgreSQL
npx kysely-codegen --dialect postgres --url $NEON_DATABASE_URL --out-file src/schema.ts
```

## Migration Process

### 1. Prepare Migration Script
Create a migration script that will:
- Connect to both SQLite (source) and Neon PostgreSQL (target) databases
- Transfer all user data, sessions, and profile information
- Validate data integrity after migration
- Update application configuration to use Neon

### 2. Execute Migration
```bash
# Run the migration script
npm run migrate:neon
```

### 3. Verify Migration
```bash
# Check migration status
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     http://localhost:3001/api/db/migration/status
```

## Key Endpoints for Database Migration

### Migration Management
- `POST /api/db/migration/start` - Initiate database migration
- `GET /api/db/migration/status` - Check migration progress
- `GET /api/db/health` - Verify database connection health

### Existing Authentication Endpoints (Unchanged)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user/profile` - Get user profile
- `GET/PUT /api/auth/user/background` - Manage user background information

## Development Workflow

### 1. Database Configuration
Key files for the database migration:
- `auth-server/src/db.ts` - Database connection and Kysely configuration
- `auth-server/src/auth.ts` - Better Auth configuration with Neon adapter
- `auth-server/migrations/` - Database migration scripts

### 2. Testing the Migration
```bash
# 1. Run migration tests
npm run test:migration

# 2. Verify data integrity
npm run verify-data

# 3. Test authentication workflows
npm run test:auth
```

### 3. Connection Pooling Configuration
- Neon supports connection pooling through its serverless architecture
- Configure max connections based on expected load
- Monitor connection usage during peak times

## Rollback Plan
If migration issues occur:
1. Switch DATABASE_PROVIDER back to 'sqlite' in environment
2. Restart auth-server to use SQLite again
3. Investigate and fix migration script issues
4. Retry migration during low-traffic period

## Common Tasks

### Switching Database Providers
1. Update DATABASE_PROVIDER in environment variables
2. Restart the auth-server application
3. Verify database connection with health check endpoint

### Monitoring Database Performance
1. Check connection pool metrics
2. Monitor query performance after migration
3. Review application logs for database-related errors

### Troubleshooting Migration Issues
1. Verify Neon database connectivity
2. Check for data type compatibility issues
3. Ensure all required extensions are enabled in Neon
4. Validate foreign key relationships after migration

## Post-Migration Optimization
- Set up proper connection pooling
- Configure database connection limits
- Set up monitoring and alerting
- Update backup procedures to work with Neon
- Optimize queries for PostgreSQL performance