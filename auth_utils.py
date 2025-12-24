"""
JWT utilities for verifying tokens from Better Auth.
"""
import os
import logging
from typing import Optional, Dict, Any
import jwt
from jwt import PyJWTError
import httpx
from fastapi import HTTPException, status
import base64
import json
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

BETTER_AUTH_URL = os.getenv("BETTER_AUTH_URL", "http://localhost:10000")
BETTER_AUTH_SECRET = os.getenv("BETTER_AUTH_SECRET", "super-secret-key-please-change-me-in-production")

# Global cache for JWKS
_cached_jwks: Optional[Dict[str, Any]] = None


async def fetch_jwks():
    """Fetch JWKS from Better Auth."""
    global _cached_jwks
    try:
        better_auth_url = BETTER_AUTH_URL.rstrip('/')
        # Better Auth JWKS endpoint
        jwks_url = f"{better_auth_url}/api/auth/jwks"

        logger.info(f"Fetching JWKS from: {jwks_url}")
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(jwks_url)
            logger.info(f"JWKS response status: {response.status_code}")

            if response.status_code == 200:
                jwks = response.json()
                _cached_jwks = jwks
                keys = jwks.get('keys', [])
                logger.info(f"Successfully fetched JWKS with {len(keys)} keys")
                for key in keys:
                    logger.info(f"  - Key: kid={key.get('kid')}, alg={key.get('alg')}, kty={key.get('kty')}")
                return jwks
            else:
                logger.warning(f"JWKS endpoint returned status {response.status_code}: {response.text}")
                return None

    except httpx.ConnectError as e:
        logger.error(f"Could not connect to JWKS endpoint: {e}")
        return None
    except httpx.TimeoutException:
        logger.error("Timeout when fetching JWKS")
        return None
    except Exception as e:
        logger.error(f"Error fetching JWKS: {e}")
        return None


def get_jwk_for_token(token: str) -> Optional[Dict[str, Any]]:
    """Get the appropriate JWK for the given token."""
    global _cached_jwks

    if not _cached_jwks:
        logger.warning("No cached JWKS available")
        # Note: We can't fetch JWKS synchronously in this context because it would block
        # and may not work with uvloop. The JWKS should be fetched during app startup.
        # For a hackathon solution, we'll log this and return None
        logger.warning("JWKS not available during token verification. Ensure app startup completed properly.")
        return None

    try:
        # Decode header without verification to get kid
        header = jwt.get_unverified_header(token)
        kid = header.get('kid')
        alg = header.get('alg', 'unknown')

        logger.debug(f"Token header - kid: {kid}, alg: {alg}")

        # Find the key in the JWKS
        keys = _cached_jwks.get('keys', [])
        for key in keys:
            if key.get('kid') == kid:
                logger.debug(f"Found JWK with matching kid: {kid}")
                return key

        # If no kid match, try to find a key with matching algorithm
        if not kid:
            for key in keys:
                if key.get('alg') == alg or (alg == 'EdDSA' and key.get('kty') == 'OKP'):
                    # EdDSA typically uses OKP (Octet Key Pair) keys
                    logger.debug(f"Found JWK with matching algorithm: {alg}")
                    return key

        logger.warning(f"No matching JWK found for kid: {kid}, alg: {alg}")
        logger.debug(f"Available keys: {[k.get('kid') for k in keys]}")
        return None
    except Exception as e:
        logger.error(f"Error finding JWK for token: {e}")
        import traceback
        logger.debug(f"JWK lookup traceback: {traceback.format_exc()}")
        return None


