import { createAuthClient } from 'better-auth/react';
import siteConfig from '@generated/docusaurus.config';

export const authClient = createAuthClient({
    baseURL: siteConfig.customFields?.authBaseUrl as string || "http://localhost:4000" 
})
