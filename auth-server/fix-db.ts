import Database from 'better-sqlite3';
import { config } from 'dotenv';

config(); // Load environment variables

async function fixDatabase() {
    console.log('Checking database schema for missing columns...');
    const db = new Database('./auth_v2.db');

    try {
        // List of columns to check/add to the 'user' table
        const columns = [
            { name: 'software_experience_level', type: 'TEXT' },
            { name: 'hardware_experience_level', type: 'TEXT' },
            { name: 'preferred_development_environments', type: 'TEXT' },
            { name: 'technical_skills', type: 'TEXT' },
            { name: 'hardware_specs', type: 'TEXT' },
            { name: 'personalization_active', type: 'INTEGER' }, // 0 or 1 for boolean in SQLite
            { name: 'personalization_preferences', type: 'TEXT' }
        ];

        // Get existing columns
        const tableInfo = db.prepare("PRAGMA table_info('user')").all() as any[];
        const existingColumns = tableInfo.map(c => c.name);

        for (const col of columns) {
            if (!existingColumns.includes(col.name)) {
                console.log(`Adding column '${col.name}' to 'user' table...`);
                db.prepare(`ALTER TABLE "user" ADD COLUMN ${col.name} ${col.type}`).run();
            } else {
                console.log(`Column '${col.name}' already exists.`);
            }
        }

        console.log('Database schema check complete!');
    } catch (error) {
        console.error('Error fixing database:', error);
    } finally {
        db.close();
    }
}

fixDatabase();
