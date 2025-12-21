import { betterAuth } from 'better-auth';
import { bearer } from "better-auth/plugins";
import { config } from 'dotenv';

// Import Drizzle adapter for Better Auth
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Import the generated schema
import * as schema from '../auth-schema';

config(); // Load environment variables

const SESSION_COOKIE_NAME = 'auth_session';
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || 'super-secret-key-please-change-me-in-production'; // Change this in production!

// Use environment variable for the base URL of the Auth Server
const AUTH_SERVER_BASE_URL = process.env.BETTER_AUTH_URL || 'http://localhost:7860';
// Use environment variable for the frontend URL (your Vercel deployment)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'; // Replace with your Vercel URL in production

// Create a Neon connection pool
const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || '';
const pool = new Pool({
    connectionString: dbUrl,
    ssl: { require: true },
});

// Create Drizzle instance
const db = drizzle(pool);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // PostgreSQL provider
        schema, // Pass the generated schema
    }),
    baseURL: `${AUTH_SERVER_BASE_URL}/api/auth`, // Critical: Tell better-auth where it lives
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        bearer()
    ],
    // Trust the frontend origin (your Vercel app)
    trustedOrigins: [FRONTEND_URL],
    security: {
        allowedOrigins: [FRONTEND_URL],
    },
    secret: BETTER_AUTH_SECRET,
    // Configure how sessions are managed
    session: {
        cookie: {
            name: SESSION_COOKIE_NAME,
            // CRITICAL: Vercel (Frontend) -> Hugging Face (Backend) is Cross-Site.
            // Cross-Site cookies MUST be "SameSite=None" AND "Secure".
            // If NODE_ENV is missing/wrong, "Secure" might default to false, causing the browser to block the cookie.
            // We force Secure if we are in production OR if our base URL is HTTPS.
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

// Define a type for the user, which will be returned by better-auth
declare module 'better-auth' {
    interface RegisterTypes {
        User: {
            id: string;
            email: string;
            name?: string;
            emailVerified?: boolean;
            image?: string;
            softwareExperienceLevel?: string;
            hardwareExperienceLevel?: string;
            preferredDevelopmentEnvironments?: string; // JSON string
            technicalSkills?: string; // JSON string
            hardwareSpecs?: string;
        };
    }
}
