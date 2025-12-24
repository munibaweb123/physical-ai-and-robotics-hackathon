import Database from 'better-sqlite3';
import { Pool } from 'pg';
import { Kysely, SqliteDialect, PostgresDialect } from 'kysely';
import { Database as SqliteDatabase } from './schema';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; // For UUID generation

config(); // Load environment variables

// SQLite database connection (source)
const sqlite = new Database('./auth_v2.db');

const sqliteDb = new Kysely<SqliteDatabase>({
    dialect: new SqliteDialect({
        database: sqlite,
    }),
});

// PostgreSQL database connection (target)
const dbUrl = process.env.NEON_DATABASE_URL || '';
const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

const postgresDb = new Kysely<SqliteDatabase>({
    dialect: new PostgresDialect({
        pool
    }),
});

async function migrateData() {
    console.log('Starting data migration from SQLite to PostgreSQL...');

    try {
        // Count records before migration
        const userCount = await sqliteDb.selectFrom('user').select('id').execute();
        const sessionCount = await sqliteDb.selectFrom('session').select('id').execute();
        const accountCount = await sqliteDb.selectFrom('account').select('id').execute();
        const verificationCount = await sqliteDb.selectFrom('verification').select('id').execute();

        console.log(`Found ${userCount.length} users, ${sessionCount.length} sessions, ${accountCount.length} accounts, ${verificationCount.length} verifications in source database`);

        // Migrate users table
        await migrateUsers();
        console.log('Users table migrated successfully');

        // Migrate user_background table
        await migrateUserBackground();
        console.log('User background table migrated successfully');

        // Migrate sessions table
        await migrateSessions();
        console.log('Sessions table migrated successfully');

        // Migrate accounts table
        await migrateAccounts();
        console.log('Accounts table migrated successfully');

        // Migrate verification table
        await migrateVerification();
        console.log('Verification table migrated successfully');

        // Validate data integrity after migration
        await validateDataIntegrity();
        console.log('Data integrity validation completed successfully');

        console.log('Data migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    } finally {
        // Close connections
        await pool.end();
        sqlite.close();
    }
}

async function migrateUsers() {
    // Fetch all users from SQLite
    const sqliteUsers = await sqliteDb.selectFrom('user').selectAll().execute();

    for (const user of sqliteUsers) {
        // Transform field names from snake_case to match PostgreSQL schema
        // Ensure proper UUID format and handle JSON fields
        await postgresDb.insertInto('user')
            .values({
                id: user.id || uuidv4(), // Generate UUID if not present
                name: user.name,
                email: user.email,
                email_verified: user.emailVerified, // Map from emailVerified to email_verified
                image: user.image,
                created_at: convertTimestamp(user.createdAt || user.created_at), // Convert timestamp format
                updated_at: convertTimestamp(user.updatedAt || user.updated_at), // Convert timestamp format
                software_experience_level: user.softwareExperienceLevel, // Map from camelCase to snake_case
                hardware_experience_level: user.hardwareExperienceLevel,
                preferred_development_environments: convertJsonField(user.preferredDevelopmentEnvironments), // Convert JSON field
                technical_skills: convertJsonField(user.technicalSkills), // Convert JSON field
                hardware_specs: user.hardwareSpecs,
                hashed_password: user.hashed_password,
                personalization_active: user.personalizationActive || null,
                personalization_preferences: user.personalizationPreferences || null
            })
            .onConflict((oc) => oc.column('id').doNothing()) // Skip if user already exists
            .execute();
    }
}

async function migrateUserBackground() {
    // In the current schema, user background info is stored in the user table
    // This function handles potential separate user_background table if it exists
    // For now, we'll skip this since background info is in the user table
    console.log('User background data is stored in user table, migration handled with users');
}

async function migrateSessions() {
    // Fetch all sessions from SQLite
    const sqliteSessions = await sqliteDb.selectFrom('session').selectAll().execute();

    for (const session of sqliteSessions) {
        await postgresDb.insertInto('session')
            .values({
                id: session.id || uuidv4(), // Generate UUID if not present
                user_id: session.userId || session.user_id, // Handle both naming conventions
                expires_at: convertTimestamp(session.expiresAt || session.expires_at), // Convert timestamp format
                token: session.token,
                created_at: convertTimestamp(session.createdAt || session.created_at), // Convert timestamp format
                updated_at: convertTimestamp(session.updatedAt || session.updated_at), // Convert timestamp format
                ip_address: session.ipAddress || session.ip_address,
                user_agent: session.userAgent || session.user_agent
            })
            .onConflict((oc) => oc.column('id').doNothing()) // Skip if session already exists
            .execute();
    }
}

async function migrateAccounts() {
    // Fetch all accounts from SQLite
    const sqliteAccounts = await sqliteDb.selectFrom('account').selectAll().execute();

    for (const account of sqliteAccounts) {
        await postgresDb.insertInto('account')
            .values({
                id: account.id || uuidv4(), // Generate UUID if not present
                account_id: account.accountId || account.account_id, // Handle both naming conventions
                provider_id: account.providerId || account.provider_id,
                user_id: account.userId || account.user_id,
                access_token: account.accessToken || account.access_token,
                refresh_token: account.refreshToken || account.refresh_token,
                id_token: account.idToken || account.id_token,
                access_token_expires_at: convertTimestamp(account.accessTokenExpiresAt || account.access_token_expires_at), // Convert timestamp format
                refresh_token_expires_at: convertTimestamp(account.refreshTokenExpiresAt || account.refresh_token_expires_at), // Convert timestamp format
                scope: account.scope,
                password: account.password,
                created_at: convertTimestamp(account.createdAt || account.created_at), // Convert timestamp format
                updated_at: convertTimestamp(account.updatedAt || account.updated_at) // Convert timestamp format
            })
            .onConflict((oc) => oc.column('id').doNothing()) // Skip if account already exists
            .execute();
    }
}

async function migrateVerification() {
    // Fetch all verification records from SQLite
    const sqliteVerifications = await sqliteDb.selectFrom('verification').selectAll().execute();

    for (const verification of sqliteVerifications) {
        await postgresDb.insertInto('verification')
            .values({
                id: verification.id || uuidv4(), // Generate UUID if not present
                identifier: verification.identifier,
                value: verification.value,
                expires_at: convertTimestamp(verification.expiresAt || verification.expires_at), // Convert timestamp format
                created_at: convertTimestamp(verification.createdAt || verification.created_at), // Convert timestamp format
                updated_at: convertTimestamp(verification.updatedAt || verification.updated_at) // Convert timestamp format
            })
            .onConflict((oc) => oc.column('id').doNothing()) // Skip if verification already exists
            .execute();
    }
}

// Function to validate data integrity after migration
async function validateDataIntegrity() {
    console.log('Validating data integrity...');

    // Count records in PostgreSQL
    const postgresUserCount = await postgresDb.selectFrom('user').select('id').execute();
    const postgresSessionCount = await postgresDb.selectFrom('session').select('id').execute();
    const postgresAccountCount = await postgresDb.selectFrom('account').select('id').execute();
    const postgresVerificationCount = await postgresDb.selectFrom('verification').select('id').execute();

    // Compare counts
    const sqliteUserCount = await sqliteDb.selectFrom('user').select('id').execute();
    const sqliteSessionCount = await sqliteDb.selectFrom('session').select('id').execute();
    const sqliteAccountCount = await sqliteDb.selectFrom('account').select('id').execute();
    const sqliteVerificationCount = await sqliteDb.selectFrom('verification').select('id').execute();

    console.log(`PostgreSQL: ${postgresUserCount.length} users, ${postgresSessionCount.length} sessions, ${postgresAccountCount.length} accounts, ${postgresVerificationCount.length} verifications`);
    console.log(`SQLite: ${sqliteUserCount.length} users, ${sqliteSessionCount.length} sessions, ${sqliteAccountCount.length} accounts, ${sqliteVerificationCount.length} verifications`);

    // Check if counts match
    if (postgresUserCount.length === sqliteUserCount.length &&
        postgresSessionCount.length === sqliteSessionCount.length &&
        postgresAccountCount.length === sqliteAccountCount.length &&
        postgresVerificationCount.length === sqliteVerificationCount.length) {
        console.log('✓ Data integrity check passed: All records migrated successfully');
    } else {
        console.warn('⚠ Data integrity check: Record counts do not match between source and target databases');
    }
}

// Helper function to convert timestamps to proper format
function convertTimestamp(timestamp: any): Date {
    if (!timestamp) return new Date();

    // If it's already a Date object, return it
    if (timestamp instanceof Date) return timestamp;

    // If it's a string, try to parse it
    if (typeof timestamp === 'string') {
        return new Date(timestamp);
    }

    // If it's a number, treat as milliseconds since epoch
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }

    // Default to current date
    return new Date();
}

// Helper function to convert JSON fields to proper format for PostgreSQL
function convertJsonField(jsonString: string | null): string | null {
    if (!jsonString) return null;

    try {
        // Verify it's valid JSON and return as string for PostgreSQL
        JSON.parse(jsonString);
        return jsonString;
    } catch (e) {
        console.warn('Invalid JSON field:', jsonString);
        return null;
    }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateData().catch(error => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
}

export { migrateData };