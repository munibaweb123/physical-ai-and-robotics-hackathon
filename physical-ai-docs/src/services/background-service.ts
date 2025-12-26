import { authBaseUrl, apiBaseUrl } from '../lib/auth-client';

// Service functions for background information management

interface BackgroundInfo {
  softwareExperienceLevel?: string;
  hardwareExperienceLevel?: string;
  preferredDevelopmentEnvironments?: string[];
  technicalSkills?: string[];
  hardwareSpecs?: string;
}

interface BackgroundResponse {
  success: boolean;
  message?: string;
  userId?: string;
  error?: string;
}

/**
 * Submit user's background information
 * @param backgroundInfo The background information to submit
 * @returns Promise with response from the server
 */
export const submitBackgroundInfo = async (backgroundInfo: BackgroundInfo): Promise<BackgroundResponse> => {
  try {
    // Get the EdDSA token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${authBaseUrl}/api/auth/user/background`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(backgroundInfo)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to submit background information'
      };
    }

    return {
      success: true,
      message: data.message,
      userId: data.userId
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Fetch user's background information
 * @returns Promise with user's background information
 */
export const fetchBackgroundInfo = async (): Promise<BackgroundInfo & { success: boolean, error?: string }> => {
  try {
    // Get the EdDSA token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${authBaseUrl}/api/auth/user/background`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch background information'
      };
    }

    return {
      success: true,
      softwareExperienceLevel: data.softwareExperienceLevel,
      hardwareExperienceLevel: data.hardwareExperienceLevel,
      preferredDevelopmentEnvironments: data.preferredDevelopmentEnvironments,
      technicalSkills: data.technicalSkills,
      hardwareSpecs: data.hardwareSpecs
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Update user's background information
 * @param backgroundInfo The updated background information
 * @returns Promise with response from the server
 */
export const updateBackgroundInfo = async (backgroundInfo: BackgroundInfo): Promise<BackgroundResponse> => {
  return submitBackgroundInfo(backgroundInfo);
};

/**
 * Fetch personalized content for the user
 * @param limit Number of items to fetch (default: 10)
 * @param page Page number for pagination (default: 1)
 * @returns Promise with personalized content
 */
export interface PersonalizedContentItem {
  id: string;
  title: string;
  description: string;
  level: string;
  tags: string[];
  relevanceScore: number;
  url: string;
}

export interface PersonalizedContentResponse {
  content: PersonalizedContentItem[];
  total: number;
  page: number;
  limit: number;
}

export const fetchPersonalizedContent = async (
  limit: number = 10,
  page: number = 1
): Promise<PersonalizedContentResponse & { success: boolean, error?: string }> => {
  try {
    // Get the EdDSA token from localStorage
    const token = localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${apiBaseUrl}/api/content/personalized?limit=${limit}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch personalized content'
      };
    }

    return {
      success: true,
      content: data.content,
      total: data.total,
      page: data.page,
      limit: data.limit
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};