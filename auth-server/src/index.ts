import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { auth } from './auth';
import { db } from './db'; // Import db
import { cors } from 'hono/cors';
import { validateUserBackgroundInput, sanitizeUserBackgroundInput } from './validation';
import { UserBackgroundResponse } from './types';
import { migrateData } from './migrate'; // Import migration function

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

// Database Migration API Endpoints
let migrationStatus = {
    migrationId: null as string | null,
    status: 'idle' as 'idle' | 'in-progress' | 'completed' | 'failed',
    sourceDatabase: 'sqlite',
    targetDatabase: 'neon-postgresql',
    migratedTables: [] as string[],
    migratedRecords: 0,
    completionPercentage: 0,
    startDate: null as string | null,
    completionDate: null as string | null,
    estimatedCompletion: null as string | null,
    message: 'Ready to start migration',
    error: null as string | null
};

// POST /api/db/migration/start - Initiate database migration
app.post('/api/db/migration/start', async (c) => {
    // In a real implementation, you would check for admin authentication here
    // For this example, we'll assume the caller is authorized

    try {
        // Reset migration status
        migrationStatus = {
            migrationId: `mig-${Date.now()}`,
            status: 'in-progress',
            sourceDatabase: 'sqlite',
            targetDatabase: 'neon-postgresql',
            migratedTables: [],
            migratedRecords: 0,
            completionPercentage: 0,
            startDate: new Date().toISOString(),
            completionDate: null,
            estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
            message: 'Migration in progress',
            error: null
        };

        // Start migration in background
        migrateData()
            .then(() => {
                // Update status on success
                migrationStatus.status = 'completed';
                migrationStatus.completionDate = new Date().toISOString();
                migrationStatus.completionPercentage = 100;
                migrationStatus.message = 'Migration completed successfully';
                console.log('Migration completed successfully');
            })
            .catch((error) => {
                // Update status on failure
                migrationStatus.status = 'failed';
                migrationStatus.error = error.message;
                migrationStatus.message = 'Migration failed';
                console.error('Migration failed:', error);
            });

        return c.json({
            success: true,
            migrationId: migrationStatus.migrationId,
            status: migrationStatus.status,
            estimatedDurationMinutes: 15,
            message: 'Migration process started successfully'
        });
    } catch (error) {
        return c.json({
            success: false,
            error: 'Failed to start migration',
            details: error.message
        }, 500);
    }
});

// GET /api/db/migration/status - Check migration progress
app.get('/api/db/migration/status', async (c) => {
    // In a real implementation, you would check for admin authentication here
    // For this example, we'll assume the caller is authorized

    let response;
    if (migrationStatus.status === 'completed') {
        response = {
            migrationStatus: migrationStatus.status,
            sourceDatabase: migrationStatus.sourceDatabase,
            targetDatabase: migrationStatus.targetDatabase,
            migratedTables: [
                "users",
                "user_background",
                "sessions",
                "accounts"
            ],
            migratedRecords: migrationStatus.migratedRecords,
            completionPercentage: 100,
            startDate: migrationStatus.startDate,
            completionDate: migrationStatus.completionDate,
            message: migrationStatus.message
        };
    } else if (migrationStatus.status === 'in-progress') {
        response = {
            migrationStatus: migrationStatus.status,
            sourceDatabase: migrationStatus.sourceDatabase,
            targetDatabase: migrationStatus.targetDatabase,
            migratedTables: migrationStatus.migratedTables,
            migratedRecords: migrationStatus.migratedRecords,
            completionPercentage: migrationStatus.completionPercentage,
            startDate: migrationStatus.startDate,
            estimatedCompletion: migrationStatus.estimatedCompletion,
            message: migrationStatus.message
        };
    } else {
        response = {
            success: false,
            error: migrationStatus.message,
            details: {
                failedTable: "unknown",
                errorMessage: migrationStatus.error || "Unknown error"
            }
        };
    }

    return c.json(response);
});

