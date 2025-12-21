import { validateUserBackgroundInput, sanitizeUserBackgroundInput } from '../validation';

describe('Background Information Validation', () => {
  test('should validate valid background information', () => {
    const validInput = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode', 'intellij'],
      technicalSkills: ['javascript', 'react'],
      hardwareSpecs: 'Windows laptop'
    };

    const result = validateUserBackgroundInput(validInput);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject invalid experience levels', () => {
    const invalidInput = {
      softwareExperienceLevel: 'invalid_level',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode'],
      technicalSkills: ['javascript'],
      hardwareSpecs: 'Windows laptop'
    };

    const result = validateUserBackgroundInput(invalidInput);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'softwareExperienceLevel',
      message: expect.stringContaining('Must be one of:')
    });
  });

  test('should reject hardware specs that are too long', () => {
    const longSpecs = 'a'.repeat(600); // 600 characters, exceeding the 500 limit
    const invalidInput = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode'],
      technicalSkills: ['javascript'],
      hardwareSpecs: longSpecs
    };

    const result = validateUserBackgroundInput(invalidInput);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'hardwareSpecs',
      message: 'Hardware specs must be less than 500 characters'
    });
  });

  test('should handle undefined values gracefully', () => {
    const input = {
      softwareExperienceLevel: undefined,
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: undefined,
      technicalSkills: undefined,
      hardwareSpecs: undefined
    };

    const result = validateUserBackgroundInput(input);
    // Should be valid since all fields are optional except we're not requiring them
    expect(result.isValid).toBe(true);
  });
});

describe('Background Information Sanitization', () => {
  test('should sanitize input correctly', () => {
    const input = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode', 'intellij', 'invalid_env'],
      technicalSkills: ['javascript', 'react', 'nodejs'],
      hardwareSpecs: 'Windows laptop with lots of specs'
    };

    const result = sanitizeUserBackgroundInput(input);
    expect(result.softwareExperienceLevel).toBe('intermediate');
    expect(result.hardwareExperienceLevel).toBe('beginner');
    expect(result.preferredDevelopmentEnvironments).toEqual(['vscode', 'intellij', 'invalid_env']);
    expect(result.technicalSkills).toEqual(['javascript', 'react', 'nodejs']);
    expect(result.hardwareSpecs).toBe('Windows laptop with lots of specs');
  });

  test('should limit the number of environments and skills', () => {
    const input = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: Array(20).fill('vscode'), // 20 items, should be limited to 10
      technicalSkills: Array(100).fill('javascript'), // 100 items, should be limited to 50
      hardwareSpecs: 'Windows laptop'
    };

    const result = sanitizeUserBackgroundInput(input);
    expect(result.preferredDevelopmentEnvironments).toHaveLength(10);
    expect(result.technicalSkills).toHaveLength(50);
  });

  test('should sanitize long hardware specs', () => {
    const longSpecs = 'a'.repeat(1000); // 1000 characters
    const input = {
      softwareExperienceLevel: 'intermediate',
      hardwareExperienceLevel: 'beginner',
      preferredDevelopmentEnvironments: ['vscode'],
      technicalSkills: ['javascript'],
      hardwareSpecs: longSpecs
    };

    const result = sanitizeUserBackgroundInput(input);
    expect(result.hardwareSpecs).toHaveLength(500); // Should be limited to 500
  });
});