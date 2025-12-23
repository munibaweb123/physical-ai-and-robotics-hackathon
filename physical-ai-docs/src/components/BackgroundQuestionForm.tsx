import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

interface BackgroundQuestionFormProps {
  onSubmit: (backgroundInfo: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

const BackgroundQuestionForm: React.FC<BackgroundQuestionFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const { session, user } = useAuth();
  const [formData, setFormData] = useState({
    softwareExperienceLevel: initialData.softwareExperienceLevel || '',
    hardwareExperienceLevel: initialData.hardwareExperienceLevel || '',
    preferredDevelopmentEnvironments: initialData.preferredDevelopmentEnvironments || [],
    technicalSkills: initialData.technicalSkills || [],
    hardwareSpecs: initialData.hardwareSpecs || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const experienceLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const devEnvironments = [
    'vscode', 'intellij', 'pycharm', 'webstorm', 'vim', 'emacs',
    'sublime', 'atom', 'visualstudio', 'xcode', 'eclipse', 'netbeans'
  ];
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'csharp', 'cpp', 'c',
    'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'express', 'fastapi',
    'nodejs', 'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'git', 'github', 'gitlab', 'linux', 'bash'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const currentValues = [...formData[name as keyof typeof formData] as string[]];
      if (checkbox.checked) {
        if (!currentValues.includes(value)) {
          currentValues.push(value);
        }
      } else {
        const index = currentValues.indexOf(value);
        if (index > -1) {
          currentValues.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        [name]: currentValues
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.softwareExperienceLevel) {
      newErrors.softwareExperienceLevel = 'Software experience level is required';
    } else if (!experienceLevels.includes(formData.softwareExperienceLevel)) {
      newErrors.softwareExperienceLevel = 'Please select a valid experience level';
    }

    if (!formData.hardwareExperienceLevel) {
      newErrors.hardwareExperienceLevel = 'Hardware experience level is required';
    } else if (!experienceLevels.includes(formData.hardwareExperienceLevel)) {
      newErrors.hardwareExperienceLevel = 'Please select a valid experience level';
    }

    // Validate hardware specs length
    if (formData.hardwareSpecs && formData.hardwareSpecs.length > 500) {
      newErrors.hardwareSpecs = 'Hardware specs must be less than 500 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Run validation
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit the background information
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting background information:', error);
      setErrors({ submit: 'Failed to submit background information. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to adapt content based on personalization state
  const adaptContent = (content: string, personalizationState: PersonalizationState | null): string => {
    if (!personalizationState?.isActive) return content;

    let adaptedContent = content;

    // Apply complexity adjustments
    if (personalizationState.overrideSettings?.complexityLevel === 'beginner' ||
        personalizationState.userProfile?.softwareExperienceLevel === 'beginner') {
      adaptedContent = adaptedContent
        .replace(/\balgorithm\b/gi, 'process')
        .replace(/\bcomplexity\b/gi, 'difficulty')
        .replace(/\bimplementation\b/gi, 'way to do it');
    } else if (personalizationState.overrideSettings?.complexityLevel === 'advanced' ||
               personalizationState.userProfile?.softwareExperienceLevel === 'advanced') {
      adaptedContent = adaptedContent + '\n\n*Advanced note: This concept can be implemented using more sophisticated approaches...';
    }

    // Apply example substitutions based on user's technical skills
    if (personalizationState.overrideSettings?.preferredExamples || personalizationState.userProfile?.technicalSkills) {
      const preferredExamples = personalizationState.overrideSettings?.preferredExamples || personalizationState.userProfile?.technicalSkills || [];
      for (const example of preferredExamples) {
        // This is a simplified example - in reality, you'd have more sophisticated content replacement logic
        adaptedContent = adaptedContent.replace(
          new RegExp(`\\b(example|demo|sample)\\b`, 'gi'),
          `$1 using ${example}`
        );
      }
    }

    return adaptedContent;
  };

  return (
    <div className="background-question-form">
      <h3>Tell us about your background</h3>
      <p className="form-description">
        Help us personalize your experience by sharing your software and hardware background.
      </p>

      <div className="privacy-notice">
        <p><strong>Privacy Notice:</strong> The information you provide will be used solely to personalize your experience and recommend relevant content.
        We do not share this information with third parties. You can update or remove this information at any time from your profile settings.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="softwareExperienceLevel">
            Your software development experience level:
          </label>
          <select
            id="softwareExperienceLevel"
            name="softwareExperienceLevel"
            value={formData.softwareExperienceLevel}
            onChange={handleInputChange}
            className={errors.softwareExperienceLevel ? 'error' : ''}
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          {errors.softwareExperienceLevel && (
            <div className="error-message">{errors.softwareExperienceLevel}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="hardwareExperienceLevel">
            Your hardware knowledge and experience level:
          </label>
          <select
            id="hardwareExperienceLevel"
            name="hardwareExperienceLevel"
            value={formData.hardwareExperienceLevel}
            onChange={handleInputChange}
            className={errors.hardwareExperienceLevel ? 'error' : ''}
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          {errors.hardwareExperienceLevel && (
            <div className="error-message">{errors.hardwareExperienceLevel}</div>
          )}
        </div>

        <div className="form-group">
          <label>
            Preferred development environments (check all that apply):
          </label>
          <div className="checkbox-group">
            {devEnvironments.map(env => (
              <label key={env} className="checkbox-label">
                <input
                  type="checkbox"
                  name="preferredDevelopmentEnvironments"
                  value={env}
                  checked={formData.preferredDevelopmentEnvironments.includes(env)}
                  onChange={handleInputChange}
                />
                {env}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            Technical skills (check all that apply):
          </label>
          <div className="checkbox-group">
            {commonSkills.map(skill => (
              <label key={skill} className="checkbox-label">
                <input
                  type="checkbox"
                  name="technicalSkills"
                  value={skill}
                  checked={formData.technicalSkills.includes(skill)}
                  onChange={handleInputChange}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="hardwareSpecs">
            Tell us about your current hardware setup:
          </label>
          <input
            type="text"
            id="hardwareSpecs"
            name="hardwareSpecs"
            value={formData.hardwareSpecs}
            onChange={handleInputChange}
            placeholder="e.g., Windows laptop, MacBook Pro, Linux desktop..."
          />
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Save & Continue'}
          </button>
        </div>

        {errors.submit && (
          <div className="error-message global-error">{errors.submit}</div>
        )}
      </form>

      <style>{`
        .background-question-form {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background-color: #fff;
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
          font-weight: bold;
        }

        select, input[type="text"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        select.error, input.error {
          border-color: #e74c3c;
        }

        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          font-weight: normal;
          cursor: pointer;
        }

        .checkbox-label input {
          margin-right: 0.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        .cancel-button, .submit-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }

        .cancel-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .submit-button {
          background-color: #007cba;
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #005a87;
        }

        .submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .global-error {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
        }

        .privacy-notice {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-left: 4px solid #007cba;
          border-radius: 4px;
        }

        .privacy-notice p {
          margin: 0;
          font-size: 0.875rem;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default BackgroundQuestionForm;