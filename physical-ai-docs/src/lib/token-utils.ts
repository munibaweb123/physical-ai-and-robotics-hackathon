/**
 * Utility functions for managing EdDSA JWT tokens
 * Token is now stored in localStorage during login
 */

/**
 * Get the EdDSA token from localStorage
 */
export async function getEddsaToken(): Promise<string | null> {
  try {
    // Get token from localStorage (stored during login)
    const token = localStorage.getItem('auth_token');
    const expiryStr = localStorage.getItem('auth_token_expiry');

    if (!token || !expiryStr) {
      console.warn('No EdDSA token available in localStorage');
      return null;
    }

    // Check if token is expired
    const expiry = parseInt(expiryStr);
    if (Date.now() >= expiry) {
      console.warn('EdDSA token expired');
      // Clear expired token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token_expiry');
      localStorage.removeItem('auth_user');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting EdDSA token:', error);
    return null;
  }
}

/**
 * Clear the token (useful after logout)
 */
export function clearEddsaToken(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_token_expiry');
  localStorage.removeItem('auth_user');
}

/**
 * Check if we have a valid token
 */
export function hasValidEddsaToken(): boolean {
  const token = localStorage.getItem('auth_token');
  const expiryStr = localStorage.getItem('auth_token_expiry');

  if (!token || !expiryStr) {
    return false;
  }

  const expiry = parseInt(expiryStr);
  return Date.now() < expiry;
}
