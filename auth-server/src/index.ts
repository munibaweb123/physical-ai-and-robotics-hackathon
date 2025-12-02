import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { auth } from './auth';
import { db } from './db'; // Import db
import { cors } from 'hono/cors';

const app = new Hono();

// CORS for frontend
app.use(
    '/api/*',
    cors({
        origin: (origin) => origin, // Allow any origin (reflect request origin)
        credentials: true,
        allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        maxAge: 600,
    })
);

// Serve static files (optional, for future use or simple web pages)
app.use('/static/*', serveStatic({ root: './' }));

// Health check endpoint
app.get('/api/auth/health', (c) => c.json({ status: 'ok' }));

// For Python backend verification, we will create a simple endpoint
// that verifies the session and returns user info.
app.post('/api/auth/verify-session', async (c) => {
    try {
        const body = await c.req.json();
        const token = body.token;

        if (!token) {
            return c.json({ success: false, message: 'No token provided' }, 400);
        }

        // Query DB directly for session
        // better-auth usually stores the token as-is or hashed. 
        // If hashed, this direct lookup might fail, but let's try.
        const session = await db.selectFrom('session')
            .selectAll()
            .where('token', '=', token)
            .executeTakeFirst();

        if (!session) {
             // If not found, maybe it's because it's hashed? 
             // But standard better-auth often stores session token directly for lookup performance.
             return c.json({ success: false, message: 'Session not found' }, 401);
        }
        
        if (new Date(session.expiresAt) < new Date()) {
             return c.json({ success: false, message: 'Session expired' }, 401);
        }

        // Get user
        const user = await db.selectFrom('user')
            .selectAll()
            .where('id', '=', session.userId)
            .executeTakeFirst();

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 401);
        }

        return c.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Session verification error:', error);
        return c.json({ success: false, message: 'Internal server error during session verification' }, 500);
    }
});

// Better Auth routes
app.all('/api/auth/*', async (c) => {
    console.log('-> Better Auth Request:', c.req.method, c.req.path);
    const response = await auth.handler(c.req.raw);
    return response;
});

// Custom user endpoints (e.g., get current user)
app.get('/api/auth/user', async (c) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    });

    if (!session) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    return c.json({ user: session.user });
});

const port = 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
