import { validateUserBackgroundInput, sanitizeUserBackgroundInput } from '../validation';

describe('Profile Update Validation', () => {
  test('should validate profile update input correctly', () => {
    const validUpdate = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode', 'intellij'],
      technicalSkills: ['javascript', 'react'],
      hardwareSpecs: 'Windows laptop with 16GB RAM'
    };

    const result = validateUserBackgroundInput(validUpdate);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should handle partial updates correctly', () => {
    // User might only update one field
    const partialUpdate = {
      softwareExperienceLevel: 'advanced'
    };

    const result = validateUserBackgroundInput(partialUpdate);
    // Should be valid since only required fields would be validated
    expect(result.isValid).toBe(true);
  });

  test('should sanitize profile update input', () => {
    const updateWithInvalidValues = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode', 'invalid_env', 'intellij'],
      technicalSkills: ['javascript', 'made_up_skill', 'react'],
      hardwareSpecs: 'A'.repeat(600) // Too long
    };

    const sanitized = sanitizeUserBackgroundInput(updateWithInvalidValues);

    // Valid values should remain
    expect(sanitized.softwareExperienceLevel).toBe('intermediate');
    expect(sanitized.hardwareExperienceLevel).toBe('beginner');

    // Environments and skills should remain as provided (validation is more permissive)
    expect(sanitized.preferredDevelopmentEnvironments).toContain('vscode');

    // Hardware specs should be truncated
    expect(sanitized.hardwareSpecs).toHaveLength(500);
  });

  test('should reject invalid experience levels', () => {
    const invalidUpdate = {
      softwareExperienceLevel: 'invalid_level',
      hardwareExperienceLevel: 'beginner'
    };

    const result = validateUserBackgroundInput(invalidUpdate);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'softwareExperienceLevel',
      message: expect.stringContaining('Must be one of:')
    });
  });
});

describe('Profile Update Sanitization', () => {
  test('should properly sanitize user inputs for profile updates', () => {
    const maliciousInput = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: Array(20).fill('vscode'), // Too many values
      technicalSkills: Array(100).fill('javascript'), // Too many values
      hardwareSpecs: '<script>alert("xss")</script> Windows laptop' // Potential XSS
    };

    const sanitized = sanitizeUserBackgroundInput(maliciousInput);

    // Should limit number of environments
    expect(sanitized.preferredDevelopmentEnvironments).toHaveLength(10);

    // Should limit number of skills
    expect(sanitized.technicalSkills).toHaveLength(50);

    // Should not remove potential script tags as we're storing as text
    // The frontend should handle XSS prevention when displaying
    expect(typeof sanitized.hardwareSpecs).toBe('string');
  });
});