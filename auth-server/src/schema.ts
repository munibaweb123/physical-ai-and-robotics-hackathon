import { ColumnType } from 'kysely';

// This is an interface for the entire database.
export interface Database {
  user: UserTable;
  session: SessionTable;
  account: AccountTable;
  verification: VerificationTable;
}

// User table
export interface UserTable {
  id: string;
  name: string | null;
  email: string;
  email_verified: number | null; // Using 1 for true, 0 for false to match SQLite behavior
  image: string | null;
  created_at: ColumnType<Date, string | Date, string | Date>; // Can be Date or string from DB
  updated_at: ColumnType<Date, string | Date, string | Date>;
  software_experience_level: string | null;
  hardware_experience_level: string | null;
  preferred_development_environments: string | null; // JSON string
  technical_skills: string | null; // JSON string
  hardware_specs: string | null;
  hashed_password: string | null;
  personalization_active: boolean | null;
  personalization_preferences: string | null; // JSON string
}

// Session table
export interface SessionTable {
  id: string;
  user_id: string;
  expires_at: ColumnType<Date, string | Date, string | Date>;
  token: string;
  created_at: ColumnType<Date, string | Date, string | Date>;
  updated_at: ColumnType<Date, string | Date, string | Date>;
  ip_address: string | null;
  user_agent: string | null;
}

// Account table
export interface AccountTable {
  id: string;
  account_id: string;
  provider_id: string;
  user_id: string;
  access_token: string | null;
  refresh_token: string | null;
  id_token: string | null;
  access_token_expires_at: ColumnType<Date, string | Date, string | Date> | null;
  refresh_token_expires_at: ColumnType<Date, string | Date, string | Date> | null;
  scope: string | null;
  password: string | null;
  created_at: ColumnType<Date, string | Date, string | Date>;
  updated_at: ColumnType<Date, string | Date, string | Date>;
}

// Verification table
export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expires_at: ColumnType<Date, string | Date, string | Date>;
  created_at: ColumnType<Date, string | Date, string | Date> | null;
  updated_at: ColumnType<Date, string | Date, string | Date> | null;
}