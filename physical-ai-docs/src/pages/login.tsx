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

      // Wait a bit for session cookie to be set
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('🔄 Refreshing session...');
      await refreshSession(); // Refresh session state in context
      console.log('✓ Session refreshed');

      // Verify session was actually set
      const { data: sessionCheck } = await authClient.getSession();
      console.log('📋 Session check:', sessionCheck);

      history.push(homePath); // Redirect to home on successful login
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
