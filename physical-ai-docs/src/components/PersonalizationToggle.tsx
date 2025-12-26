import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { submitBackgroundInfo, fetchBackgroundInfo } from '../services/background-service';
import { getEddsaToken } from '../lib/token-utils';

interface PersonalizationToggleProps {
  chapterId: string;
  onToggle?: (active: boolean) => void;
  className?: string;
}

const PersonalizationToggle: React.FC<PersonalizationToggleProps> = ({
  chapterId,
  onToggle,
  className = ''
}) => {
  const { session, isLoading: authLoading } = useAuth();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasBackgroundInfo, setHasBackgroundInfo] = useState<boolean>(false);

  useEffect(() => {
    if (session?.accessToken || (session as any)?.token) {
      loadPersonalizationState();
    }
  }, [session, chapterId]);

  const loadPersonalizationState = async () => {
    setIsLoading(true);
    try {
      // Get current personalization state for this chapter
      const personalizationState = await fetchBackgroundInfo();

      if (personalizationState.success) {
        setIsActive(personalizationState.isActive || false);
        // Check if user has provided background info
        setHasBackgroundInfo(!!(
          personalizationState.softwareExperienceLevel ||
          personalizationState.hardwareExperienceLevel ||
          personalizationState.technicalSkills?.length > 0
        ));
      } else {
        // Default to false if we can't get the state
        setIsActive(false);
        setHasBackgroundInfo(false);
      }
    } catch (error) {
      console.error('Error loading personalization state:', error);
      setIsActive(false);
      setHasBackgroundInfo(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!session) {
      alert('You must be logged in to enable personalization.');
      return;
    }

    const newActiveState = !isActive;
    setIsLoading(true);

    try {
      // Check if we have an EdDSA token
      const token = await getEddsaToken();
      if (!token) {
        alert('Authentication required. Please log in again.');
        window.location.href = '/login';
        return;
      }

      if (newActiveState && !hasBackgroundInfo) {
        // If user doesn't have background info, redirect to profile to add it
        window.location.href = '/profile';
        return;
      }

      // Import the personalization service
      const { toggleChapterPersonalization } = await import('../services/personalization-service');

      // Call the API to toggle personalization for this chapter
      const result = await toggleChapterPersonalization(chapterId, newActiveState);

      if (result.success) {
        setIsActive(newActiveState);
        onToggle?.(newActiveState);

        // Trigger content reload in PersonalizedChapterContent component
        if (typeof (window as any).reloadPersonalizedContent === 'function') {
          await (window as any).reloadPersonalizedContent();
        }
      } else {
        console.error('Failed to update personalization state:', result.error);
        console.error('Full result object:', result);
        alert(`Failed to update personalization state: ${result.error || 'Unknown error'}. Check console for details.`);
      }
    } catch (error) {
      console.error('Error toggling personalization:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={`personalization-toggle ${className}`}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`personalization-toggle ${className}`}>
        <p>Please log in to enable content personalization.</p>
      </div>
    );
  }

  return (
    <div className={`personalization-toggle ${className}`}>
      <div className="toggle-container">
        <label htmlFor="personalization-toggle" className="toggle-label">
          Personalize this content
        </label>
        <button
          id="personalization-toggle"
          className={`toggle-button ${isActive ? 'active' : 'inactive'}`}
          onClick={handleToggle}
          disabled={isLoading}
          aria-pressed={isActive}
          title={isActive ? 'Personalization is active' : 'Personalization is inactive'}
        >
          {isLoading ? (
            <span className="loading-spinner">Loading...</span>
          ) : (
            <>
              <span className="toggle-switch"></span>
              <span className="toggle-text">
                {isActive ? 'ON' : 'OFF'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Visual indicator showing personalization status */}
      <div className={`status-indicator ${isActive ? 'active' : 'inactive'}`}>
        {isActive ? (
          <div className="active-indicator">
            <span className="icon">✓</span>
            <span className="status-text">Content is personalized based on your profile</span>
          </div>
        ) : (
          <div className="inactive-indicator">
            <span className="icon">○</span>
            <span className="status-text">Content displayed in default mode</span>
          </div>
        )}
      </div>

      {!hasBackgroundInfo && isActive && (
        <div className="info-message">
          <p>You haven't provided background information yet. <a href="/profile">Add your background info</a> to get personalized content.</p>
        </div>
      )}

      {/* Additional information about personalization when active */}
      {isActive && (
        <div className="personalization-info">
          <p>Based on your profile, content is adapted to match your experience level and preferences.</p>
        </div>
      )}

      <style>{`
        .personalization-toggle {
          margin: 1rem 0;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .toggle-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toggle-label {
          font-weight: 600;
          color: #333;
        }

        .toggle-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 2px solid #007cba;
          border-radius: 20px;
          background-color: white;
          color: #007cba;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          min-height: 2.5rem;
        }

        .toggle-button:hover:not(:disabled) {
          background-color: #e6f0fa;
        }

        .toggle-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .toggle-button.active {
          background-color: #007cba;
          color: white;
        }

        .toggle-button.active:hover:not(:disabled) {
          background-color: #005a87;
        }

        .toggle-switch {
          display: inline-block;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          border: 2px solid currentColor;
          position: relative;
        }

        .toggle-button.active .toggle-switch {
          background-color: currentColor;
        }

        .toggle-text {
          font-size: 0.875rem;
        }

        .loading-spinner {
          font-size: 0.875rem;
        }

        .status-indicator {
          margin-top: 0.75rem;
          padding: 0.5rem;
          border-radius: 4px;
        }

        .status-indicator.active {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
        }

        .status-indicator.inactive {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .active-indicator, .inactive-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .active-indicator .icon {
          color: #28a745;
        }

        .inactive-indicator .icon {
          color: #6c757d;
        }

        .status-text {
          font-size: 0.875rem;
          color: #495057;
        }

        .info-message {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .info-message a {
          color: #007cba;
          text-decoration: underline;
        }

        .personalization-info {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background-color: #e7f3ff;
          border: 1px solid #b3d7ff;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #004085;
        }
      `}</style>
    </div>
  );
};

export default PersonalizationToggle;