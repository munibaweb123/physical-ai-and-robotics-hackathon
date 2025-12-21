import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { user } from './auth-schema';
import { config } from 'dotenv';

config(); // Load environment variables

const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';
const pool = new Pool({
    connectionString: dbUrl,
    ssl: { require: true },
});

const db = drizzle(pool);

async function testConnection() {
    try {
        console.log('Testing database connection...');

        // Try to query the user table (should exist from migration)
        const users = await db.select().from(user).limit(1);
        console.log('Database connection successful!');
        console.log('Sample user data:', users);
    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await pool.end();
    }
}

testConnection();