// GET /api/db/health - Check database connection health
app.get('/api/db/health', async (c) => {
    try {
        // Test database connection by performing a simple query
        const result = await db.selectFrom('user')
            .select('id')
            .limit(1)
            .execute();

        const response = {
            status: 'healthy',
            databaseType: process.env.DATABASE_PROVIDER || 'unknown',
            connectionPool: {
                activeConnections: 1, // This is a simplification
                idleConnections: 0,   // This is a simplification
                maxConnections: 20    // This is a simplification
            },
            responseTimeMs: 12, // This is a simplification
            timestamp: new Date().toISOString()
        };

        return c.json(response);
    } catch (error) {
        console.error('Database health check failed:', error);
        const response = {
            status: 'unhealthy',
            databaseType: process.env.DATABASE_PROVIDER || 'unknown',
            error: error.message,
            timestamp: new Date().toISOString()
        };

        return c.json(response, 503);
    }
});

// For Python backend verification, we will create a simple endpoint
// that verifies the session token (JWT or opaque) and returns user info.
app.post('/api/auth/verify-session', async (c) => {
    try {
        console.log('Verifying session...');
        
        // 1. Try to verify using better-auth's native getSession (cookie-based or bearer)
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (session) {
            console.log(`Session verified successfully for user: ${session.user.email}`);
            return c.json({ success: true, user: { id: session.user.id, email: session.user.email } });
        }

        // 2. Fallback: Check for manual token in body OR Authorization header
        let token;
        try {
            const body = await c.req.json();
            token = body.token;
        } catch (e) { }

        if (!token) {
            const authHeader = c.req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (token) {
             console.log(`Checking manual token: ${token.substring(0, 10)}...`);
             // Try manual DB lookup for the token (checking the token column)
             const dbSession = await db.selectFrom('session')
                .selectAll()
                .where('token', '=', token)
                .executeTakeFirst();

            if (dbSession) {
                 // Check expiry
                 const expiresAt = new Date(dbSession.expiresAt);
                 if (expiresAt > new Date()) {
                     const user = await db.selectFrom('user')
                        .select(['id', 'email'])
                        .where('id', '=', dbSession.userId)
                        .executeTakeFirst();
                     
                     if (user) {
                         console.log(`Manual verification success for user: ${user.email}`);
                         return c.json({ success: true, user: { id: user.id, email: user.email } });
                     }
                 } else {
                     console.log('Manual token expired');
                 }
            }
        }

        console.log('Session verification failed');
        return c.json({ success: false, message: 'Invalid or expired session' }, 401);

    } catch (error) {
        console.error('Session verification error details:', error);
        if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
        }
        return c.json({ success: false, message: 'Internal server error during session verification', error: String(error) }, 500);
    }
});

// JWKS endpoint for the Python backend to verify JWT tokens
app.get('/api/auth/jwks', async (c) => {
    // For HS256/HS512 with shared secret, we return the symmetric key
    const secret = process.env.BETTER_AUTH_SECRET || 'super-secret-key-please-change-me-in-production';

    // Create base64url-encoded representation of the secret
    const encoder = new TextEncoder();
    const secretBuffer = encoder.encode(secret);

    // Convert to base64
    let binaryString = '';
    for (let i = 0; i < secretBuffer.length; i++) {
        binaryString += String.fromCharCode(secretBuffer[i]);
    }
    const secretBase64 = btoa(binaryString);
    const secretBase64Url = secretBase64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return c.json({
        keys: [
            {
                kty: "oct",  // Octet sequence (symmetric key)
                use: "sig",  // Used for signature
                alg: "HS512", // Algorithm (matches JWT configuration)
                kid: "default-key-id", // Key ID
                k: secretBase64Url // The encoded secret key
            }
        ]
    });
});

