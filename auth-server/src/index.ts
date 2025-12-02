import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { auth } from './auth';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS for frontend
app.use(
    '*',
    cors({
        origin: ['http://localhost:3000'], // Allow Docusaurus frontend
        credentials: true, // Allow cookies for session management
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    })
);

// Serve static files (optional, for future use or simple web pages)
app.use('/static/*', serveStatic({ root: './' }));

// Health check endpoint
app.get('/api/auth/health', (c) => c.json({ status: 'ok' }));

// Better Auth routes
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
    return auth.handler(c.req.raw);
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

// For Python backend verification, we will create a simple endpoint
// that verifies the session and returns user info.
app.post('/api/auth/verify-session', async (c) => {
    try {
        const sessionCookie = c.req.header('Cookie');
        if (!sessionCookie) {
            return c.json({ success: false, message: 'No session cookie provided' }, 401);
        }

        const sessionId = auth.readSessionCookie(sessionCookie);
        if (!sessionId) {
            return c.json({ success: false, message: 'Invalid session cookie' }, 401);
        }

        const { session, user } = await auth.getSession(sessionId);

        if (!session || !user) {
            return c.json({ success: false, message: 'Session or user not found' }, 401);
        }

        return c.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
        console.error('Session verification error:', error);
        return c.json({ success: false, message: 'Internal server error during session verification' }, 500);
    }
});

const port = 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
