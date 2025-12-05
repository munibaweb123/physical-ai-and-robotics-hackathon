import os
import asyncio
import logging
import uuid # Added import for UUID generation
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient, models

from datetime import datetime
import httpx # Import httpx

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Pydantic Settings Model ---
class Settings(BaseSettings):
    OPENAI_API_KEY: str = Field(..., description="OpenAI API Key")
    QDRANT_URL: str = Field(..., description="Qdrant Cloud URL")
    QDRANT_API_KEY: str = Field(..., description="Qdrant API Key")
    AUTH_SERVER_URL: str = Field("http://localhost:7860", description="URL of the Node.js auth server")


    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings() # Instantiate settings

# --- FastAPI App Initialization ---
app = FastAPI(
    title="RAG Chatbot Backend",
    description="FastAPI backend for a RAG Chatbot embedded in a digital book reader.",
    version="1.0.0",
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Clients and Connection Pools ---
openai_client: Optional[AsyncOpenAI] = None
qdrant_client: Optional[AsyncQdrantClient] = None
http_client: Optional[httpx.AsyncClient] = None # Add httpx client

QDRANT_COLLECTION_NAME = "book_chunks"
EMBEDDING_MODEL = "text-embedding-3-small"
OPENAI_CHAT_MODEL = "gpt-4o" # or "gpt-3.5-turbo"

# --- Authentication Dependency ---
async def authenticate_user(authorization: str = Header(...)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated: Missing or invalid Authorization header")
    
    session_id = authorization.split(" ")[1] # Extract session ID from Bearer token

    try:
        # Call the Node.js auth server to verify the session
        response = await http_client.post(
            f"{settings.AUTH_SERVER_URL}/api/auth/verify-session",
            json={"token": session_id} # Pass session ID (token) in body
        )
        response.raise_for_status() # Raise for HTTP errors (4xx or 5xx)
        
        user_data = response.json()
        if not user_data.get("success"):
            raise HTTPException(status_code=401, detail="Not authenticated: Invalid session")
        
        return user_data["user"] # Return user info if authenticated
    except httpx.HTTPStatusError as e:
        logger.error(f"Auth server responded with error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=401, detail="Not authenticated: Session verification failed")
    except httpx.RequestError as e:
        logger.error(f"Could not connect to auth server: {e}")
        raise HTTPException(status_code=500, detail="Authentication service unavailable")
    except Exception as e:
        logger.error(f"Unexpected error during authentication: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error during authentication")


# --- Pydantic Models ---
class IngestRequest(BaseModel):
    raw_text: str
    chapter_title: str
    page_numbers: Optional[str] = None # Assuming page_numbers can be a string range or similar

class ChatRequest(BaseModel):
    user_query: str
    selected_text: Optional[str] = None
    mode: Optional[str] = "standard" # "standard" or "socratic"

class ChatResponse(BaseModel):
    response: str
    # Optionally, include source information here
    # sources: List[Dict[str, Any]] = []

# --- System Prompts ---
SYSTEM_PROMPTS = {
    "standard": (
        "You are a helpful assistant for a digital book reader. "
        "Answer the user's question based strictly on the provided context from the book. "
        "If the answer cannot be found in the context, state that you don't have enough information from the book. "
        "Do not hallucinate content. Be concise and to the point."
    ),
    "socratic": "" # Will be loaded from file
}

def load_socratic_prompt():
    try:
        with open("agent/socratic_tutor.md", "r", encoding="utf-8") as f:
            SYSTEM_PROMPTS["socratic"] = f.read()
        logger.info("Loaded Socratic Tutor prompt from agent/socratic_tutor.md")
    except Exception as e:
        logger.error(f"Failed to load Socratic Tutor prompt: {e}")
        # Fallback to a basic Socratic prompt if file fails
        SYSTEM_PROMPTS["socratic"] = (
            "You are a Socratic Tutor. Guide the user to the answer using the provided context. "
            "Do not provide the direct answer immediately. Ask a guiding question."
        )



# --- FastAPI Lifecycle Events ---
@app.on_event("startup")
async def startup_event():
    """
    Initialize clients and database connections on app startup.
    """
    global openai_client, qdrant_client, http_client

    logger.info("Initializing application resources...")

    try:
        openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        qdrant_client = AsyncQdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
        http_client = httpx.AsyncClient() # Initialize httpx client

        # Load system prompts
        load_socratic_prompt()

        # Ensure Qdrant collection exists
        try:
            await qdrant_client.get_collection(QDRANT_COLLECTION_NAME)
            logger.info(f"Qdrant collection '{QDRANT_COLLECTION_NAME}' exists.")
        except Exception:
            logger.info(f"Qdrant collection '{QDRANT_COLLECTION_NAME}' not found. Creating...")
            await qdrant_client.create_collection(
                collection_name=QDRANT_COLLECTION_NAME,
                vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
            )
            logger.info(f"Qdrant collection '{QDRANT_COLLECTION_NAME}' created.")



        logger.info("Application resources initialized successfully.")

    except Exception as e:
        logger.error(f"Failed to initialize resources: {e}", exc_info=True)
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """
    Close clients and database connections on app shutdown.
    """
    global qdrant_client, http_client

    logger.info("Shutting down application resources...")

    if qdrant_client:
        await qdrant_client.close()
        logger.info("Qdrant client closed.")
    
    if http_client:
        await http_client.aclose()
        logger.info("HTTP client closed.")


    logger.info("Application resources shut down.")

# --- RAG Helper Functions ---
async def generate_embeddings(text: str) -> List[float]:
    """
    Generates embeddings for the given text using OpenAI's embedding model.
    """
    try:
        response = await openai_client.embeddings.create(
            input=text,
            model=EMBEDDING_MODEL
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate embeddings.")

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """
    Simple text chunking function. In a real-world scenario, a more sophisticated
    chunking strategy (e.g., based on sentences or paragraphs) would be used.
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
        if start >= len(text): # Ensure the last chunk is processed even if it's smaller than chunk_size
            break
    return chunks



async def upsert_qdrant(
    chunks_with_metadata: List[Dict[str, Any]],
    embeddings: List[List[float]]
):
    """
    Upserts chunks and their embeddings into Qdrant.
    `chunks_with_metadata` should contain {'text': str, 'chapter_title': str, 'page_numbers': Optional[str]}
    """
    if not chunks_with_metadata or not embeddings:
        return

    points = []
    for i, chunk_data in enumerate(chunks_with_metadata):
        # Generate a UUID for each point, as there's no Postgres ID anymore
        point_id = str(uuid.uuid4())
        payload = {
            "text": chunk_data["text"],
            "chapter_title": chunk_data["chapter_title"],
            "page_numbers": chunk_data.get("page_numbers") # Include page numbers if available
        }
        points.append(
            models.PointStruct(
                id=point_id,
                vector=embeddings[i],
                payload=payload
            )
        )
    
    try:
        await qdrant_client.upsert(
            collection_name=QDRANT_COLLECTION_NAME,
            points=points,
            wait=True
        )
        logger.info(f"Upserted {len(points)} points into Qdrant collection '{QDRANT_COLLECTION_NAME}'.")
    except Exception as e:
        logger.error(f"Error upserting to Qdrant: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to upsert vectors to Qdrant.")

async def search_qdrant(query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
    """
    Searches Qdrant for the top relevant book chunks.
    """
    try:
        search_result = await qdrant_client.query_points(
            collection_name=QDRANT_COLLECTION_NAME,
            query=query_embedding,
            limit=limit,
            with_payload=True # Retrieve the full payload (metadata)
        )
        return [{"text": hit.payload["text"], "chapter_title": hit.payload["chapter_title"]} for hit in search_result.points if hit.payload]
    except Exception as e:
        logger.error(f"Error searching Qdrant: {e}", exc_info=True)
        return [] # Return empty list on error, allowing chat to proceed with less context

# --- FastAPI Endpoints ---
@app.post("/ingest", response_model=Dict[str, str])
async def ingest_data(request: IngestRequest, user: Dict[str, Any] = Depends(authenticate_user)):
    """
    Ingests raw text (e.g., a book chapter), chunks it, generates embeddings,
    and stores it in Qdrant.
    """
    logger.info(f"Ingesting data for chapter: {request.chapter_title}")

    # 1. Chunk the raw text
    chunks = chunk_text(request.raw_text)
    if not chunks:
        raise HTTPException(status_code=400, detail="No chunks generated from the provided text.")

    # Prepare chunks for embedding and storage
    chunks_to_process: List[Dict[str, Any]] = []
    for chunk_content in chunks:
        chunks_to_process.append({
            "text": chunk_content,
            "chapter_title": request.chapter_title,
            "page_numbers": request.page_numbers # Include page numbers if available
        })

    # 2. Generate embeddings for all chunks
    all_embeddings = []
    for chunk_data in chunks_to_process:
        embedding = await generate_embeddings(chunk_data["text"])
        all_embeddings.append(embedding)

    # 3. Upsert vectors into Qdrant
    if all_embeddings:
        await upsert_qdrant(chunks_to_process, all_embeddings)
    else:
        logger.warning(f"No embeddings generated for chapter: {request.chapter_title}")

    logger.info(f"Successfully ingested {len(chunks)} chunks for chapter: {request.chapter_title}")
    return {"message": f"Successfully ingested {len(chunks)} chunks for chapter: {request.chapter_title}"}


@app.post("/chat", response_model=ChatResponse)
async def chat_with_rag(request: ChatRequest, user: Dict[str, Any] = Depends(authenticate_user)):
    """
    Answers user queries using Retrieval-Augmented Generation (RAG).
    Prioritizes `selected_text` if provided.
    """
    logger.info(f"Received chat query: '{request.user_query}' with selected_text: {'Yes' if request.selected_text else 'No'}")

    context_chunks: List[str] = []
    system_prompt_parts: List[str] = []

    # Scenario B: Selected Text provided
    if request.selected_text:
        system_prompt_parts.append(f"Immediate Context (User Selected Text): {request.selected_text}")
        logger.info("Prioritizing user-selected text as immediate context.")
    
    # Scenario A: Standard RAG (or supplementing selected text with more context)
    try:
        query_embedding = await generate_embeddings(request.user_query)
        relevant_qdrant_results = await search_qdrant(query_embedding)
        
        if relevant_qdrant_results:
            context_chunks.extend([res["text"] for res in relevant_qdrant_results])
            logger.info(f"Retrieved {len(relevant_qdrant_results)} relevant chunks from Qdrant.")
        else:
            logger.warning("Qdrant search returned no relevant results.")

    except HTTPException:
        logger.error("Skipping Qdrant search due to embedding generation failure.")
    except Exception as e:
        logger.error(f"An unexpected error occurred during Qdrant search: {e}", exc_info=True)
    
    # Construct the final system prompt
    if system_prompt_parts: # If selected text was provided
        system_prompt_parts.append("\n\nAdditional Context from Book (Vector Search):")
        if context_chunks:
            system_prompt_parts.append("\n".join(f"- {chunk}" for chunk in context_chunks))
        else:
            system_prompt_parts.append("No additional relevant context found.")
        system_prompt_content = "\n\n".join(system_prompt_parts)
    elif context_chunks: # Only vector search results
        system_prompt_content = "Context from Book (Vector Search):\n" + "\n".join(f"- {chunk}" for chunk in context_chunks)
    else: # No context found at all
        system_prompt_content = "No relevant context from the book was found."
        logger.warning("No context (neither selected text nor vector search) available for the query.")


    # --- OpenAI Chat Completion ---
    
    # Determine base system prompt
    mode = request.mode if request.mode in SYSTEM_PROMPTS else "standard"
    base_system_prompt = SYSTEM_PROMPTS[mode]

    messages = [
        {"role": "system", "content": (
            f"{base_system_prompt}"
            f"\n\n{system_prompt_content}"
        )},
        {"role": "user", "content": request.user_query}
    ]

    try:
        chat_completion = await openai_client.chat.completions.create(
            model=OPENAI_CHAT_MODEL,
            messages=messages,
            temperature=0.0 # Keep responses factual
        )
        response_content = chat_completion.choices[0].message.content
        logger.info(f"OpenAI chat completion successful for query: '{request.user_query}'")
        return ChatResponse(response=response_content)

    except Exception as e:
        logger.error(f"Error calling OpenAI Chat Completion API: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get response from AI model.")

# --- Health Check Endpoint (Optional but Recommended) ---
@app.get("/health")
async def health_check():
    """
    Basic health check to verify the API is running and can connect to its dependencies.
    """
    try:
        # Check Qdrant connection
        await qdrant_client.get_collections()

        # OpenAI client is checked implicitly when generating embeddings/chat
        return {"status": "ok", "message": "All services are operational."}
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        raise HTTPException(status_code=503, detail=f"Service unavailable: {e}")

if __name__ == "__main__":
    import uvicorn
    # To run: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000)
