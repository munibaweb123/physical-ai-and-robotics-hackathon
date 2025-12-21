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
        const { data: session } = await authClient.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, [location.pathname]); // Re-fetch user on route change

  const handleLogout = async () => {
    try {
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
