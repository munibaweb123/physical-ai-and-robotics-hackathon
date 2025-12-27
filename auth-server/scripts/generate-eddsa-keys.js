/**
 * Generate EdDSA keys for Better Auth
 * Run this script to generate keys for deployment to Render
 *
 * Usage: node scripts/generate-eddsa-keys.js
 */

import crypto from 'crypto';

function generateEdDSAKeyPair() {
    console.log('🔑 Generating EdDSA (Ed25519) Key Pair...\n');

    // Generate Ed25519 key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
        publicKeyEncoding: {
            type: 'spki',
            format: 'der'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'der'
        }
    });

    // Convert to base64url (URL-safe base64)
    const publicKeyBase64 = publicKey
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const privateKeyBase64 = privateKey
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    console.log('✅ Keys Generated Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Add these to your Render environment variables:\n');
    console.log('EDDSA_PUBLIC_KEY:');
    console.log(publicKeyBase64);
    console.log('\n');
    console.log('EDDSA_PRIVATE_KEY:');
    console.log(privateKeyBase64);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT:');
    console.log('   - Keep these keys SECRET');
    console.log('   - Use the SAME keys on all services (auth server, backends)');
    console.log('   - Store them securely in Render environment variables');
    console.log('   - Never commit these keys to git\n');

    return {
        publicKey: publicKeyBase64,
        privateKey: privateKeyBase64
    };
}

// Also generate a BETTER_AUTH_SECRET
function generateBetterAuthSecret() {
    const secret = crypto.randomBytes(32).toString('base64');
    return secret;
}

// Run the generation
const keys = generateEdDSAKeyPair();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🔐 Also generate BETTER_AUTH_SECRET:\n');
const betterAuthSecret = generateBetterAuthSecret();
console.log('BETTER_AUTH_SECRET:');
console.log(betterAuthSecret);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ All secrets generated! Copy these to Render.\n');
