// Interface for user translation preferences
interface UserTranslationPreference {
  userId?: string;
  targetLanguage: string;  // e.g., 'ur' for Urdu
  autoTranslate: boolean;
  lastUsedAt?: string;
  preferencesUpdatedAt?: string;
}

// Key for storing preferences in localStorage
const PREFERENCE_STORAGE_KEY = 'translation-preferences';

/**
 * Gets user translation preferences from localStorage
 * @param userId Optional user identifier
 * @returns User translation preferences
 */
export const getUserTranslationPreferences = (userId?: string): UserTranslationPreference => {
  try {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    if (storedPreferences) {
      const preferences: UserTranslationPreference = JSON.parse(storedPreferences);

      // If a userId is provided, ensure it matches
      if (userId && preferences.userId && preferences.userId !== userId) {
        // Return default preferences for this user
        return getDefaultPreferences(userId);
      }

      return preferences;
    }
  } catch (error) {
    console.error('Error reading preferences from localStorage:', error);
  }

  // Return default preferences if none found or error occurred
  return getDefaultPreferences(userId);
};

/**
 * Updates user translation preferences in localStorage
 * @param preferences Updated preferences to save
 * @returns Boolean indicating success
 */
export const updateUserTranslationPreferences = (preferences: UserTranslationPreference): boolean => {
  try {
    // Add timestamp
    const updatedPreferences: UserTranslationPreference = {
      ...preferences,
      lastUsedAt: new Date().toISOString(),
      preferencesUpdatedAt: new Date().toISOString()
    };

    localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(updatedPreferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
    return false;
  }
};

/**
 * Gets default translation preferences
 * @param userId Optional user identifier
 * @returns Default preferences
 */
const getDefaultPreferences = (userId?: string): UserTranslationPreference => {
  return {
    userId: userId || undefined,
    targetLanguage: 'ur',  // Default to Urdu
    autoTranslate: false,  // Don't auto-translate by default
    lastUsedAt: new Date().toISOString(),
    preferencesUpdatedAt: new Date().toISOString()
  };
};

/**
 * Resets user translation preferences to default
 * @param userId Optional user identifier
 * @returns Boolean indicating success
 */
export const resetUserTranslationPreferences = (userId?: string): boolean => {
  try {
    const defaultPreferences = getDefaultPreferences(userId);
    localStorage.setItem(PREFERENCE_STORAGE_KEY, JSON.stringify(defaultPreferences));
    return true;
  } catch (error) {
    console.error('Error resetting preferences in localStorage:', error);
    return false;
  }
};

/**
 * Checks if translation is enabled for the current user
 * @returns Boolean indicating if translation is enabled
 */
export const isTranslationEnabled = (): boolean => {
  try {
    const preferences = getUserTranslationPreferences();
    return preferences.targetLanguage === 'ur'; // Only check for Urdu for this feature
  } catch (error) {
    console.error('Error checking translation status:', error);
    return false;
  }
};

/**
 * Gets the current target language for translation
 * @returns Target language code (e.g., 'ur')
 */
export const getTargetLanguage = (): string => {
  try {
    const preferences = getUserTranslationPreferences();
    return preferences.targetLanguage;
  } catch (error) {
    console.error('Error getting target language:', error);
    return 'ur'; // Default to Urdu
  }
};