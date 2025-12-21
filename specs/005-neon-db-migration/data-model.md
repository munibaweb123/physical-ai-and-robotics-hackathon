# Data Model: Neon DB Migration

## Entities

### User
**Purpose**: Represents application users with authentication credentials and profile information

**Fields**:
- `id` (string/UUID): Unique identifier for the user (primary key)
- `email` (string): User's email address (unique, not null)
- `name` (string): User's display name (optional)
- `password_hash` (string): Hashed password for authentication (not null)
- `email_verified` (boolean): Whether the user's email has been verified
- `created_at` (timestamp): When the user account was created
- `updated_at` (timestamp): When the user account was last updated
- `image` (string): URL to user's profile image (optional)

**Validation Rules**:
- `email` must be a valid email format and unique
- `password_hash` must be present and properly hashed
- `email` cannot be null
- `created_at` is set automatically on creation

### UserBackground
**Purpose**: Stores user's background information collected during signup for personalization

**Fields**:
- `id` (string/UUID): Unique identifier for the background record (primary key)
- `user_id` (string/UUID): Reference to the user (foreign key to users.id)
- `software_experience_level` (string): User's experience level with software (enum: "beginner", "intermediate", "advanced", "expert")
- `hardware_experience_level` (string): User's experience level with hardware (enum: "beginner", "intermediate", "advanced", "expert")
- `preferred_development_environments` (jsonb): Array of preferred dev environments (e.g., ["VS Code", "PyCharm"])
- `technical_skills` (jsonb): Array of technical skills (e.g., ["Python", "JavaScript", "React"])
- `hardware_specs` (string): Information about user's hardware setup (optional)
- `created_at` (timestamp): When the background info was created
- `updated_at` (timestamp): When the background info was last updated

**Validation Rules**:
- `user_id` must reference an existing user
- `software_experience_level` must be one of the defined enum values
- `hardware_experience_level` must be one of the defined enum values
- `preferred_development_environments` must be a valid JSON array
- `technical_skills` must be a valid JSON array

### Session
**Purpose**: Represents user sessions with authentication tokens

**Fields**:
- `id` (string/UUID): Unique identifier for the session (primary key)
- `user_id` (string/UUID): Reference to the user (foreign key to users.id)
- `token` (string): Session token (unique, not null)
- `expires_at` (timestamp): When the session expires
- `created_at` (timestamp): When the session was created
- `ip_address` (string): IP address of the session creator (optional)
- `user_agent` (string): User agent string of the client (optional)

**Validation Rules**:
- `user_id` must reference an existing user
- `token` must be unique and not null
- `expires_at` must be in the future

### Account
**Purpose**: Represents third-party authentication accounts linked to users

**Fields**:
- `id` (string/UUID): Unique identifier for the account (primary key)
- `user_id` (string/UUID): Reference to the user (foreign key to users.id)
- `provider_id` (string): ID of the provider (e.g., "google", "github")
- `provider_user_id` (string): User ID from the provider
- `access_token` (string): Access token for the provider (optional)
- `refresh_token` (string): Refresh token for the provider (optional)
- `expires_at` (timestamp): When the tokens expire (optional)
- `created_at` (timestamp): When the account was created
- `updated_at` (timestamp): When the account was last updated

**Validation Rules**:
- `user_id` must reference an existing user
- `provider_id` and `provider_user_id` combination must be unique
- `provider_id` cannot be null

## Relationships

### User → UserBackground
- One User to One UserBackground (user can have one background profile)
- Foreign key: `user_id` in UserBackground references `id` in User
- On delete: CASCADE (delete background when user is deleted)

### User → Session
- One User to Many Sessions (user can have multiple active sessions)
- Foreign key: `user_id` in Session references `id` in User
- On delete: CASCADE (delete sessions when user is deleted)

### User → Account
- One User to Many Accounts (user can link multiple third-party accounts)
- Foreign key: `user_id` in Account references `id` in User
- On delete: CASCADE (delete accounts when user is deleted)

## State Transitions

### Session State Transitions
- `active` → `expired` when session reaches expiration time
- `active` → `revoked` when user logs out or session is invalidated

### User State Transitions
- `unverified` → `verified` when email is confirmed
- `active` → `suspended` when account is administratively suspended (future feature)

## Database Migration Considerations

### From SQLite to PostgreSQL
- Change `INTEGER PRIMARY KEY` to `UUID` for primary keys
- Use `jsonb` type for array/json fields instead of text
- Update timestamp format handling
- Adapt auto-increment fields to PostgreSQL sequences
- Ensure proper indexing for performance

### Indexes
- Index on `users.email` for authentication lookups
- Index on `sessions.token` for session validation
- Index on `sessions.expires_at` for cleanup operations
- Index on `user_background.user_id` for profile lookups