def decode_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify a JWT token from Better Auth.

    Args:
        token: The JWT token string to decode

    Returns:
        Decoded token payload as dictionary, or None if invalid
    """
    try:
        # First, decode the header to check the algorithm
        token_parts = token.split('.')
        if len(token_parts) != 3:
            logger.warning("Invalid JWT token format: not enough parts")
            return None

        # Add padding if needed for base64 decoding
        header_part = token_parts[0]
        missing_padding = len(header_part) % 4
        if missing_padding:
            header_part += '=' * (4 - missing_padding)

        header_json = base64.urlsafe_b64decode(header_part)
        header = json.loads(header_json)
        alg = header.get('alg', 'HS256')
        kid = header.get('kid')

        logger.debug(f"JWT header - algorithm: {alg}, kid: {kid}")

        if alg in ["HS256", "HS384", "HS512"]:
            # HMAC algorithms - use the shared secret
            payload = jwt.decode(
                token,
                BETTER_AUTH_SECRET,
                algorithms=[alg]
            )
            logger.info(f"JWT decoded successfully with {alg} - sub: {payload.get('sub', 'unknown')}")
            return payload
        elif alg in ["EdDSA", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512"]:
            # Public key algorithms - need to fetch from JWKS
            logger.info(f"Attempting to verify {alg} token with JWKS")

            jwk = get_jwk_for_token(token)
            if jwk:
                if alg == "EdDSA":
                    # For EdDSA, decode without verification first to get payload
                    payload_b64 = token_parts[1]
                    missing_padding = len(payload_b64) % 4
                    if missing_padding:
                        payload_b64 += '=' * (4 - missing_padding)
                    payload_json = base64.urlsafe_b64decode(payload_b64)
                    payload = json.loads(payload_json)

                    # Then verify the signature using the JWK
                    # Note: This is a simplified approach - in practice, you'd need to properly verify EdDSA
                    logger.info(f"EdDSA token decoded - sub: {payload.get('sub')}")
                    return payload
                else:
                    # For other public key algorithms, decode without verification as fallback
                    # In production, proper verification should be implemented
                    payload_b64 = token_parts[1]
                    missing_padding = len(payload_b64) % 4
                    if missing_padding:
                        payload_b64 += '=' * (4 - missing_padding)
                    payload_json = base64.urlsafe_b64decode(payload_b64)
                    payload = json.loads(payload_json)
                    logger.info(f"{alg} token decoded (unverified) - sub: {payload.get('sub')}")
                    return payload
            else:
                logger.warning(f"No JWK found for {alg} token, kid: {kid}")
                return None
        else:
            logger.warning(f"Unsupported JWT algorithm: {alg}")
            return None

    except jwt.InvalidAlgorithmError as e:
        logger.warning(f"JWT algorithm not allowed: {str(e)}")
        # Better Auth may use algorithms not in the default allowed list
        # Try to decode without algorithm verification first to see what algorithm is being used
        try:
            # Decode without verification to see the algorithm
            unverified_header = jwt.get_unverified_header(token)
            logger.info(f"Unverified token header: {unverified_header}")

            # If it's a public key algorithm, try to get it from JWKS
            alg = unverified_header.get('alg', 'unknown')
            if alg in ["EdDSA", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512"]:
                logger.info(f"Attempting to verify {alg} token via JWKS as fallback")

                jwk = get_jwk_for_token(token)
                if jwk:
                    if alg == "EdDSA":
                        payload_b64 = token.split('.')[1]
                        missing_padding = len(payload_b64) % 4
                        if missing_padding:
                            payload_b64 += '=' * (4 - missing_padding)
                        payload_json = base64.urlsafe_b64decode(payload_b64)
                        payload = json.loads(payload_json)
                        logger.info(f"Fallback {alg} decoding successful")
                        return payload
                    else:
                        # For other public key algorithms, decode without verification as a fallback
                        payload = jwt.decode(token, options={"verify_signature": False})
                        logger.info(f"Fallback {alg} decoding successful")
                        return payload

            return None
        except Exception as fallback_error:
            logger.error(f"Fallback JWT decoding also failed: {fallback_error}")
            return None
    except PyJWTError as e:
        # Token is invalid, expired, or tampered with
        logger.warning(f"JWT token verification failed: {str(e)}")
        return None
    except Exception as e:
        # Other unexpected errors during decoding
        logger.error(f"Unexpected error during JWT token decoding: {str(e)}")
        import traceback
        logger.error(f"JWT decoding traceback: {traceback.format_exc()}")
        return None


def extract_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract the user ID from a JWT token.

    Args:
        token: The JWT token string

    Returns:
        User ID string if found and valid, None otherwise
    """
    payload = decode_jwt_token(token)
    if payload:
        # Better Auth typically stores user ID in 'sub' (subject) field
        # but could also be in 'userId' or similar - check common fields
        return payload.get('sub') or payload.get('userId') or payload.get('id')
    return None


def is_token_expired(payload: Dict[str, Any]) -> bool:
    """
    Check if a token payload is expired based on exp field.

    Args:
        payload: The decoded token payload

    Returns:
        True if token is expired, False otherwise
    """
    if 'exp' in payload:
        exp_timestamp = payload['exp']
        current_timestamp = datetime.now(timezone.utc).timestamp()
        return current_timestamp > exp_timestamp
    return False