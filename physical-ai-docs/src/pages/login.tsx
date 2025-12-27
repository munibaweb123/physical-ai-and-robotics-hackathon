import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient } from '../lib/auth-client';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '../lib/AuthContext'; // Import useAuth
import styles from './login.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const homePath = useBaseUrl('/');
  const registerPath = useBaseUrl('/register');
  const { refreshSession } = useAuth(); // Get refreshSession

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      console.log('🔐 Attempting login for:', email);

      // Use Better Auth's sign-in and extract session token
      const { authBaseUrl } = await import('../lib/auth-client');
      const response = await fetch(`${authBaseUrl}/api/auth/sign-in/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        setError(errorData.error || errorData.message || 'Login failed');
        return;
      }

      const result = await response.json();
      console.log('✓ Login successful for:', result.user?.email || email);

      // Store user
      if (result.user) {
        localStorage.setItem('auth_user', JSON.stringify(result.user));
      }

      // Token is injected into sign-in response by backend
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        const expiresAt = new Date(result.expiresAt).getTime();
        localStorage.setItem('auth_token_expiry', String(expiresAt));
        console.log('✓ Token stored from sign-in response');
      } else {
        console.warn('⚠️  No token in sign-in response');
      }

      // Manually trigger session refresh
      await refreshSession();

      // Redirect to home
      history.push(homePath);
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Layout title="Login" description="Login to your account">
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={styles.loginButton}>Login</button>
          </form>
          <p className={styles.signupLink}>
            Don't have an account? <a href={registerPath}>Register here</a>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default LoginPage;
