import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './auth-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || '',
  },
});