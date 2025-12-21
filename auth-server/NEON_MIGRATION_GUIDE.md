# Neon PostgreSQL Migration Guide

## Overview
This guide provides instructions for managing the Neon PostgreSQL database migration in the authentication server. The system has been migrated from SQLite to Neon PostgreSQL for improved scalability, performance, and concurrent user support.

## Environment Configuration

### Required Environment Variables
```bash
# Database connections
NEON_DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname
SQLITE_DATABASE_URL=file:./auth_v2.db  # Temporary, for migration
DATABASE_PROVIDER=neon  # Switch from 'sqlite' after migration

# Session configuration
SESSION_COOKIE_SECRET="your-super-secret-key"
```

### Switching Database Providers
1. Update DATABASE_PROVIDER in environment variables
2. Restart the auth-server application
3. Verify database connection with health check endpoint

## Migration Process

### 1. Running the Migration
```bash
# Run the migration script
npm run migrate:neon
```

### 2. Checking Migration Status
```bash
# Check migration status
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
     http://localhost:7860/api/db/migration/status
```

### 3. Database Health Check
```bash
# Verify database connection health
curl http://localhost:7860/api/db/health
```

## API Endpoints

### Migration Management
- `POST /api/db/migration/start` - Initiate database migration
- `GET /api/db/migration/status` - Check migration progress
- `GET /api/db/health` - Verify database connection health

### Existing Authentication Endpoints (Unchanged)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user/profile` - Get user profile
- `GET/PUT /api/auth/user/background` - Manage user background information

## Connection Pooling Configuration

The system uses optimized connection pooling for Neon PostgreSQL:

```typescript
{
  min: 1,           // Minimum number of connections
  max: 20,          // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000 // Timeout for creating new connections
}
```

## Performance Optimization

- Connection pooling is configured for optimal performance with Neon
- Database queries use Kysely for efficient SQL generation
- All authentication workflows maintain the same performance characteristics

## Testing

### Running Migration Tests
```bash
npm run test:migration
```

### Running Authentication Tests
```bash
npm run test:auth
```

### Verifying Data Integrity
```bash
npm run verify-data
```

## Rollback Plan

If migration issues occur:
1. Switch DATABASE_PROVIDER back to 'sqlite' in environment
2. Restart auth-server to use SQLite again
3. Investigate and fix migration script issues
4. Retry migration during low-traffic period

## Troubleshooting

### Common Issues
1. Verify Neon database connectivity
2. Check for data type compatibility issues
3. Ensure all required extensions are enabled in Neon
4. Validate foreign key relationships after migration

### Monitoring Database Performance
1. Check connection pool metrics
2. Monitor query performance after migration
3. Review application logs for database-related errors