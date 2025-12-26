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
      const result = await authClient.signIn.email({ email, password });
      console.log('✓ Login successful, result:', result);

      // Extract session token from login response (Better Auth bearer plugin)
      const sessionToken = result.data?.session?.token;
      console.log('Session token from login:', sessionToken ? '✓ Found' : '❌ Not found');

      if (!sessionToken) {
        console.error('❌ No session token in login response');
        setError('Login succeeded but no session token received');
        return;
      }

      // Use session token to fetch EdDSA token (avoiding cross-site cookie issues)
      console.log('🔑 Fetching EdDSA token for authentication...');
      const { authBaseUrl } = await import('../lib/auth-client');
      const tokenResponse = await fetch(`${authBaseUrl}/api/auth/token/eddsa`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}` // Use session token as Bearer token
        }
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('✓ EdDSA token received');

        // Store token in localStorage (works cross-domain!)
        localStorage.setItem('auth_token', tokenData.token);
        localStorage.setItem('auth_token_expiry', String(Date.now() + (tokenData.expiresIn * 1000)));

        // Also store user info
        if (result.data?.user) {
          localStorage.setItem('auth_user', JSON.stringify(result.data.user));
        }

        console.log('✓ Authentication token stored');

        // Manually trigger session refresh
        await refreshSession();

        // Redirect to home
        history.push(homePath);
      } else {
        const errorText = await tokenResponse.text();
        console.error('❌ Failed to get auth token:', tokenResponse.status, errorText);
        setError('Login succeeded but failed to get authentication token');
      }
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
