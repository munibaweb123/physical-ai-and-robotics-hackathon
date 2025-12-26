import { createAuthClient } from 'better-auth/react';
import siteConfig from '@generated/docusaurus.config';

const authBaseUrl = siteConfig.customFields!.authBaseUrl as string;
const apiBaseUrl = (siteConfig.customFields!.apiBaseUrl as string) || 'http://localhost:8000';
console.log('Auth Client Base URL:', authBaseUrl);

export { authBaseUrl, apiBaseUrl };

export const authClient = createAuthClient({
    baseURL: authBaseUrl,
    fetchOptions: {
        credentials: 'include', // CRITICAL: Send cookies cross-origin
    },
})