// POST endpoint to update user background information
app.post('/api/auth/user/background', async (c) => {
    try {
        const headers = c.req.raw.headers;
        console.log('User Background Headers:', JSON.stringify(Object.fromEntries(headers.entries())));
        
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (!session) {
            // Fallback: Check for Bearer token manually if getSession (cookie-based) fails
            const authHeader = c.req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                // Verify the opaque token against the session table
                const dbSession = await db.selectFrom('session')
                    .selectAll()
                    .where('token', '=', token)
                    .executeTakeFirst();

                if (dbSession && dbSession.expiresAt > new Date()) {
                     // Fetch user for this session
                     const user = await db.selectFrom('user')
                        .selectAll()
                        .where('id', '=', dbSession.userId)
                        .executeTakeFirst();
                     
                     if (user) {
                         // Manually construct session object
                         // @ts-ignore
                         session = { session: dbSession, user: user };
                     }
                }
            }
        }

        if (!session) {
            console.log('Session verification failed for background update');
            return c.json({ success: false, error: 'Authentication required' }, 401);
        }

        // @ts-ignore
        const userId = session.user.id;
        const body = await c.req.json();

        // Validate the input
        const validation = validateUserBackgroundInput(body);
        if (!validation.isValid) {
            return c.json({
                success: false,
                error: 'Invalid input data',
                details: validation.errors.reduce((acc, error) => {
                    acc[error.field] = error.message;
                    return acc;
                }, {} as Record<string, string>)
            }, 400);
        }

        // Sanitize the input
        const sanitizedData = sanitizeUserBackgroundInput(body);

        // Prepare the update data using snake_case to match the database schema
        const updateData: Record<string, any> = {};
        if (sanitizedData.softwareExperienceLevel !== undefined) {
            updateData.software_experience_level = sanitizedData.softwareExperienceLevel;
        }
        if (sanitizedData.hardwareExperienceLevel !== undefined) {
            updateData.hardware_experience_level = sanitizedData.hardwareExperienceLevel;
        }
        if (sanitizedData.preferredDevelopmentEnvironments !== undefined) {
            updateData.preferred_development_environments = JSON.stringify(sanitizedData.preferredDevelopmentEnvironments);
        }
        if (sanitizedData.technicalSkills !== undefined) {
            updateData.technical_skills = JSON.stringify(sanitizedData.technicalSkills);
        }
        if (sanitizedData.hardwareSpecs !== undefined) {
            updateData.hardware_specs = sanitizedData.hardwareSpecs;
        }

        // Update the user in the database
        await db.updateTable('user')
            .set(updateData)
            .where('id', '=', userId)
            .execute();

        return c.json({
            success: true,
            message: 'Background information updated successfully',
            userId: userId
        });
    } catch (error) {
        console.error('Error updating background information:', error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        return c.json({ success: false, error: 'Internal server error', details: String(error) }, 500);
    }
});

// GET endpoint to retrieve user background information
app.get('/api/auth/user/background', async (c) => {
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (!session) {
            return c.json({ success: false, error: 'Authentication required' }, 401);
        }

        const userId = session.user.id;

        // Get user from the database using snake_case columns
        const user = await db.selectFrom('user')
            .select([
                'id',
                'software_experience_level',
                'hardware_experience_level',
                'preferred_development_environments',
                'technical_skills',
                'hardware_specs',
                'updated_at'
            ])
            .where('id', '=', userId)
            .executeTakeFirst();

        if (!user) {
            return c.json({ success: false, error: 'User not found' }, 404);
        }

        // Parse JSON fields if they exist and map back to camelCase for the API response
        const response: UserBackgroundResponse = {
            userId: user.id,
            softwareExperienceLevel: (user as any).software_experience_level || undefined,
            hardwareExperienceLevel: (user as any).hardware_experience_level || undefined,
            preferredDevelopmentEnvironments: (user as any).preferred_development_environments ? JSON.parse((user as any).preferred_development_environments) : undefined,
            technicalSkills: (user as any).technical_skills ? JSON.parse((user as any).technical_skills) : undefined,
            hardwareSpecs: (user as any).hardware_specs || undefined,
            updatedAt: (user as any).updated_at ? new Date((user as any).updated_at).toISOString() : new Date().toISOString()
        };

        return c.json(response);
    } catch (error) {
        console.error('Error retrieving background information:', error);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        return c.json({ success: false, error: 'Internal server error', details: String(error) }, 500);
    }
});

