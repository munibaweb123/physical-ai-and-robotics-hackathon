/**
 * Utility functions for managing EdDSA JWT tokens
 */

import { authBaseUrl } from './auth-client';

let cachedEddsaToken: string | null = null;
let tokenExpiryTime: number | null = null;

/**
 * Fetch a new EdDSA token from the auth server
 */
async function fetchNewEddsaToken(): Promise<string | null> {
  try {
    const response = await fetch(`${authBaseUrl}/api/auth/token/eddsa`, {
      credentials: 'include' // Include session cookie
    });

    if (!response.ok) {
      console.error(`Failed to get EdDSA token: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.token) {
      // Store token and set expiry time (token expires in 7 days, we'll refresh after 6)
      cachedEddsaToken = data.token;
      tokenExpiryTime = Date.now() + (6 * 24 * 60 * 60 * 1000); // 6 days in milliseconds
      console.log('✓ EdDSA token obtained successfully');
      return data.token;
    }

    return null;
  } catch (error) {
    console.error('Error fetching EdDSA token:', error);
    return null;
  }
}

/**
 * Get an EdDSA token, using cached version if available and not expired
 */
export async function getEddsaToken(): Promise<string | null> {
  // Check if we have a cached token that hasn't expired
  if (cachedEddsaToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedEddsaToken;
  }

  // Fetch a new token
  return await fetchNewEddsaToken();
}

/**
 * Clear the cached token (useful after logout)
 */
export function clearEddsaToken(): void {
  cachedEddsaToken = null;
  tokenExpiryTime = null;
}

/**
 * Check if we have a valid cached token
 */
export function hasValidEddsaToken(): boolean {
  return !!(cachedEddsaToken && tokenExpiryTime && Date.now() < tokenExpiryTime);
}
