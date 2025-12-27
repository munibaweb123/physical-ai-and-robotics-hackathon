/**
 * Generate EdDSA (Ed25519) keypair for JWT signing
 * Run: node generate-eddsa-keys.js
 */
const crypto = require('crypto');
const fs = require('fs');

// Generate Ed25519 keypair
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Also export as base64 for environment variables
const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

// Extract raw public key bytes for JWKS (x parameter)
const publicKeyObject = crypto.createPublicKey({
    key: publicKey,
    format: 'pem'
});
const publicKeyExport = publicKeyObject.export({
    type: 'spki',
    format: 'der'
});
// Ed25519 public keys are 32 bytes, located at the end of SPKI format
const rawPublicKey = publicKeyExport.slice(-32);
const x = rawPublicKey.toString('base64url'); // base64url encoding for JWKS

console.log('='.repeat(80));
console.log('EdDSA (Ed25519) Keypair Generated');
console.log('='.repeat(80));
console.log('\n📝 Add these to your .env file:\n');
console.log(`EDDSA_PRIVATE_KEY=${privateKeyBase64}`);
console.log(`EDDSA_PUBLIC_KEY=${publicKeyBase64}`);
console.log('\n='.repeat(80));
console.log('JWKS Public Key (x parameter):');
console.log('='.repeat(80));
console.log(x);
console.log('\n='.repeat(80));
console.log('PEM Format Keys:');
console.log('='.repeat(80));
console.log('\nPrivate Key (PEM):');
console.log(privateKey);
console.log('Public Key (PEM):');
console.log(publicKey);

// Save to file
const envContent = `
# EdDSA Keys for JWT Signing (Generated: ${new Date().toISOString()})
EDDSA_PRIVATE_KEY=${privateKeyBase64}
EDDSA_PUBLIC_KEY=${publicKeyBase64}

# JWKS x parameter (base64url encoded raw public key)
JWKS_X=${x}
`;

fs.writeFileSync('.env.eddsa-keys', envContent.trim());
console.log('\n✅ Keys saved to .env.eddsa-keys');
console.log('   Copy these values to your .env file and Render environment variables');
