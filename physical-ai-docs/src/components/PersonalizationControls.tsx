import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getChapterPersonalizationState } from '../services/personalization-service';

interface PersonalizationControlsProps {
  chapterId: string;
  onPersonalizationToggle?: (isActive: boolean) => void;
  className?: string;
}

interface UserPreferences {
  complexityLevel?: string;
  preferredExamples?: string[];
  focusAreas?: string[];
  enabledFeatures?: {
    adaptiveDifficulty?: boolean;
    customExamples?: boolean;
    terminologyAdjustment?: boolean;
  };
}

const PersonalizationControls: React.FC<PersonalizationControlsProps> = ({
  chapterId,
  onPersonalizationToggle,
  className = ''
}) => {
  const { session } = useAuth();
  const [chapterState, setChapterState] = useState({
    isActive: false,
    loading: false,
    error: null
  });
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [showControls, setShowControls] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      loadChapterState();
      loadUserPreferences();
    }
  }, [session?.accessToken, chapterId]);

  const loadChapterState = async () => {
    if (!session?.accessToken) return;

    try {
      const result = await getChapterPersonalizationState(chapterId);

      if (result.success) {
        setChapterState(prev => ({
          ...prev,
          isActive: result.isActive,
          loading: false
        }));
      } else {
        setChapterState(prev => ({
          ...prev,
          error: result.error || 'Failed to get chapter personalization state',
          loading: false
        }));
      }
    } catch (err: any) {
      setChapterState(prev => ({
        ...prev,
        error: err.message || 'Failed to get chapter personalization state',
        loading: false
      }));
    }
  };

  const loadUserPreferences = async () => {
    if (!session?.accessToken) return;

    try {
      setLoadingPrefs(true);
      const result = await getUserPreferences();

      if (result.success) {
        setPreferences(result);
      }
    } catch (err: any) {
      console.error('Error loading user preferences:', err);
    } finally {
      setLoadingPrefs(false);
    }
  };

  const togglePersonalization = async () => {
    if (!session?.accessToken) return;

    setChapterState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await toggleChapterPersonalization(
        chapterId,
        !chapterState.isActive,
        preferences
      );

      if (result.success) {
        setChapterState(prev => ({
          ...prev,
          isActive: !prev.isActive,
          loading: false
        }));
        onPersonalizationToggle?.(!chapterState.isActive);
      } else {
        setChapterState(prev => ({
          ...prev,
          error: result.error || 'Failed to toggle personalization',
          loading: false
        }));
      }
    } catch (err: any) {
      setChapterState(prev => ({
        ...prev,
        error: err.message || 'Failed to toggle personalization',
        loading: false
      }));
    }
  };

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handlePreferenceChange = (field: keyof UserPreferences, value: any) => {
    const updatedPrefs = { ...preferences, [field]: value };
    setPreferences(updatedPrefs);

    // Save the updated preference
    savePreferences(updatedPrefs);
  };

  const savePreferences = async (prefs: UserPreferences) => {
    if (!session?.accessToken) return;

    try {
      const result = await updateUserPreferences(prefs);
      if (!result.success) {
        console.error('Failed to save preferences:', result.error);
      }
    } catch (err: any) {
      console.error('Error saving preferences:', err);
    }
  };

  return (
    <div className={`personalization-controls ${className}`}>
      <div className="controls-header">
        <button
          className={`toggle-button ${chapterState.isActive ? 'active' : ''}`}
          onClick={togglePersonalization}
          disabled={chapterState.loading}
        >
          {chapterState.loading ? 'Loading...' :
           chapterState.isActive ? 'Disable Personalization' : 'Enable Personalization'}
        </button>

        <button
          className="settings-button"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? 'Hide Settings' : 'Show Settings'}
        </button>
      </div>

      {chapterState.error && (
        <div className="error-message">
          {chapterState.error}
        </div>
      )}

      {showControls && (
        <div className="settings-panel">
          <h4>Personalization Settings</h4>

          {loadingPrefs ? (
            <div className="loading-prefs">Loading preferences...</div>
          ) : (
            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="complexity-level">Complexity Level:</label>
                <select
                  id="complexity-level"
                  value={preferences.complexityLevel || 'intermediate'}
                  onChange={(e) => handlePreferenceChange('complexityLevel', e.target.value)}
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Enabled Features:</label>
                <div className="feature-toggles">
                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.enabledFeatures?.adaptiveDifficulty !== false}
                      onChange={(e) => {
                        const newFeatures = {
                          ...preferences.enabledFeatures,
                          adaptiveDifficulty: e.target.checked
                        };
                        handlePreferenceChange('enabledFeatures', newFeatures);
                      }}
                    />
                    Adaptive Difficulty
                  </label>

                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.enabledFeatures?.customExamples !== false}
                      onChange={(e) => {
                        const newFeatures = {
                          ...preferences.enabledFeatures,
                          customExamples: e.target.checked
                        };
                        handlePreferenceChange('enabledFeatures', newFeatures);
                      }}
                    />
                    Custom Examples
                  </label>

                  <label className="feature-toggle">
                    <input
                      type="checkbox"
                      checked={preferences.enabledFeatures?.terminologyAdjustment !== false}
                      onChange={(e) => {
                        const newFeatures = {
                          ...preferences.enabledFeatures,
                          terminologyAdjustment: e.target.checked
                        };
                        handlePreferenceChange('enabledFeatures', newFeatures);
                      }}
                    />
                    Terminology Adjustment
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .personalization-controls {
          max-width: 600px;
          margin: 1rem 0;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fafafa;
        }

        .controls-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .toggle-button {
          padding: 0.5rem 1rem;
          border: 1px solid #007cba;
          border-radius: 4px;
          background-color: #007cba;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .toggle-button:hover:not(:disabled) {
          background-color: #005a87;
        }

        .toggle-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .toggle-button.active {
          background-color: #2e7d32;
          border-color: #2e7d32;
        }

        .toggle-button.active:hover:not(:disabled) {
          background-color: #1b5e20;
        }

        .settings-button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .settings-button:hover {
          background-color: #f0f0f0;
        }

        .error-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
        }

        .settings-panel {
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }

        .settings-panel h4 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #333;
        }

        .loading-prefs {
          padding: 0.5rem;
          color: #666;
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-weight: 600;
          color: #333;
        }

        select {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .feature-toggles {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feature-toggle {
          display: flex;
          align-items: center;
          font-weight: normal;
          cursor: pointer;
        }

        .feature-toggle input {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default PersonalizationControls;