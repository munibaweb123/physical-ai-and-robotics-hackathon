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

      // Use custom login endpoint that returns EdDSA token directly
      const { authBaseUrl } = await import('../lib/auth-client');
      const response = await fetch(`${authBaseUrl}/api/auth/login-with-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        setError(errorData.error || 'Login failed');
        return;
      }

      const result = await response.json();
      console.log('✓ Login successful with EdDSA token for:', result.user.email);

      // Store token in localStorage (works cross-domain!)
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_token_expiry', String(Date.now() + (result.expiresIn * 1000)));
      localStorage.setItem('auth_user', JSON.stringify(result.user));

      console.log('✓ Authentication token stored');

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
