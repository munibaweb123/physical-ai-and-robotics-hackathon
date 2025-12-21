import React from 'react';
import { AuthProvider } from '../lib/AuthContext';
import { TranslationBoundary } from '../contexts/TranslationContext';

// Default implementation, that you can customize
function Root({ children }) {
  return (
    <TranslationBoundary>
      <AuthProvider>{children}</AuthProvider>
    </TranslationBoundary>
  );
}

export default Root;
