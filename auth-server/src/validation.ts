import { UserBackgroundInput } from './types';

// Define valid experience levels
const VALID_EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

// Define valid development environments
const VALID_DEV_ENVIRONMENTS = [
  'vscode', 'intellij', 'pycharm', 'webstorm', 'vim', 'emacs',
  'sublime', 'atom', 'visualstudio', 'xcode', 'eclipse', 'netbeans'
] as const;

// Define common technical skills
const COMMON_TECHNICAL_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'go', 'rust', 'csharp', 'cpp', 'c',
  'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs', 'express', 'fastapi',
  'nodejs', 'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
  'aws', 'azure', 'gcp', 'git', 'github', 'gitlab', 'linux', 'bash'
] as const;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateUserBackgroundInput(input: UserBackgroundInput): {
  isValid: boolean;
  errors: ValidationError[]
} {
  const errors: ValidationError[] = [];

  // Validate software experience level
  if (input.softwareExperienceLevel !== undefined) {
    if (!VALID_EXPERIENCE_LEVELS.includes(input.softwareExperienceLevel as any)) {
      errors.push({
        field: 'softwareExperienceLevel',
        message: `Must be one of: ${VALID_EXPERIENCE_LEVELS.join(', ')}`
      });
    }
  }

  // Validate hardware experience level
  if (input.hardwareExperienceLevel !== undefined) {
    if (!VALID_EXPERIENCE_LEVELS.includes(input.hardwareExperienceLevel as any)) {
      errors.push({
        field: 'hardwareExperienceLevel',
        message: `Must be one of: ${VALID_EXPERIENCE_LEVELS.join(', ')}`
      });
    }
  }

  // Validate preferred development environments
  if (input.preferredDevelopmentEnvironments !== undefined) {
    if (!Array.isArray(input.preferredDevelopmentEnvironments)) {
      errors.push({
        field: 'preferredDevelopmentEnvironments',
        message: 'Must be an array of strings'
      });
    } else {
      for (const env of input.preferredDevelopmentEnvironments) {
        if (typeof env !== 'string') {
          errors.push({
            field: 'preferredDevelopmentEnvironments',
            message: 'All items must be strings'
          });
          break;
        }
        // Optional: Check if the environment is in our valid list
        // Commenting out for now to allow custom values
        // if (!VALID_DEV_ENVIRONMENTS.includes(env as any)) {
        //   errors.push({
        //     field: 'preferredDevelopmentEnvironments',
        //     message: `Environment "${env}" is not in the valid list`
        //   });
        // }
      }
    }
  }

  // Validate technical skills
  if (input.technicalSkills !== undefined) {
    if (!Array.isArray(input.technicalSkills)) {
      errors.push({
        field: 'technicalSkills',
        message: 'Must be an array of strings'
      });
    } else {
      for (const skill of input.technicalSkills) {
        if (typeof skill !== 'string') {
          errors.push({
            field: 'technicalSkills',
            message: 'All items must be strings'
          });
          break;
        }
        // Optional: Check if the skill is in our common list
        // Commenting out for now to allow custom skills
        // if (!COMMON_TECHNICAL_SKILLS.includes(skill as any)) {
        //   errors.push({
        //     field: 'technicalSkills',
        //     message: `Skill "${skill}" is not in the common list`
        //   });
        // }
      }
    }
  }

  // Validate hardware specs
  if (input.hardwareSpecs !== undefined) {
    if (typeof input.hardwareSpecs !== 'string') {
      errors.push({
        field: 'hardwareSpecs',
        message: 'Must be a string'
      });
    } else if (input.hardwareSpecs.length > 500) { // Reasonable length limit
      errors.push({
        field: 'hardwareSpecs',
        message: 'Hardware specs must be less than 500 characters'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeUserBackgroundInput(input: UserBackgroundInput): UserBackgroundInput {
  // Create a clean copy of the input with only valid properties
  const sanitized: UserBackgroundInput = {};

  if (input.softwareExperienceLevel !== undefined) {
    sanitized.softwareExperienceLevel = input.softwareExperienceLevel;
  }

  if (input.hardwareExperienceLevel !== undefined) {
    sanitized.hardwareExperienceLevel = input.hardwareExperienceLevel;
  }

  if (input.preferredDevelopmentEnvironments !== undefined && Array.isArray(input.preferredDevelopmentEnvironments)) {
    // Limit to 10 environments to prevent abuse
    sanitized.preferredDevelopmentEnvironments = input.preferredDevelopmentEnvironments
      .slice(0, 10)
      .filter(env => typeof env === 'string')
      .map(env => env.trim())
      .filter(env => env.length > 0);
  }

  if (input.technicalSkills !== undefined && Array.isArray(input.technicalSkills)) {
    // Limit to 50 skills to prevent abuse
    sanitized.technicalSkills = input.technicalSkills
      .slice(0, 50)
      .filter(skill => typeof skill === 'string')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  if (input.hardwareSpecs !== undefined && typeof input.hardwareSpecs === 'string') {
    // Limit length to prevent abuse
    sanitized.hardwareSpecs = input.hardwareSpecs.substring(0, 500);
  }

  return sanitized;
}