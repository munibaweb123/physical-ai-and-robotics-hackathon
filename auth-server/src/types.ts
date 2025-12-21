// Types for user background information

export interface UserBackground {
  softwareExperienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hardwareExperienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredDevelopmentEnvironments?: string[]; // e.g., ["vscode", "intellij", "vim", "sublime"]
  technicalSkills?: string[]; // e.g., ["javascript", "python", "react", "nodejs"]
  hardwareSpecs?: string; // e.g., "windows laptop", "macbook pro", "linux desktop"
}

export interface UserBackgroundInput {
  softwareExperienceLevel?: string;
  hardwareExperienceLevel?: string;
  preferredDevelopmentEnvironments?: string[];
  technicalSkills?: string[];
  hardwareSpecs?: string;
}

export interface UserBackgroundResponse {
  userId: string;
  softwareExperienceLevel?: string;
  hardwareExperienceLevel?: string;
  preferredDevelopmentEnvironments?: string[];
  technicalSkills?: string[];
  hardwareSpecs?: string;
  updatedAt: string;
}