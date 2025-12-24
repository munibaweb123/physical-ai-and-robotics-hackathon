#!/usr/bin/env node

import { config } from 'dotenv';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './schema';

config(); // Load environment variables

// PostgreSQL database connection
const dbUrl = process.env.NEON_DATABASE_URL || '';
const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

const postgresDb = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool
    }),
});

async function verifyDataIntegrity() {
    console.log('Starting data integrity verification...');

    try {
        // Count records in each table
        const userCount = await postgresDb.selectFrom('user').select('id').execute();
        const sessionCount = await postgresDb.selectFrom('session').select('id').execute();
        const accountCount = await postgresDb.selectFrom('account').select('id').execute();
        const verificationCount = await postgresDb.selectFrom('verification').select('id').execute();

        console.log(`Verification Results:`);
        console.log(`- Users: ${userCount.length} records`);
        console.log(`- Sessions: ${sessionCount.length} records`);
        console.log(`- Accounts: ${accountCount.length} records`);
        console.log(`- Verification: ${verificationCount.length} records`);

        // Validate email format for users
        const invalidEmails = await postgresDb.selectFrom('user')
            .select(['id', 'email'])
            .where('email', 'NOT LIKE', '%@%')
            .execute();

        if (invalidEmails.length > 0) {
            console.warn(`⚠ Found ${invalidEmails.length} users with invalid email format`);
        } else {
            console.log('✓ All user emails have valid format');
        }

        // Check for null required fields
        const usersWithNullEmail = await postgresDb.selectFrom('user')
            .select(['id'])
            .where('email', 'is', null)
            .execute();

        if (usersWithNullEmail.length > 0) {
            console.warn(`⚠ Found ${usersWithNullEmail.length} users with null email`);
        } else {
            console.log('✓ All users have valid email addresses');
        }

        console.log('Data integrity verification completed.');

        // Close connections
        await pool.end();

        return {
            userCount: userCount.length,
            sessionCount: sessionCount.length,
            accountCount: accountCount.length,
            verificationCount: verificationCount.length,
            invalidEmails: invalidEmails.length,
            nullEmails: usersWithNullEmail.length
        };
    } catch (error) {
        console.error('Error during data integrity verification:', error);
        await pool.end();
        throw error;
    }
}

// Run verification if this file is executed directly
if (require.main === module) {
    verifyDataIntegrity()
        .then(results => {
            console.log('Verification completed successfully:', results);
            process.exit(0);
        })
        .catch(error => {
            console.error('Verification failed:', error);
            process.exit(1);
        });
}

export { verifyDataIntegrity };