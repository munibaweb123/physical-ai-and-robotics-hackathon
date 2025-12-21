import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translateContent } from '../services/translationService';
import { getUserTranslationPreferences, updateUserTranslationPreferences } from '../services/preferenceService';

// Define the shape of our translation context
interface TranslationContextType {
  isTranslated: boolean;
  isTranslating: boolean;
  translatedContent: string | null;
  originalContent: string | null;
  targetLanguage: string;
  error: string | null;
  translateChapter: (content: string, chapterId: string) => Promise<void>;
  toggleTranslation: () => void;
  resetTranslation: () => void;
  setError: (error: string | null) => void;
}

// Create the context with default values
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Props for the provider component
interface TranslationProviderProps {
  children: ReactNode;
}

// Translation provider component
export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>('ur');
  const [error, setError] = useState<string | null>(null);

  // Load user preferences on initial render
  useEffect(() => {
    const preferences = getUserTranslationPreferences();
    setTargetLanguage(preferences.targetLanguage);
  }, []);

  // Function to translate chapter content
  const translateChapter = async (content: string, chapterId: string) => {
    setIsTranslating(true);
    setError(null);
    setOriginalContent(content);

    try {
      const result = await translateContent({
        content,
        targetLanguage,
        chapterId
      });

      if (result.success && result.translatedContent) {
        setTranslatedContent(result.translatedContent);
        setIsTranslated(true);
      } else {
        setError(result.error || 'Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('An error occurred during translation');
    } finally {
      setIsTranslating(false);
    }
  };

  // Function to toggle between original and translated content
  const toggleTranslation = () => {
    setIsTranslated(!isTranslated);
  };

  // Function to reset translation state
  const resetTranslation = () => {
    setIsTranslated(false);
    setTranslatedContent(null);
    setOriginalContent(null);
    setError(null);
  };

  // Update error state
  const setErrorState = (error: string | null) => {
    setError(error);
  };

  // Context value to be provided to consumers
  const value: TranslationContextType = {
    isTranslated,
    isTranslating,
    translatedContent,
    originalContent,
    targetLanguage,
    error,
    translateChapter,
    toggleTranslation,
    resetTranslation,
    setError: setErrorState
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Component to wrap content that needs translation context
export const TranslationBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <TranslationProvider>{children}</TranslationProvider>;
};