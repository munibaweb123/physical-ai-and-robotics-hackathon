import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { authClient, authBaseUrl } from '../lib/auth-client';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './login.module.css'; // Reusing login styles
import BackgroundQuestionForm from '../components/BackgroundQuestionForm';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showBackgroundForm, setShowBackgroundForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
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
      setRegistrationSuccess(true);
      setShowBackgroundForm(true); // Show background questions after successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleBackgroundSubmit = async (backgroundInfo: any) => {
    try {
      // Submit background information to the API
      const response = await fetch(`${authBaseUrl}/api/auth/user/background`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authClient.$getTokens().accessToken}`
        },
        body: JSON.stringify(backgroundInfo)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting background info:', errorData);
        // Optionally show error to user, but don't block the flow
      }

      // Redirect to home page after submitting background info
      history.push('/');
    } catch (err) {
      console.error('Error submitting background info:', err);
      // Redirect to home page even if background info submission failed
      history.push('/');
    }
  };

  const handleSkipBackground = () => {
    // Skip background questions and go to home page
    history.push('/');
  };

  if (registrationSuccess && showBackgroundForm) {
    return (
      <Layout title="Tell us about yourself" description="Help us personalize your experience">
        <main className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <h1>Almost there!</h1>
            <p>Just a few quick questions to personalize your experience:</p>
            <BackgroundQuestionForm
              onSubmit={handleBackgroundSubmit}
              onCancel={handleSkipBackground}
            />
          </div>
        </main>
      </Layout>
    );
  }

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
