import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from 'dotenv';
import * as schema from './auth-schema';

config(); // Load environment variables

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || 'super-secret-key-please-change-me-in-production';

// Create a Neon connection pool
const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';
const pool = new Pool({
    connectionString: dbUrl,
    ssl: { require: true },
});

// Create Drizzle instance
const db = drizzle(pool);

// Test Better Auth configuration
const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // PostgreSQL provider
        schema, // Pass the generated schema
    }),
    baseURL: 'http://localhost:7860/api/auth', // Critical: Tell better-auth where it lives
    emailAndPassword: {
        enabled: true,
    },
    secret: BETTER_AUTH_SECRET,
    // Configure how sessions are managed
    session: {
        cookie: {
            name: 'auth_session',
            secure: process.env.NODE_ENV === 'production' || process.env.BETTER_AUTH_URL?.startsWith("https"),
            httpOnly: true, // Prevent client-side JavaScript from accessing cookie
            sameSite: "none", // REQUIRED for cross-domain (Vercel -> Hugging Face)
            path: '/', // Accessible across the entire domain
            maxAge: 60 * 60 * 24 * 7, // 1 week
        },
    },
    // Add custom fields to user schema
    user: {
        additionalFields: {
            softwareExperienceLevel: {
                type: "string",
                required: false,
            },
            hardwareExperienceLevel: {
                type: "string",
                required: false,
            },
            preferredDevelopmentEnvironments: {
                type: "string", // stored as JSON string
                required: false,
            },
            technicalSkills: {
                type: "string", // stored as JSON string
                required: false,
            },
            hardwareSpecs: {
                type: "string",
                required: false,
            }
        }
    }
});

console.log('Better Auth configuration created successfully!');

// Test creating a user
async function testAuth() {
    try {
        console.log('Testing user creation...');

        const newUser = await auth.api.signUpEmail({
            body: {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            }
        });

        console.log('User created successfully:', newUser);
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await pool.end();
    }
}

testAuth().catch(console.error);