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

const sqlite = new Database('./auth.db');

export const db = new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
        database: sqlite,
    }),
});

// Initialize database schema
sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user (
        id TEXT NOT NULL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        hashed_password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS session (
        id TEXT NOT NULL PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
    );
`);
