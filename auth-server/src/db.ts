import { Pool } from '@neondatabase/serverless';
import { Kysely, PostgresDialect } from 'kysely';
import { config } from 'dotenv';

config(); // Load environment variables

// Define the database schema types
interface UserTable {
    id: string;
    email: string;
    hashed_password: string;
    created_at: Date | string; // PostgreSQL may return as string
    updated_at: Date | string;
    name?: string;
    email_verified?: number; // Using snake_case to match PostgreSQL convention
    image?: string;
    software_experience_level?: string;
    hardware_experience_level?: string;
    preferred_development_environments?: string; // JSON string
    technical_skills?: string; // JSON string
    hardware_specs?: string;
    personalization_active?: boolean; // For chapter personalization
    personalization_preferences?: string; // JSON string for personalization settings
}

interface SessionTable {
    id: string;
    user_id: string;
    expires_at: Date | string;
    token: string;
    created_at: Date | string;
    updated_at: Date | string;
    ip_address?: string;
    user_agent?: string;
}

interface AccountTable {
    id: string;
    account_id: string;
    provider_id: string;
    user_id: string;
    access_token?: string;
    refresh_token?: string;
    id_token?: string;
    access_token_expires_at?: Date | string;
    refresh_token_expires_at?: Date | string;
    scope?: string;
    password?: string;
    created_at: Date | string;
    updated_at: Date | string;
}

interface VerificationTable {
    id: string;
    identifier: string;
    value: string;
    expires_at: Date | string;
    created_at: Date | string;
    updated_at: Date | string;
}

interface DatabaseSchema {
    user: UserTable;
    session: SessionTable;
    account: AccountTable;
    verification: VerificationTable;
}

// Create a PostgreSQL connection pool with optimized settings for Neon
const dbUrl = process.env.NEON_DATABASE_URL || '';
const pool = new Pool({
    connectionString: dbUrl,
    ssl: 'require',
    // Connection pool configuration for Neon
    min: 1,           // Minimum number of connections
    max: 20,          // Maximum number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 5000, // Timeout for creating new connections
});

export const db = new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
        pool
    }),
    log(event) {
        if (event.level === 'error') {
            console.error('Query failed:', event.query.sql);
            console.error('Error:', event.error);
        } else {
            // Optional: log all queries to see what's happening
            // console.log('Query:', event.query.sql);
        }
    }
});
