import { createAuthClient } from 'better-auth/client';

// Configure the client-side better-auth instance
// Point to relative path, which is proxied to auth-server
export const authClient = createAuthClient({
    baseURL: '/api/auth',
});
