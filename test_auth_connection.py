import httpx
import asyncio

async def test_auth():
    url = "http://localhost:10000/api/auth/verify-session"
    print(f"Testing connection to {url}...")
    try:
        # Test with a dummy token
        headers = {"Content-Type": "application/json"}
        payload = {"token": "dummy-token-123"}
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_auth())
