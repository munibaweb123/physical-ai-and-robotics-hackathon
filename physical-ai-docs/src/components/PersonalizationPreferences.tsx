import React, { useState, useEffect } from 'react';
import { useAuth } from 'better-auth/react';
import { getUserPreferences, updateUserPreferences } from '../services/personalization-service';

interface PersonalizationPreferencesProps {
  onSave?: (preferences: any) => void;
  onCancel?: () => void;
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

const PersonalizationPreferences: React.FC<PersonalizationPreferencesProps> = ({
  onSave,
  onCancel,
  className = ''
}) => {
  const { session } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    complexityLevel: 'intermediate',
    preferredExamples: [],
    focusAreas: [],
    enabledFeatures: {
      adaptiveDifficulty: true,
      customExamples: true,
      terminologyAdjustment: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const exampleTypes = [
    { value: 'practical', label: 'Practical Applications' },
    { value: 'theoretical', label: 'Theoretical Concepts' },
    { value: 'case-studies', label: 'Case Studies' },
    { value: 'tutorials', label: 'Step-by-Step Tutorials' },
    { value: 'demos', label: 'Live Demos' }
  ];

  const focusAreas = [
    { value: 'software', label: 'Software Development' },
    { value: 'hardware', label: 'Hardware & Infrastructure' },
    { value: 'theory', label: 'Conceptual Theory' },
    { value: 'practice', label: 'Hands-on Practice' },
    { value: 'performance', label: 'Performance & Optimization' },
    { value: 'security', label: 'Security & Privacy' }
  ];

  useEffect(() => {
    if (session?.accessToken) {
      loadPreferences();
    }
  }, [session?.accessToken]);

  const loadPreferences = async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const result = await getUserPreferences();

      if (result.success) {
        setPreferences({
          complexityLevel: result.complexityLevel || 'intermediate',
          preferredExamples: result.preferredExamples || [],
          focusAreas: result.focusAreas || [],
          enabledFeatures: result.enabledFeatures || {
            adaptiveDifficulty: true,
            customExamples: true,
            terminologyAdjustment: false
          }
        });
      } else {
        console.error('Error loading preferences:', result.error);
        // Set default preferences if loading fails
        setPreferences({
          complexityLevel: 'intermediate',
          preferredExamples: [],
          focusAreas: [],
          enabledFeatures: {
            adaptiveDifficulty: true,
            customExamples: true,
            terminologyAdjustment: false
          }
        });
      }
    } catch (err: any) {
      console.error('Error loading user preferences:', err);
      setError(err.message || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setPreferences(prev => ({
      ...prev,
      enabledFeatures: {
        ...prev.enabledFeatures,
        [feature]: !prev.enabledFeatures?.[feature]
      }
    }));
  };

  const handleExampleToggle = (example: string) => {
    setPreferences(prev => {
      const currentExamples = prev.preferredExamples || [];
      if (currentExamples.includes(example)) {
        return {
          ...prev,
          preferredExamples: currentExamples.filter(e => e !== example)
        };
      } else {
        return {
          ...prev,
          preferredExamples: [...currentExamples, example]
        };
      }
    });
  };

  const handleFocusAreaToggle = (area: string) => {
    setPreferences(prev => {
      const currentAreas = prev.focusAreas || [];
      if (currentAreas.includes(area)) {
        return {
          ...prev,
          focusAreas: currentAreas.filter(a => a !== area)
        };
      } else {
        return {
          ...prev,
          focusAreas: [...currentAreas, area]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const result = await updateUserPreferences(preferences);

      if (result.success) {
        setSuccess(true);
        onSave?.(preferences);
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to save preferences');
      }
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setError(err.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`personalization-preferences ${className}`}>
        <div className="loading">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className={`personalization-preferences ${className}`}>
      <h3>Personalization Preferences</h3>
      <p className="form-description">
        Customize how content is adapted to your learning style and preferences.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="complexity-level">Content Complexity Level:</label>
          <select
            id="complexity-level"
            value={preferences.complexityLevel || 'intermediate'}
            onChange={(e) => handlePreferenceChange('complexityLevel', e.target.value)}
            className="complexity-select"
          >
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Example Types:</label>
          <div className="checkbox-group">
            {exampleTypes.map(example => (
              <label key={example.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={(preferences.preferredExamples || []).includes(example.value)}
                  onChange={() => handleExampleToggle(example.value)}
                />
                {example.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Focus Areas:</label>
          <div className="checkbox-group">
            {focusAreas.map(area => (
              <label key={area.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={(preferences.focusAreas || []).includes(area.value)}
                  onChange={() => handleFocusAreaToggle(area.value)}
                />
                {area.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Enabled Features:</label>
          <div className="feature-toggles">
            <label className="feature-toggle">
              <input
                type="checkbox"
                checked={preferences.enabledFeatures?.adaptiveDifficulty}
                onChange={() => handleFeatureToggle('adaptiveDifficulty')}
              />
              Adaptive Difficulty Adjustment
            </label>

            <label className="feature-toggle">
              <input
                type="checkbox"
                checked={preferences.enabledFeatures?.customExamples}
                onChange={() => handleFeatureToggle('customExamples')}
              />
              Custom Example Substitution
            </label>

            <label className="feature-toggle">
              <input
                type="checkbox"
                checked={preferences.enabledFeatures?.terminologyAdjustment}
                onChange={() => handleFeatureToggle('terminologyAdjustment')}
              />
              Terminology Adjustment
            </label>
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={saving}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .personalization-preferences {
          max-width: 600px;
          margin: 1rem 0;
          padding: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fafafa;
        }

        .form-description {
          margin-bottom: 1.5rem;
          color: #666;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .complexity-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          font-weight: normal;
          cursor: pointer;
        }

        .checkbox-label input {
          margin-right: 0.75rem;
        }

        .feature-toggles {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-toggle {
          display: flex;
          align-items: center;
          font-weight: normal;
          cursor: pointer;
        }

        .feature-toggle input {
          margin-right: 0.75rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-button, .save-button {
          padding: 0.75rem 1.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }

        .cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .save-button {
          background-color: #007cba;
          color: white;
          border-color: #007cba;
        }

        .save-button:hover:not(:disabled) {
          background-color: #005a87;
        }

        .cancel-button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }

        .save-button:disabled, .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
        }

        .success-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background-color: #efe;
          border: 1px solid #cfc;
          border-radius: 4px;
          color: #363;
        }

        .loading {
          padding: 1rem;
          text-align: center;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default PersonalizationPreferences;