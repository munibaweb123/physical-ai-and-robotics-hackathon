import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import { translateContent } from '../../services/translationService';
import { updateUserTranslationPreferences } from '../../services/preferenceService';
import styles from './styles.module.css';

interface TranslationToggleProps {
  chapterId: string;
  content: string;
  sourceLanguage?: string; // default: 'en'
  targetLanguage?: string; // default: 'ur'
  onTranslationStart?: () => void;
  onTranslationComplete?: (translatedContent: string) => void;
  onTranslationError?: (error: string) => void;
}

const TranslationToggle: React.FC<TranslationToggleProps> = ({
  chapterId,
  content,
  sourceLanguage = 'en',
  targetLanguage = 'ur',
  onTranslationStart,
  onTranslationComplete,
  onTranslationError
}) => {
  const {
    isTranslated,
    isTranslating,
    translatedContent,
    originalContent,
    translateChapter,
    toggleTranslation,
    setError,
    error
  } = useTranslation();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Set original content when component mounts
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [content, isInitialLoad]);

  const handleTranslateClick = async () => {
    if (onTranslationStart) onTranslationStart();

    try {
      await translateChapter(content, chapterId);

      // Update user preferences to indicate they've used translation
      updateUserTranslationPreferences({
        targetLanguage,
        autoTranslate: false // Don't auto-translate by default
      });

      if (onTranslationComplete && translatedContent) {
        onTranslationComplete(translatedContent);
      }

      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMsg);
      if (onTranslationError) {
        onTranslationError(errorMsg);
      }
    }
  };

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      setError(`Maximum retry attempts (${maxRetries}) reached. Please try again later.`);
      return;
    }

    setError(null); // Clear the error before retry
    setRetryCount(prev => prev + 1);

    if (onTranslationStart) onTranslationStart();

    try {
      await translateChapter(content, chapterId);

      // Update user preferences to indicate they've used translation
      updateUserTranslationPreferences({
        targetLanguage,
        autoTranslate: false // Don't auto-translate by default
      });

      if (onTranslationComplete && translatedContent) {
        onTranslationComplete(translatedContent);
      }

      // Reset retry count on success
      setRetryCount(0);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(`${errorMsg} (Retry attempt ${retryCount + 1}/${maxRetries})`);
      if (onTranslationError) {
        onTranslationError(errorMsg);
      }
    }
  };

  // Determine button text based on current state
  let buttonText = 'Translate to Urdu';
  if (isTranslating) {
    buttonText = 'Translating...';
  } else if (isTranslated) {
    buttonText = 'Show Original';
  }

  // Track translation start time to provide feedback for long operations
  const [translationStartTime, setTranslationStartTime] = useState<number | null>(null);
  const [showLongProcessNotice, setShowLongProcessNotice] = useState(false);

  // Effect to handle long translation notices
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTranslating && !translationStartTime) {
      // Set start time when translation begins
      setTranslationStartTime(Date.now());
      setShowLongProcessNotice(false); // Reset notice
    } else if (isTranslating && translationStartTime) {
      // Check if translation has been running for more than 1 second
      const elapsed = Date.now() - translationStartTime;
      if (elapsed > 1000 && !showLongProcessNotice) {
        setShowLongProcessNotice(true);
      }
    } else if (!isTranslating) {
      // Reset when not translating
      setTranslationStartTime(null);
      setShowLongProcessNotice(false);
    }

    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTranslating, translationStartTime, showLongProcessNotice]);

  return (
    <div className={styles.translationToggleContainer}>
      <button
        className={`${styles.translationToggleBtn} ${isTranslated ? styles.translated : ''}`}
        onClick={isTranslated ? toggleTranslation : handleTranslateClick}
        disabled={isTranslating}
        aria-label={isTranslated ? 'Show original content' : 'Translate content to Urdu'}
        title={isTranslated ? 'Show original content' : 'Translate to Urdu'}
      >
        {buttonText}
      </button>

      {/* Loading indicator */}
      {isTranslating && (
        <span className={styles.translationLoading}>
          <span className={styles.loadingDots}>•••</span>
        </span>
      )}

      {/* Long process notice */}
      {isTranslating && showLongProcessNotice && (
        <div className={styles.longProcessNotice}>
          <p>Translation in progress... This may take a moment.</p>
        </div>
      )}

      {/* Error display with retry option */}
      {error && !isTranslating && (
        <div className={styles.translationError}>
          <p>{error}</p>
          {retryCount < maxRetries && (
            <button
              className={styles.retryBtn}
              onClick={handleRetry}
              aria-label="Retry translation"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslationToggle;