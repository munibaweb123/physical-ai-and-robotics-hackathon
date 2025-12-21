# Data Model: Chapter Content Personalization

## Entities

### PersonalizationSettings
**Purpose**: User's preferences and settings for content personalization, including complexity level, preferred examples, focus areas, and enabled/disabled features

**Fields**:
- `id` (string): Unique identifier for the personalization settings
- `userId` (string): Reference to the user who owns these settings
- `complexityLevel` (string): Preferred content complexity level (enum: "beginner", "intermediate", "advanced", "expert")
- `preferredExamples` (array of strings): Types of examples user prefers (e.g., ["practical", "theoretical", "case-studies"])
- `focusAreas` (array of strings): Specific topics or areas of interest (e.g., ["hardware", "software", "theory", "practice"])
- `enabledFeatures` (object): Boolean flags for different personalization features (e.g., {adaptiveDifficulty: true, customExamples: false})
- `createdAt` (datetime): Timestamp when settings were created
- `updatedAt` (datetime): Timestamp when settings were last updated

**Validation Rules**:
- `complexityLevel` must be one of the defined enum values
- `preferredExamples` values must be from a predefined list of valid example types
- `focusAreas` values must be from a predefined list of valid focus areas
- `userId` must reference an existing user

### ChapterPersonalizationState
**Purpose**: Tracks whether personalization is active for each chapter and the specific adaptations applied

**Fields**:
- `id` (string): Unique identifier for the personalization state
- `userId` (string): Reference to the user
- `chapterId` (string): Identifier for the specific chapter
- `isActive` (boolean): Whether personalization is currently active for this chapter
- `adaptationsApplied` (array of strings): List of specific adaptations applied (e.g., ["simplified-explanation", "advanced-examples"])
- `overrideSettings` (object): Temporary overrides for personalization settings specific to this chapter
- `lastViewedAt` (datetime): Timestamp when user last viewed this chapter with personalization
- `engagementMetrics` (object): Metrics about user engagement with personalized content (e.g., timeSpent, scrollDepth)

**Validation Rules**:
- `userId` must reference an existing user
- `chapterId` must reference an existing chapter
- `isActive` is boolean
- `adaptationsApplied` values must be from predefined list of valid adaptations

### ContentAdaptation
**Purpose**: The specific changes made to original content based on user profile and preferences

**Fields**:
- `id` (string): Unique identifier for the adaptation
- `originalContentId` (string): Reference to the original content
- `userId` (string): Reference to the user for whom content was adapted
- `adaptationType` (string): Type of adaptation (enum: "difficulty", "examples", "terminology", "structure", "focus")
- `adaptationRules` (object): Specific rules applied to create this adaptation
- `adaptedContent` (string): The resulting adapted content
- `relevanceScore` (float): How well this adaptation matches the user's profile (0-1 scale)
- `createdAt` (datetime): Timestamp when adaptation was created

**Validation Rules**:
- `userId` must reference an existing user
- `originalContentId` must reference existing content
- `adaptationType` must be one of the defined enum values
- `relevanceScore` must be between 0 and 1

### UserPreferenceHistory
**Purpose**: Tracks changes to user's personalization preferences over time

**Fields**:
- `id` (string): Unique identifier for the history record
- `userId` (string): Reference to the user
- `settingChanged` (string): Which setting was changed (e.g., "complexityLevel", "focusAreas")
- `oldValue` (any): Previous value of the setting
- `newValue` (any): New value of the setting
- `changedAt` (datetime): Timestamp when the change occurred
- `triggeredBy` (string): What triggered the change (e.g., "user-action", "system-suggestion", "profile-update")

**Validation Rules**:
- `userId` must reference an existing user
- `settingChanged` must be a valid setting name
- `changedAt` must be a valid timestamp

## Relationships

### User → PersonalizationSettings
- One User to Many PersonalizationSettings (user can have multiple settings configurations)

### User → ChapterPersonalizationState
- One User to Many ChapterPersonalizationStates (user can have personalization state for multiple chapters)

### Chapter → ChapterPersonalizationState
- One Chapter to Many ChapterPersonalizationStates (multiple users can have personalization states for the same chapter)

### User → ContentAdaptation
- One User to Many ContentAdaptations (user can have multiple adaptations created for them)

### OriginalContent → ContentAdaptation
- One OriginalContent to Many ContentAdaptations (one piece of content can be adapted in multiple ways for different users)

## State Transitions

### ChapterPersonalizationState Transitions
- `inactive` → `active` when user clicks personalization button
- `active` → `inactive` when user disables personalization
- `active` → `customized` when user modifies specific preferences for the chapter
- `customized` → `active` when user resets to global preferences

### PersonalizationSettings State
- `default` → `configured` when user sets initial preferences
- `configured` → `refined` when user updates preferences based on experience
- `refined` → `optimized` when system suggests improvements based on engagement metrics