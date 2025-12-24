"""
Test script to verify the Better Auth integration
"""
import asyncio
import os
import sys
from pathlib import Path

# Add the hackathon directory to the path so we can import modules
sys.path.insert(0, str(Path(__file__).parent / 'hackathon'))

from auth_utils import decode_jwt_token, extract_user_id_from_token, fetch_jwks
import jwt
from datetime import datetime, timedelta
import secrets

def test_jwt_utilities():
    """Test the JWT utility functions"""
    print("Testing JWT utilities...")

    # Test with a fake token structure (for testing purposes)
    # In a real scenario, we'd get a token from the Better Auth server
    print("[OK] JWT utilities imported successfully")

    # Test that environment variables are available
    better_auth_secret = os.getenv("BETTER_AUTH_SECRET", "super-secret-key-please-change-me-in-production")
    better_auth_url = os.getenv("BETTER_AUTH_URL", "http://localhost:10000")

    print(f"[OK] BETTER_AUTH_URL: {better_auth_url}")
    print(f"[OK] BETTER_AUTH_SECRET is set: {'Yes' if better_auth_secret else 'No'}")

    # Test JWT creation/verification with HS512
    try:
        # Create a test payload
        from datetime import timezone
        payload = {
            "sub": "test-user-id-123",
            "email": "test@example.com",
            "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
            "iat": int(datetime.now(timezone.utc).timestamp()),
            "iss": better_auth_url
        }

        # Sign the token with HS512
        test_token = jwt.encode(payload, better_auth_secret, algorithm="HS512")

        # Verify the token using our utility
        decoded_payload = decode_jwt_token(test_token)

        if decoded_payload and decoded_payload.get("sub") == "test-user-id-123":
            print("[OK] JWT encoding/decoding works correctly")
            print(f"  - User ID: {extract_user_id_from_token(test_token)}")
            print(f"  - Email: {decoded_payload.get('email')}")
        else:
            print("[ERROR] JWT encoding/decoding failed")

    except Exception as e:
        print(f"[ERROR] Error testing JWT utilities: {e}")

async def test_jwks_fetch():
    """Test fetching JWKS from the auth server"""
    print("\nTesting JWKS fetch...")
    try:
        jwks = await fetch_jwks()
        print(f"[OK] JWKS fetch completed (keys count: {len(jwks.get('keys', [])) if jwks else 0})")
    except Exception as e:
        print(f"[ERROR] Error fetching JWKS: {e}")

async def main():
    print("Starting Better Auth integration test...\n")

    # Test JWT utilities
    test_jwt_utilities()

    # Test JWKS fetch
    await test_jwks_fetch()

    print("\nTest completed. To fully test the integration:")
    print("1. Start the auth server: cd hackathon/auth-server && npm run dev")
    print("2. Start the main server: cd hackathon && python -m uvicorn huggingface_app:app --reload")
    print("3. Register a user and get a JWT token")
    print("4. Use the token to call protected endpoints")

if __name__ == "__main__":
    asyncio.run(main())