import { authBaseUrl, apiBaseUrl, authClient } from '../lib/auth-client';

// Service functions for chapter personalization

interface PersonalizationState {
  userId: string;
  chapterId: string;
  isActive: boolean;
  adaptationsApplied: string[];
  overrideSettings: Record<string, any>;
  lastViewedAt: string | null;
  engagementMetrics: {
    timeSpent: number;
    scrollDepth: number;
    completions: number;
    helpRequests: number;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

interface PersonalizationSettings {
  complexityLevel?: string;
  preferredExamples?: string[];
  focusAreas?: string[];
  enabledFeatures?: {
    adaptiveDifficulty?: boolean;
    customExamples?: boolean;
    terminologyAdjustment?: boolean;
  };
}

interface ContentAdaptation {
  originalContent: string;
  adaptedContent: string;
  adaptationsApplied: string[];
  relevanceScore: number;
  metadata: {
    complexityLevel: string;
    appliedExamples: string[];
    focusAreas: string[];
  };
}

interface PersonalizationHistory {
  id: string;
  userId: string;
  chapterId: string;
  chapterTitle: string;
  personalizationActive: boolean;
  engagementMetrics: {
    timeSpent: number;
    scrollDepth: number;
    completions: number;
    helpRequests: number;
  };
  adaptationsCount: number;
  relevanceScore: number;
  personalizedAt: string;
  viewedAt: string;
}

/**
 * Toggle personalization for a specific chapter
 * @param chapterId The ID of the chapter to toggle personalization for
 * @param activate Whether to activate or deactivate personalization
 * @param preferences Optional preferences to apply when activating
 * @returns Promise with response from the server
 */
export const toggleChapterPersonalization = async (
  chapterId: string,
  activate: boolean,
  preferences?: PersonalizationSettings
): Promise<{
  success: boolean;
  chapterId?: string;
  personalizationActive?: boolean;
  adaptationsApplied?: string[];
  message?: string;
  error?: string;
}> => {
  try {
    // Get the session to retrieve the token
    const { data: session } = await authClient.getSession();
    const token = session?.session?.token || session?.session?.id || session?.user?.id;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${authBaseUrl}/api/chapters/${chapterId}/personalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        activate: activate,
        preferences: preferences
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to toggle personalization'
      };
    }

    return {
      success: true,
      chapterId: data.chapterId,
      personalizationActive: data.personalizationActive,
      adaptationsApplied: data.adaptationsApplied,
      message: data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Get personalization state for a specific chapter
 * @param chapterId The ID of the chapter to get personalization state for
 * @returns Promise with personalization state
 */
export const getChapterPersonalizationState = async (
  chapterId: string
): Promise<PersonalizationState & { success: boolean; error?: string }> => {
  try {
    // Get the session to retrieve the token
    const { data: session } = await authClient.getSession();
    const token = session?.session?.token || session?.session?.id || session?.user?.id;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${authBaseUrl}/api/chapters/${chapterId}/personalize`, {
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
        error: data.error || 'Failed to get personalization state'
      };
    }

    return {
      success: true,
      userId: data.userId,
      chapterId: data.chapterId,
      isActive: data.personalizationActive,
      adaptationsApplied: data.adaptationsApplied || [],
      overrideSettings: data.overrideSettings || {},
      lastViewedAt: data.lastViewedAt,
      engagementMetrics: data.engagementMetrics || {
        timeSpent: 0,
        scrollDepth: 0,
        completions: 0,
        helpRequests: 0
      },
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Get personalized content for a chapter
 * @param chapterId The ID of the chapter to get personalized content for
 * @param complexityOverride Optional override for complexity level
 * @param focusAreaOverride Optional override for focus area
 * @returns Promise with personalized content
 */
export const getPersonalizedChapterContent = async (
  chapterId: string,
  complexityOverride?: string,
  focusAreaOverride?: string
): Promise<ContentAdaptation & { success: boolean; error?: string }> => {
  try {
    // Get the session to retrieve the token
    const { data: session } = await authClient.getSession();
    const token = session?.session?.token || session?.session?.id || session?.user?.id;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    let url = `${apiBaseUrl}/api/chapters/${chapterId}/content/personalized`;
    const params = new URLSearchParams();

    if (complexityOverride) {
      params.append('complexityOverride', complexityOverride);
    }
    if (focusAreaOverride) {
      params.append('focusAreaOverride', focusAreaOverride);
    }

    if (params.toString()) {
      url += '?' + params.toString();
    }

    const response = await fetch(url, {
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
        error: data.error || 'Failed to get personalized content'
      };
    }

    return {
      success: true,
      originalContent: data.originalContent,
      adaptedContent: data.content || data.adaptedContent,
      adaptationsApplied: data.adaptationsApplied || [],
      relevanceScore: data.relevanceScore || 0,
      metadata: {
        complexityLevel: data.metadata?.complexityLevel || data.difficultyLevel || 'intermediate',
        appliedExamples: data.metadata?.appliedExamples || [],
        focusAreas: data.metadata?.focusAreas || data.focusAreas || []
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Update user's personalization preferences
 * @param preferences The preferences to update
 * @returns Promise with response from the server
 */
export const updateUserPreferences = async (
  preferences: PersonalizationSettings
): Promise<{ success: boolean; message?: string; preferences?: PersonalizationSettings; error?: string }> => {
  try {
    // Get the session to retrieve the token
    const { data: session } = await authClient.getSession();
    const token = session?.session?.token || session?.session?.id || session?.user?.id;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${authBaseUrl}/api/user/personalization/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(preferences)
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update preferences'
      };
    }

    return {
      success: true,
      message: data.message,
      preferences: data.preferences
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Get user's personalization preferences
 * @returns Promise with user's preferences
 */
export const getUserPreferences = async (): Promise<PersonalizationSettings & { success: boolean; error?: string }> => {
  try {
    // Get the session to retrieve the token
    const { data: session } = await authClient.getSession();
    const token = session?.session?.token || session?.session?.id || session?.user?.id;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${authBaseUrl}/api/user/personalization/preferences`, {
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
        error: data.error || 'Failed to get preferences'
      };
    }

    return {
      success: true,
      complexityLevel: data.complexityLevel,
      preferredExamples: data.preferredExamples,
      focusAreas: data.focusAreas,
      enabledFeatures: data.enabledFeatures
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Get user's personalization history
 * @param limit Number of records to return (default: 10, max: 50)
 * @param page Page number for pagination (default: 1)
 * @param chapterId Optional filter for specific chapter
 * @param startDate Optional filter for start date (ISO 8601 format)
 * @param endDate Optional filter for end date (ISO 8601 format)
 * @returns Promise with personalization history
 */
export const getPersonalizationHistory = async (
  limit: number = 10,
  page: number = 1,
  chapterId?: string,
  startDate?: string,
  endDate?: string
): Promise<{ history: PersonalizationHistory[], total: number, page: number, limit: number } & { success: boolean; error?: string }> => {
  try {
    // Get the session to retrieve the token
    const { data: session } = await authClient.getSession();
    const token = session?.session?.token || session?.session?.id || session?.user?.id;

    if (!token) {
      throw new Error('Authentication token not found');
    }

    let url = `${apiBaseUrl}/api/user/personalization/history`;
    const params = new URLSearchParams();

    params.append('limit', limit.toString());
    params.append('page', page.toString());

    if (chapterId) {
      params.append('chapterId', chapterId);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    url += '?' + params.toString();

    const response = await fetch(url, {
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
        error: data.error || 'Failed to get personalization history'
      };
    }

    return {
      success: true,
      history: data.history || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};