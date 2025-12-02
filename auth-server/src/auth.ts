import { betterAuth } from 'better-auth';
import { db } from './db';
// Workaround for missing export in better-auth v1.4.4
import { kyselyAdapter } from "../node_modules/better-auth/dist/adapters/kysely-adapter/index.mjs";
import { config } from 'dotenv';

config(); // Load environment variables

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_COOKIE_SECRET = process.env.SESSION_COOKIE_SECRET || 'super-secret-key-please-change-me-in-production'; // Change this in production!

export const auth = betterAuth({
    database: kyselyAdapter(db, {
        provider: "sqlite",
    }),
    secret: SESSION_COOKIE_SECRET,
    // Configure how sessions are managed
    session: {
        cookie: {
            name: SESSION_COOKIE_NAME,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            httpOnly: true, // Prevent client-side JavaScript from accessing cookie
            sameSite: "lax",
            path: '/', // Accessible across the entire domain
            maxAge: 60 * 60 * 24 * 7, // 1 week
        },
    },
});

// Define a type for the user, which will be returned by better-auth
declare module 'better-auth' {
    interface RegisterTypes {
        User: {
            id: string;
            email: string;
        };
    }
}
