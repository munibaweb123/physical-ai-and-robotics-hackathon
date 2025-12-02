import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient } from '../lib/auth-client';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './login.module.css'; // Reusing login styles

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const loginPath = useBaseUrl('/login');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authClient.signUp.email({ 
        email, 
        password, 
        name: email.split('@')[0] // Basic name generation
      });
      history.push(loginPath); // Redirect to login on successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <Layout title="Register" description="Create a new account">
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
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
            <button type="submit" className={styles.loginButton}>Register</button>
          </form>
          <p className={styles.signupLink}>
            Already have an account? <a href={loginPath}>Login here</a>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default RegisterPage;
