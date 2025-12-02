import { createAuthClient } from 'better-auth/client';

// Determine the base URL based on the environment to prevent SSR crashes
// Use absolute URL for CORS strategy
const baseURL = typeof window !== 'undefined' 
    ? 'http://localhost:4000/api/auth' 
    : 'http://localhost:4000/api/auth';

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        credentials: 'include',
    },
});
