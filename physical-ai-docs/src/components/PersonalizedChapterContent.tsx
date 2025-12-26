import React, { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getPersonalizedChapterContent, getChapterPersonalizationState } from '../services/personalization-service';
import { getEddsaToken } from '../lib/token-utils';

interface PersonalizedChapterContentProps {
  chapterId: string;
  children: ReactNode;
  onPersonalizationChange?: (isActive: boolean) => void;
}

const PersonalizedChapterContent: React.FC<PersonalizedChapterContentProps> = ({
  chapterId,
  children,
  onPersonalizationChange
}) => {
  const { session, isLoading: authLoading } = useAuth();
  const [isPersonalizationActive, setIsPersonalizationActive] = useState<boolean>(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adaptationsApplied, setAdaptationsApplied] = useState<string[]>([]);
  const [relevanceScore, setRelevanceScore] = useState<number>(0);

  // Load personalization state and content
  useEffect(() => {
    loadPersonalizationContent();
  }, [session, chapterId]);

  const loadPersonalizationContent = async () => {
    setIsLoading(true);
    setError(null);

    // If not authenticated, show original content
    if (!session) {
      setIsPersonalizationActive(false);
      setPersonalizedContent(null);
      setIsLoading(false);
      return;
    }

    // Check if we have an EdDSA token
    const token = await getEddsaToken();
    if (!token) {
      console.log('No EdDSA token available for personalized content');
      setIsPersonalizationActive(false);
      setPersonalizedContent(null);
      setIsLoading(false);
      return;
    }

    try {
      // First, check if personalization is active for this chapter
      const stateResult = await getChapterPersonalizationState(chapterId);

      console.log('🔍 Personalization state result:', stateResult);
      console.log('🔍 stateResult.success:', stateResult.success);
      console.log('🔍 stateResult.isActive:', stateResult.isActive);

      if (stateResult.success && stateResult.isActive) {
        console.log('✅ Personalization is active, fetching personalized content...');
        setIsPersonalizationActive(true);
        onPersonalizationChange?.(true);

        // Fetch personalized content
        const contentResult = await getPersonalizedChapterContent(chapterId);
        console.log('📦 Content result:', contentResult);

        if (contentResult.success && contentResult.adaptedContent) {
          console.log('✅ Got personalized content, displaying purple banner');
          setPersonalizedContent(contentResult.adaptedContent);
          setAdaptationsApplied(contentResult.adaptationsApplied || []);
          setRelevanceScore(contentResult.relevanceScore || 0);
        } else {
          console.warn('⚠️ Content fetch failed or no adaptedContent:', contentResult.error);
          // If fetching personalized content fails, fall back to original
          setError(contentResult.error || 'Failed to load personalized content');
          setPersonalizedContent(null);
        }
      } else {
        console.log('❌ Personalization not active - success:', stateResult.success, 'isActive:', stateResult.isActive);
        // Personalization is not active, show original content
        setIsPersonalizationActive(false);
        setPersonalizedContent(null);
        onPersonalizationChange?.(false);
      }
    } catch (err: any) {
      console.error('Error loading personalized content:', err);
      setError(err.message || 'An error occurred while loading personalized content');
      setIsPersonalizationActive(false);
      setPersonalizedContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose reload function that can be called from parent components
  React.useEffect(() => {
    // Store reload function in window for external triggers
    (window as any).reloadPersonalizedContent = loadPersonalizationContent;
    return () => {
      delete (window as any).reloadPersonalizedContent;
    };
  }, [chapterId, session]);

  // If still loading auth or content, show loading state
  if (authLoading || isLoading) {
    return (
      <div className="personalized-content-loading">
        <div className="loading-spinner">
          <span>Loading content...</span>
        </div>
        {children}
        <style>{`
          .personalized-content-loading {
            position: relative;
          }
          .loading-spinner {
            padding: 1rem;
            text-align: center;
            background-color: #f0f8ff;
            border: 1px solid #b3d7ff;
            border-radius: 4px;
            margin-bottom: 1rem;
            color: #004085;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  // If there's an error, show error message but display original content
  if (error) {
    return (
      <div className="personalized-content-error">
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">
            Unable to load personalized content. Showing original version.
          </span>
        </div>
        {children}
        <style>{`
          .personalized-content-error {
            position: relative;
          }
          .error-banner {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: #856404;
          }
          .error-icon {
            font-size: 1.2rem;
          }
        `}</style>
      </div>
    );
  }

  // If personalization is active and we have personalized content, show it
  if (isPersonalizationActive && personalizedContent) {
    return (
      <div className="personalized-content-wrapper">
        <div className="personalization-banner">
          <div className="banner-content">
            <span className="banner-icon">✨</span>
            <div className="banner-text">
              <strong>Personalized Content</strong>
              <span className="banner-subtitle">
                This content has been adapted to match your experience level and preferences
              </span>
            </div>
          </div>
          {adaptationsApplied.length > 0 && (
            <div className="adaptations-list">
              <span className="adaptations-label">Adaptations applied:</span>
              <div className="adaptations-tags">
                {adaptationsApplied.map((adaptation, index) => (
                  <span key={index} className="adaptation-tag">
                    {adaptation}
                  </span>
                ))}
              </div>
            </div>
          )}
          {relevanceScore > 0 && (
            <div className="relevance-score">
              <span className="score-label">Relevance Score:</span>
              <span className="score-value">{Math.round(relevanceScore * 100)}%</span>
            </div>
          )}
        </div>

        <div
          className="personalized-content markdown"
          dangerouslySetInnerHTML={{ __html: personalizedContent }}
        />

        <style>{`
          .personalized-content-wrapper {
            position: relative;
          }

          .personalization-banner {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.25rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .banner-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .banner-icon {
            font-size: 1.5rem;
          }

          .banner-text {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .banner-subtitle {
            font-size: 0.875rem;
            opacity: 0.9;
          }

          .adaptations-list {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
          }

          .adaptations-label {
            font-size: 0.875rem;
            font-weight: 600;
            display: block;
            margin-bottom: 0.5rem;
          }

          .adaptations-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .adaptation-tag {
            background-color: rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .relevance-score {
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
          }

          .score-label {
            font-weight: 600;
          }

          .score-value {
            background-color: rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .personalized-content {
            /* Inherit markdown styles from Docusaurus theme */
          }

          @media (max-width: 768px) {
            .personalization-banner {
              padding: 0.875rem 1rem;
            }

            .banner-content {
              flex-direction: column;
              align-items: flex-start;
            }

            .adaptations-tags {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    );
  }

  // Otherwise, show original content
  return <>{children}</>;
};

export default PersonalizedChapterContent;
