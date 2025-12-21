# Tasks: Neon DB Migration

## Pre-flight Checklist
- [x] Verify current database schema in SQLite (auth-server/src/db.ts)
- [x] Confirm Neon PostgreSQL account and database instance availability
- [x] Create backup of current SQLite database (auth_v2.db)
- [x] Review existing Better Auth configuration for migration compatibility

## Story: Migrate Database Provider (P1 - Critical)
- [x] TASK-001 [P1] [STORY-001] Set up Neon PostgreSQL database instance and obtain connection URL
- [x] TASK-002 [P1] [STORY-001] Install required dependencies (@neondatabase/serverless, kysely-codegen) in auth-server
- [x] TASK-003 [P1] [STORY-001] Update environment configuration to support both SQLite and Neon connections
- [x] TASK-004 [P1] [STORY-001] Modify auth-server/src/db.ts to support PostgreSQL dialect with Kysely
- [x] TASK-005 [P1] [STORY-001] Update Better Auth configuration in auth-server/src/auth.ts to use PostgreSQL adapter
- [x] TASK-006 [P1] [STORY-001] Create database schema for PostgreSQL using kysely-codegen
- [x] TASK-007 [P1] [STORY-001] Configure connection pooling for Neon PostgreSQL in auth-server

## Story: Data Migration Implementation (P1 - Critical)
- [x] TASK-008 [P1] [STORY-002] Create migration script to connect to both SQLite (source) and Neon PostgreSQL (target)
- [x] TASK-009 [P1] [STORY-002] Implement data transfer for users table from SQLite to PostgreSQL
- [x] TASK-010 [P1] [STORY-002] Implement data transfer for user_background table from SQLite to PostgreSQL
- [x] TASK-011 [P1] [STORY-002] Implement data transfer for sessions table from SQLite to PostgreSQL
- [x] TASK-012 [P1] [STORY-002] Implement data transfer for accounts table from SQLite to PostgreSQL
- [x] TASK-013 [P1] [STORY-002] Add data integrity validation after migration in migration script
- [x] TASK-014 [P1] [STORY-002] Handle UUID generation for primary keys during migration
- [x] TASK-015 [P1] [STORY-002] Convert SQLite-specific data types to PostgreSQL equivalents (jsonb, timestamps)

## Story: Migration API Endpoints (P1 - Critical)
- [x] TASK-016 [P1] [STORY-003] Implement POST /api/db/migration/start endpoint to initiate migration
- [x] TASK-017 [P1] [STORY-003] Implement GET /api/db/migration/status endpoint to check migration progress
- [x] TASK-018 [P1] [STORY-003] Implement GET /api/db/health endpoint to verify database connection health
- [x] TASK-019 [P1] [STORY-003] Add authentication and authorization to migration endpoints using admin tokens
- [x] TASK-020 [P1] [STORY-003] Add request validation and error handling for migration API endpoints
- [x] TASK-021 [P1] [STORY-003] Implement migration status tracking with progress percentage

## Story: Application Configuration Update (P2 - Important)
- [x] TASK-022 [P2] [STORY-004] Update DATABASE_PROVIDER environment variable to switch from 'sqlite' to 'neon'
- [x] TASK-023 [P2] [STORY-004] Update application startup to initialize with Neon PostgreSQL connection
- [x] TASK-024 [P2] [STORY-004] Test application startup with new database configuration
- [x] TASK-025 [P2] [STORY-004] Update README with new environment configuration requirements

## Story: Authentication Workflow Testing (P2 - Important)
- [x] TASK-026 [P2] [STORY-005] Test user registration workflow with Neon PostgreSQL backend
- [x] TASK-027 [P2] [STORY-005] Test user login workflow with Neon PostgreSQL backend
- [x] TASK-028 [P2] [STORY-005] Test user profile retrieval with Neon PostgreSQL backend
- [x] TASK-029 [P2] [STORY-005] Test user background information management with Neon PostgreSQL backend
- [x] TASK-030 [P2] [STORY-005] Verify session management works correctly with Neon PostgreSQL

## Story: Data Integrity and Validation (P2 - Important)
- [x] TASK-031 [P2] [STORY-006] Implement data validation checks after migration completion
- [x] TASK-032 [P2] [STORY-006] Verify all foreign key relationships are maintained after migration
- [x] TASK-033 [P2] [STORY-006] Validate user data integrity (emails, passwords, profiles) after migration
- [x] TASK-034 [P2] [STORY-006] Test concurrent user access with Neon PostgreSQL connection pooling

## Story: Migration Testing and Verification (P3 - Nice to Have)
- [x] TASK-035 [P3] [STORY-007] Create migration test suite (npm run test:migration)
- [x] TASK-036 [P3] [STORY-007] Create data integrity verification script (npm run verify-data)
- [x] TASK-037 [P3] [STORY-007] Create authentication workflow test suite (npm run test:auth)
- [x] TASK-038 [P3] [STORY-007] Document rollback procedure if migration issues occur

## Story: Performance Optimization (P3 - Nice to Have)
- [x] TASK-039 [P3] [STORY-008] Set up proper connection pooling configuration for Neon
- [x] TASK-040 [P3] [STORY-008] Configure database connection limits based on expected load
- [x] TASK-041 [P3] [STORY-008] Monitor connection usage during peak times
- [x] TASK-042 [P3] [STORY-008] Optimize queries for PostgreSQL performance after migration

## Story: Documentation and Monitoring (P3 - Nice to Have)
- [x] TASK-043 [P3] [STORY-009] Update documentation with post-migration optimization steps
- [x] TASK-044 [P3] [STORY-009] Set up monitoring and alerting for database performance
- [x] TASK-045 [P3] [STORY-009] Update backup procedures to work with Neon PostgreSQL
- [x] TASK-046 [P3] [STORY-009] Document troubleshooting steps for migration issues

## Acceptance Criteria
- [x] All user data successfully migrated from SQLite to Neon PostgreSQL
- [x] Authentication workflows (register, login, profile) work identically with new database
- [x] Database connection health check passes
- [x] Migration status endpoint provides accurate progress information
- [x] Application performs with improved scalability using Neon PostgreSQL
- [x] All existing tests pass with new database configuration
- [x] Rollback procedure documented and tested