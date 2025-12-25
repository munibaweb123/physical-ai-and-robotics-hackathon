/**
 * Cryptographic utilities for EdDSA key management
 */
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface EdDSAKeyPair {
    publicKey: string; // Base64URL encoded
    privateKey: string; // Base64URL encoded
}

/**
 * Generate a new Ed25519 key pair for EdDSA signing
 */
export function generateEdDSAKeyPair(): EdDSAKeyPair {
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

    // Extract the raw 32-byte public key from the DER-encoded SPKI format
    // Ed25519 public key in SPKI format has a 12-byte header
    const rawPublicKey = publicKey.slice(12);

    // Convert to base64url
    const publicKeyBase64Url = Buffer.from(rawPublicKey)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    const privateKeyBase64Url = Buffer.from(privateKey)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    return {
        publicKey: publicKeyBase64Url,
        privateKey: privateKeyBase64Url
    };
}

/**
 * Load or generate EdDSA keys for Better Auth
 */
export function loadOrGenerateKeys(): EdDSAKeyPair {
    const envPath = path.join(__dirname, '..', '.env');

    // Check if keys exist in environment variables
    const publicKeyEnv = process.env.EDDSA_PUBLIC_KEY;
    const privateKeyEnv = process.env.EDDSA_PRIVATE_KEY;

    if (publicKeyEnv && privateKeyEnv) {
        console.log('✓ Using existing EdDSA keys from environment');
        return {
            publicKey: publicKeyEnv,
            privateKey: privateKeyEnv
        };
    }

    // Generate new keys
    console.log('⚙ Generating new EdDSA key pair...');
    const keyPair = generateEdDSAKeyPair();

    // Save to .env file
    try {
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf-8');
        }

        // Add keys to .env if not present
        if (!envContent.includes('EDDSA_PUBLIC_KEY')) {
            envContent += `\n# EdDSA Keys for JWT Signing\nEDDSA_PUBLIC_KEY=${keyPair.publicKey}\nEDDSA_PRIVATE_KEY=${keyPair.privateKey}\n`;
            fs.writeFileSync(envPath, envContent);
            console.log('✓ EdDSA keys saved to .env file');
        }
    } catch (error) {
        console.warn('⚠ Could not save keys to .env file:', error);
    }

    return keyPair;
}

/**
 * Get the public key in JWK format for JWKS endpoint
 */
export function getPublicKeyJWK(publicKeyBase64Url: string) {
    return {
        kty: "OKP",
        use: "sig",
        alg: "EdDSA",
        kid: "better-auth-eddsa-key",
        crv: "Ed25519",
        x: publicKeyBase64Url // The raw public key bytes
    };
}
