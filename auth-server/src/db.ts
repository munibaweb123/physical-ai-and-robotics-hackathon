import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';

interface UserTable {
    id: string;
    email: string;
    hashed_password: string;
    created_at: Date;
    updated_at: Date;
}

interface SessionTable {
    id: string;
    user_id: string;
    expires_at: Date;
}

interface DatabaseSchema {
    user: UserTable;
    session: SessionTable;
}

const sqlite = new Database('./auth_v2.db');

export const db = new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
        database: sqlite,
    }),
    log(event) {
        if (event.level === 'error') {
            console.error('Query failed:', event.query.sql);
            console.error('Error:', event.error);
        } else {
            // Optional: log all queries to see what's happening
            // console.log('Query:', event.query.sql);
        }
    }
});

// Initialize database schema
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        emailVerified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
        id TEXT NOT NULL PRIMARY KEY,
        expiresAt DATETIME NOT NULL,
        token TEXT NOT NULL UNIQUE,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        userId TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS account (
        id TEXT NOT NULL PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId TEXT NOT NULL,
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        accessTokenExpiresAt DATETIME,
        refreshTokenExpiresAt DATETIME,
        scope TEXT,
        password TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verification (
        id TEXT NOT NULL PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME,
        updatedAt DATETIME
    );
`);