// POST endpoint to update chapter personalization state
app.post('/api/auth/chapters/:chapterId/personalize', async (c) => {
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (!session) {
            return c.json({ success: false, error: 'Authentication required' }, 401);
        }

        const chapterId = c.req.param('chapterId');
        const userId = session.user.id;
        const body = await c.req.json();

        // Validate the input
        const validation = validateUserBackgroundInput({
            // Create a validation for personalization toggle data
            activate: body.activate
        });
        if (!validation.isValid) {
            return c.json({
                success: false,
                error: 'Invalid input data',
                details: validation.errors.reduce((acc, error) => {
                    acc[error.field] = error.message;
                    return acc;
                }, {} as Record<string, string>)
            }, 400);
        }

        // Prepare the update data for chapter personalization using snake_case
        const updateData: Record<string, any> = {
            personalization_active: body.activate || false
        };

        if (body.preferences) {
            updateData.personalization_preferences = JSON.stringify(body.preferences);
        }

        // In a real implementation, we would update a separate table for chapter personalization
        // For now, we'll store it in the user table as an example
        // In a production system, you'd want a separate table to track chapter-specific settings
        await db.updateTable('user')
            .set(updateData)
            .where('id', '=', userId)
            .execute();

        return c.json({
            success: true,
            message: `Personalization ${body.activate ? 'activated' : 'deactivated'} for chapter ${chapterId}`,
            chapterId: chapterId,
            personalizationActive: body.activate || false,
            adaptationsApplied: [] // Would be populated based on user profile in real implementation
        });
    } catch (error) {
        console.error('Error updating chapter personalization:', error);
        return c.json({ success: false, error: 'Internal server error' }, 500);
    }
});

// GET endpoint to retrieve chapter personalization state
app.get('/api/auth/chapters/:chapterId/personalize', async (c) => {
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (!session) {
            return c.json({ success: false, error: 'Authentication required' }, 401);
        }

        const chapterId = c.req.param('chapterId');
        const userId = session.user.id;

        // Get user from the database using snake_case columns
        const user = await db.selectFrom('user')
            .select([
                'id',
                'software_experience_level',
                'hardware_experience_level',
                'preferred_development_environments',
                'technical_skills',
                'hardware_specs',
                'personalization_active', 
                'personalization_preferences', 
                'updated_at'
            ])
            .where('id', '=', userId)
            .executeTakeFirst();

        if (!user) {
            return c.json({ success: false, error: 'User not found' }, 404);
        }

        // Parse JSON fields and map to camelCase for response
        const response = {
            success: true,
            userId: user.id,
            chapterId: chapterId,
            personalizationActive: (user as any).personalization_active || false,
            adaptationsApplied: [], // Would be computed based on user profile in real implementation
            currentSettings: (user as any).personalization_preferences ? JSON.parse((user as any).personalization_preferences) : {},
            lastViewedAt: (user as any).updated_at ? new Date((user as any).updated_at).toISOString() : new Date().toISOString()
        };

        return c.json(response);
    } catch (error) {
        console.error('Error retrieving chapter personalization state:', error);
        return c.json({ success: false, error: 'Internal server error' }, 500);
    }
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

// Better Auth routes - This should be last to avoid intercepting custom endpoints
app.all('/api/auth/*', async (c) => {
    console.log('-> Better Auth Request:', c.req.method, c.req.path);
    const response = await auth.handler(c.req.raw);
    return response;
});

const port = parseInt(process.env.PORT || '10000', 10);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
