import React, { useState } from 'react';
import { updateBackgroundInfo } from '../services/background-service';

interface BackgroundInfo {
  softwareExperienceLevel?: string;
  hardwareExperienceLevel?: string;
  preferredDevelopmentEnvironments?: string[];
  technicalSkills?: string[];
  hardwareSpecs?: string;
}

interface BackgroundInfoEditFormProps {
  initialData: BackgroundInfo;
  onUpdate: (updatedInfo: BackgroundInfo) => void;
}

const BackgroundInfoEditForm: React.FC<BackgroundInfoEditFormProps> = ({
  initialData = {},
  onUpdate
}) => {
  const [formData, setFormData] = useState<BackgroundInfo>({
    softwareExperienceLevel: initialData.softwareExperienceLevel || '',
    hardwareExperienceLevel: initialData.hardwareExperienceLevel || '',
    preferredDevelopmentEnvironments: initialData.preferredDevelopmentEnvironments || [],
    technicalSkills: initialData.technicalSkills || [],
    hardwareSpecs: initialData.hardwareSpecs || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const currentValues = [...(formData[name as keyof BackgroundInfo] as string[]) || []];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrors({});

    try {
      // Validate required fields
      const newErrors: Record<string, string> = {};
      if (!formData.softwareExperienceLevel) {
        newErrors.softwareExperienceLevel = 'Software experience level is required';
      }
      if (!formData.hardwareExperienceLevel) {
        newErrors.hardwareExperienceLevel = 'Hardware experience level is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Update the background information
      const response = await updateBackgroundInfo(formData);

      if (response.success) {
        setMessage('Background information updated successfully!');
        onUpdate(formData);
      } else {
        setErrors({ submit: response.error || 'Failed to update background information' });
      }
    } catch (error: any) {
      console.error('Error updating background information:', error);
      setErrors({ submit: error.message || 'An error occurred while updating background information' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="background-info-edit-form">
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
                  checked={formData.preferredDevelopmentEnvironments?.includes(env) || false}
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
                  checked={formData.technicalSkills?.includes(skill) || false}
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
          <textarea
            id="hardwareSpecs"
            name="hardwareSpecs"
            value={formData.hardwareSpecs || ''}
            onChange={handleInputChange}
            placeholder="e.g., Windows laptop, MacBook Pro, Linux desktop..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Updating...' : 'Update Background Info'}
          </button>
        </div>

        {errors.submit && (
          <div className="error-message global-error">{errors.submit}</div>
        )}

        {message && (
          <div className="success-message">{message}</div>
        )}
      </form>

      <style>{`
        .background-info-edit-form {
          margin-top: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        select, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        select.error, textarea.error {
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
          font-size: 0.9rem;
        }

        .checkbox-label input {
          margin-right: 0.5rem;
        }

        .form-actions {
          margin-top: 1.5rem;
        }

        .submit-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
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

        .success-message {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #e8f5e8;
          border: 1px solid #c3e6c3;
          border-radius: 4px;
          color: #155724;
        }
      `}</style>
    </div>
  );
};

export default BackgroundInfoEditForm;