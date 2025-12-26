import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { authClient } from '../../../lib/auth-client';
import type { User } from 'better-auth'; // Assuming better-auth exports User type

function CustomLogoutButton() {
  const [user, setUser] = useState<User | null>(null);
  const history = useHistory();
  const location = useLocation(); // To trigger re-fetch on route change
  const loginPath = useBaseUrl('/login');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('👤 Fetching user session...');

        // First check localStorage (for JWT token auth)
        const authUser = localStorage.getItem('auth_user');
        const authToken = localStorage.getItem('auth_token');
        const tokenExpiry = localStorage.getItem('auth_token_expiry');

        if (authUser && authToken && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry);
          if (Date.now() < expiryTime) {
            console.log('✓ User logged in via token:', JSON.parse(authUser).email);
            setUser(JSON.parse(authUser));
            return;
          } else {
            console.log('⚠️ Token expired, clearing...');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token_expiry');
          }
        }

        // Fallback to session-based auth
        const { data: session } = await authClient.getSession();
        console.log('Session data:', session);
        if (session?.user) {
          console.log('✓ User logged in:', session.user.email);
          setUser(session.user);
        } else {
          console.log('❌ No user session found');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Failed to fetch session:', error);
        setUser(null);
      }
    };

    fetchUser();

    // Also subscribe to auth state changes
    const { data: authListener } = authClient.onAuthStateChange((event, session) => {
      console.log(`🔔 Auth event: ${event}`, session);
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [location.pathname]); // Re-fetch user on route change

  const handleLogout = async () => {
    try {
      // Clear localStorage token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token_expiry');

      // Also sign out from auth server
      await authClient.signOut();
      setUser(null);
      history.push(loginPath); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return null; // Don't render if not logged in
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '0 5px' }}>
      <span style={{ marginRight: '10px', color: 'var(--ifm-navbar-link-color)' }}>
        {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="button button--secondary button--sm"
        style={{ marginLeft: '5px' }}
      >
        Logout
      </button>
    </div>
  );
}

// Wrap the component to satisfy Docusaurus custom item type
function NavbarLogoutItem(props: any) {
  return <CustomLogoutButton />;
}

export default NavbarLogoutItem;
