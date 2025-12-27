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

// POST endpoint to update user background information
app.post('/api/auth/user/background', async (c) => {
    try {
        console.log('📝 POST /api/auth/user/background - Updating user background');

        // Use Better Auth's built-in session verification
        // This handles both cookie-based sessions and Bearer tokens via jwt() and bearer() plugins
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (!session) {
            console.log('❌ No valid session found');
            return c.json({ success: false, error: 'Authentication required' }, 401);
        }

        console.log('✓ User authenticated:', session.user.email);

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
        console.log('📖 GET /api/auth/user/background - Retrieving user background');

        // Use Better Auth's built-in session verification
        // This handles both cookie-based sessions and Bearer tokens via jwt() and bearer() plugins
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (!session) {
            console.log('❌ No valid session found');
            return c.json({ success: false, error: 'Authentication required' }, 401);
        }

        console.log('✓ User authenticated:', session.user.email);

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

// Custom sign-in endpoint that ensures cookies are set correctly
app.post('/api/auth/custom-signin', async (c) => {
    try {
        const { email, password } = await c.req.json();
        console.log('🔐 Custom sign-in attempt for:', email);

        // Use Better Auth's sign-in
        const result = await auth.api.signInEmail({
            body: { email, password }
        });

        if (!result || !result.user) {
            console.log('❌ Sign-in failed for:', email);
            return c.json({ error: 'Invalid credentials' }, 401);
        }

        console.log('✓ Sign-in successful for:', email);

        // Get the session to extract token
        const session = await auth.api.getSession({
            headers: c.req.raw.headers
        });

        if (session && session.session) {
            // Manually set cookie with explicit flags for cross-origin
            const cookieValue = `auth_session=${session.session.token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=604800`;
            c.header('Set-Cookie', cookieValue);
            console.log('✓ Set session cookie for:', email);

            return c.json({
                success: true,
                user: result.user,
                token: session.session.token,
                expiresAt: session.session.expiresAt
            });
        }

        return c.json({ error: 'Failed to create session' }, 500);
    } catch (error) {
        console.error('❌ Custom sign-in error:', error);
        return c.json({ error: 'Sign-in failed' }, 500);
    }
});

// Custom JWKS endpoint for EdDSA token verification
app.get('/api/auth/jwks', async (c) => {
    console.log('📋 JWKS request received');

    // Get the JWKS x parameter from environment
    const JWKS_X = process.env.JWKS_X || 'BMhwYtFyfFTHhC-4_84uI-a4nnaHy3suK1AW0oRPIYI';

    // Return JWKS with EdDSA public key
    const jwks = {
        keys: [
            {
                kty: 'OKP',  // Octet Key Pair (for EdDSA)
                use: 'sig',  // For signature verification
                crv: 'Ed25519',  // Ed25519 curve
                kid: 'eddsa-key-1',  // Key ID
                alg: 'EdDSA',  // Algorithm
                x: JWKS_X  // base64url encoded public key
            }
        ]
    };

    console.log('✓ Returning JWKS with 1 EdDSA key');
    return c.json(jwks);
});

// Custom endpoint to get session token for Bearer authentication
app.get('/api/auth/token', async (c) => {
    // Debug: Log all headers
    console.log('📋 Token request headers:', {
        cookie: c.req.header('cookie'),
        authorization: c.req.header('authorization'),
        origin: c.req.header('origin')
    });

    const session = await auth.api.getSession({
        headers: c.req.raw.headers
    });

    if (!session) {
        console.log('❌ No session found for token request');
        console.log('Headers received:', Object.fromEntries(c.req.raw.headers.entries()));
        return c.json({
            error: 'Authentication required',
            debug: {
                hasCookie: !!c.req.header('cookie'),
                origin: c.req.header('origin')
            }
        }, 401);
    }

    console.log('✓ Returning session token for user:', session.user.email);

    // Return session token for Bearer auth (works cross-domain)
    return c.json({
        token: session.session.token,
        expiresAt: session.session.expiresAt,
        tokenType: 'Bearer',
        user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name
        }
    });
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

// Stub endpoint for Better Auth client onAuthStateChange
// This is typically a client-side event, but the client may try to call this endpoint
app.post('/api/auth/on-auth-state-change', async (c) => {
    // This endpoint is for the Better Auth client to report state changes
    // We'll just acknowledge the request
    return c.json({ success: true, message: 'Auth state change received' });
});

app.get('/api/auth/on-auth-state-change', async (c) => {
    // Some clients may try GET instead of POST
    return c.json({ success: true, message: 'Auth state change listener ready' });
});

// Better Auth routes - This should be last to avoid intercepting custom endpoints
app.all('/api/auth/*', async (c) => {
    console.log('-> Better Auth Request:', c.req.method, c.req.path);
    try {
        const response = await auth.handler(c.req.raw);

        // Intercept sign-in responses to add EdDSA JWT token to response body
        if (c.req.path === '/api/auth/sign-in/email' && c.req.method === 'POST') {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();

            // Extract session from Better Auth response
            if (data.session && data.user) {
                try {
                    // Import crypto and jose for EdDSA JWT creation
                    const crypto = await import('crypto');
                    const { SignJWT } = await import('jose');

                    // Get EdDSA private key from environment
                    const EDDSA_PRIVATE_KEY_BASE64 = process.env.EDDSA_PRIVATE_KEY || 'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUFLaTd5aEFxb0hGbnBtWFFxczliM09Wdnc2Vlh2aUw0Ky9VcnMxaXRXcXUKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQo=';

                    // Decode base64 to PEM
                    const privateKeyPEM = Buffer.from(EDDSA_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');

                    // Import private key
                    const privateKey = crypto.createPrivateKey({
                        key: privateKeyPEM,
                        format: 'pem'
                    });

                    // Create JWT payload matching Better Auth structure
                    const jwtPayload = {
                        sub: data.user.id,  // Subject (user ID)
                        userId: data.user.id,
                        email: data.user.email,
                        name: data.user.name
                    };

                    // Calculate expiration timestamp
                    const expiresAtTimestamp = Math.floor(new Date(data.session.expiresAt).getTime() / 1000);

                    // Sign JWT with EdDSA using jose
                    const jwtToken = await new SignJWT(jwtPayload)
                        .setProtectedHeader({ alg: 'EdDSA', kid: 'eddsa-key-1' })
                        .setIssuedAt()
                        .setExpirationTime(expiresAtTimestamp)
                        .sign(privateKey);

                    // Add JWT token to response
                    data.token = jwtToken;
                    data.expiresAt = data.session.expiresAt;
                    console.log('✓ Created EdDSA JWT token for Python backend verification');
                    console.log(`  User: ${data.user.email}, Expires: ${data.session.expiresAt}`);

                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                } catch (error) {
                    console.error('❌ Failed to create EdDSA JWT:', error);
                    // Fallback: return original response
                    return response;
                }
            }
        }

        return response;
    } catch (error) {
        console.error('❌ Better Auth Error:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
        return c.json({
            error: 'Better Auth internal error',
            message: error instanceof Error ? error.message : String(error),
            path: c.req.path
        }, 500);
    }
});

const port = parseInt(process.env.PORT || '10000', 10);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
