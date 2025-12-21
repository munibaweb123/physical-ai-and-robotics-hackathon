# Data Model: Chapter Urdu Translation

## Entities

### TranslationRequest
**Purpose**: Represents a user's request to translate specific chapter content

**Fields**:
- `id` (string/UUID): Unique identifier for the translation request (primary key)
- `chapterId` (string): Identifier for the chapter being translated
- `sourceLanguage` (string): Original language code (e.g., "en")
- `targetLanguage` (string): Target language code (e.g., "ur")
- `originalContent` (string): The original content to be translated
- `status` (string): Current status of the translation ("pending", "in-progress", "completed", "failed")
- `createdAt` (timestamp): When the request was created
- `updatedAt` (timestamp): When the request was last updated

**Validation Rules**:
- `chapterId` must reference an existing chapter
- `sourceLanguage` and `targetLanguage` must be valid language codes
- `originalContent` cannot be empty
- `status` must be one of the defined enum values

### TranslatedContent
**Purpose**: Stores the resulting Urdu translation of chapter content

**Fields**:
- `id` (string/UUID): Unique identifier for the translated content (primary key)
- `translationRequestId` (string/UUID): Reference to the translation request (foreign key to TranslationRequest.id)
- `translatedContent` (string): The translated content in Urdu
- `translationQuality` (number): Quality score of the translation (0-100)
- `createdAt` (timestamp): When the translation was completed
- `updatedAt` (timestamp): When the translation was last updated

**Validation Rules**:
- `translationRequestId` must reference an existing translation request
- `translatedContent` cannot be empty
- `translationQuality` must be between 0 and 100

### UserTranslationPreference
**Purpose**: Stores user's translation preferences across sessions

**Fields**:
- `id` (string/UUID): Unique identifier for the preference record (primary key)
- `userId` (string/UUID): Reference to the user (or session identifier)
- `targetLanguage` (string): Preferred target language (e.g., "ur")
- `autoTranslate` (boolean): Whether to auto-translate new chapters
- `lastUsedAt` (timestamp): When the preference was last used
- `createdAt` (timestamp): When the preference was created
- `updatedAt` (timestamp): When the preference was last updated

**Validation Rules**:
- `userId` must be valid (or use session identifier if not logged in)
- `targetLanguage` must be a valid language code
- `autoTranslate` defaults to false

## Relationships

### TranslationRequest → TranslatedContent
- One TranslationRequest to One TranslatedContent (one-to-one relationship)
- Foreign key: `translationRequestId` in TranslatedContent references `id` in TranslationRequest
- On delete: CASCADE (delete translation when request is deleted)

## State Transitions

### TranslationRequest State Transitions
- `pending` → `in-progress` when translation API call is initiated
- `in-progress` → `completed` when translation API returns successfully
- `in-progress` → `failed` when translation API returns an error
- `completed` → `pending` if content is updated and requires re-translation

### UserTranslationPreference State Transitions
- `active` → `updated` when user changes their translation preference
- `active` → `inactive` when user explicitly disables translation

## Database Migration Considerations

### From Current State
- No existing translation-related tables to migrate from
- New tables will be created for translation functionality

### Indexes
- Index on `TranslationRequest.chapterId` for efficient lookup by chapter
- Index on `TranslationRequest.status` for status-based queries
- Index on `UserTranslationPreference.userId` for user preference retrieval