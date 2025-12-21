# Data Model: Signup Background Questions

## Entities

### User Profile (Extension to existing Better Auth User)
**Purpose**: Store user account information including background data about software and hardware experience

**Fields**:
- `id` (string): Primary identifier (inherited from Better Auth)
- `email` (string): User's email address (inherited from Better Auth)
- `name` (string): User's name (inherited from Better Auth)
- `softwareExperienceLevel` (string): User's experience level (enum: "beginner", "intermediate", "advanced", "expert")
- `hardwareExperienceLevel` (string): User's hardware knowledge level (enum: "beginner", "intermediate", "advanced", "expert")
- `preferredDevelopmentEnvironments` (array of strings): List of preferred dev environments (e.g., ["vscode", "intellij", "vim", "sublime"])
- `technicalSkills` (array of strings): List of technical skills (e.g., ["javascript", "python", "react", "nodejs"])
- `hardwareSpecs` (string): Information about user's hardware setup (e.g., "windows laptop", "macbook pro", "linux desktop")
- `createdAt` (datetime): Account creation timestamp (inherited from Better Auth)
- `updatedAt` (datetime): Last update timestamp (inherited from Better Auth)

**Validation Rules**:
- `softwareExperienceLevel` and `hardwareExperienceLevel` must be one of the defined enum values
- `preferredDevelopmentEnvironments` values must be from a predefined list of valid environments
- `technicalSkills` values should match known technical skills
- `email` must be a valid email format (inherited validation)

### Background Information (Embedded in User Profile)
**Purpose**: Structured data about user's experience level, technical skills, preferred tools, and hardware knowledge

**Fields** (all included in User Profile):
- `experienceLevel`: Combined experience level based on software and hardware experience
- `technicalProfile`: Aggregated technical skills and preferences
- `contentPreferences`: Derived preferences for content personalization

**State Transitions**:
- `profileIncomplete` → `profileComplete` when user fills out background information
- `profileComplete` → `profileUpdated` when user updates background information

## Relationships

### User Profile → Content Recommendations
- One User Profile to Many Content Recommendations (via personalization engine)
- The user profile's background information drives content recommendation generation

## Database Schema Changes

### Auth Server Database (SQLite with Kysely)
The existing Better Auth schema will be extended with additional columns in the `user` table:

```sql
-- Extending the existing user table in auth_v2.db
ALTER TABLE user ADD COLUMN softwareExperienceLevel TEXT;
ALTER TABLE user ADD COLUMN hardwareExperienceLevel TEXT;
ALTER TABLE user ADD COLUMN preferredDevelopmentEnvironments TEXT; -- JSON string
ALTER TABLE user ADD COLUMN technicalSkills TEXT; -- JSON string
ALTER TABLE user ADD COLUMN hardwareSpecs TEXT;
```

**Note**: Better Auth allows schema extensions through its adapter system, which will be configured to handle these additional fields.