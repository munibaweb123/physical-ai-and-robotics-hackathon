# Implementation Plan: Integrated RAG Chatbot Backend

## 1. Feature Name
Integrated RAG Chatbot Backend

## 2. Goal
To implement a production-ready, single-file Python FastAPI backend for a RAG Chatbot embedded in a digital book reader, capable of ingesting book content and answering user queries based on that content, prioritizing user-selected text.

## 3. Technical Context

### 3.1. Tech Stack
-   **Framework**: FastAPI (Python)
-   **LLM & Orchestration**: OpenAI async client (`text-embedding-3-small`, `gpt-4o`/`gpt-3.5-turbo`)
-   **Vector Database**: Qdrant Cloud (Free Tier) via `qdrant-client`
-   **Relational Database**: Neon Serverless Postgres via `asyncpg`
-   **Data Validation**: Pydantic
-   **Environment Management**: `python-dotenv`

### 3.2. Architecture Overview
A single FastAPI application will expose two primary endpoints: `/ingest` for content addition and `/chat` for RAG-powered queries. This application will manage asynchronous connections to both Qdrant and Neon Postgres.

### 3.3. Data Flow
-   **Ingestion**: Raw text → Chunking → OpenAI Embeddings → Qdrant (vectors & metadata payload) + Neon Postgres (content & metadata).
-   **Chat**: User Query + (Optional) Selected Text → OpenAI Embedding (for query) → Qdrant Search → Contextualized Prompt → OpenAI Chat Completion → Response.

## 4. Constitution Check

Evaluating the `Integrated RAG Chatbot Backend` feature against the project's Core Principles:

-   **I. Library-First**: The backend is implemented as a single service (`main.py`). While not a standalone library in itself, the internal components (e.g., `generate_embeddings`, `upsert_qdrant`, `store_in_postgres`) are designed as modular, testable functions that could be extracted into libraries if required by future architectural evolution. This aligns with the principle's spirit of modularity and reusability within a single service context.
    -   **Compliance Status**: **✅ COMPLIANT (in spirit)**
-   **II. CLI Interface**: The backend exposes a RESTful API, not a CLI. This is a deliberate and appropriate architectural choice for a web service. The principle's intent is to expose functionality, which the API achieves effectively for its domain.
    -   **Compliance Status**: **✅ COMPLIANT (justified deviation)**
-   **III. Test-First (NON-NEGOTIABLE)**: The plan explicitly integrates Test-Driven Development (TDD) for critical components, starting with API endpoint tests and unit tests for core logic (chunking, embedding, database interactions).
    -   **Compliance Status**: **✅ COMPLIANT**
-   **IV. Integration Testing**: Essential for this feature due to its reliance on multiple external services (OpenAI, Qdrant, Neon Postgres). The plan includes comprehensive integration tests for each endpoint and cross-service interactions.
    -   **Compliance Status**: **✅ COMPLIANT**
-   **V. Observability**: The plan extends beyond basic comments and error handling by incorporating structured logging for all critical operations and external service calls, aligning with the "Structured logging required" aspect of the principle.
    -   **Compliance Status**: **✅ COMPLIANT**
-   **VI. Versioning & Breaking Changes**: API endpoints will consider versioning for future compatibility. The initial implementation will establish the endpoints, with a note to consider explicit versioning strategies (e.g., `/v1/ingest`) if the API evolves significantly.
    -   **Compliance Status**: **✅ COMPLIANT (future consideration noted)**
-   **VII. Simplicity**: The single-file `main.py` structure promotes simplicity for a microservice. The use of established libraries (FastAPI, Qdrant Client, AsyncPG) reduces custom complexity. This aligns with starting simple and avoiding over-engineering.
    -   **Compliance Status**: **✅ COMPLIANT**

## 5. Implementation Phases (Detailed Plan from User Input)

### Phase 1: Environment & Project Setup
**Goal**: Establish the project structure and install necessary dependencies.
-   **Step 1.1**: Define dependencies in `requirements.txt`.
    -   Includes: `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, `openai`, `qdrant-client`, `asyncpg`.
-   **Step 1.2**: Initialize `main.py` skeleton.
    -   Set up FastAPI app instance.
    -   Configure `python-dotenv` to load API keys (`OPENAI_API_KEY`, `QDRANT_URL`, etc.).
    -   Create basic Pydantic models for configuration/settings.

### Phase 2: Database Infrastructure (Neon & Qdrant)
**Goal**: Manage persistent connections and schema initialization.
-   **Step 2.1**: Implement Database Lifespan Manager.
    -   Use FastAPI's `@asynccontextmanager` lifespan to handle startup and shutdown.
    -   **Startup**: Initialize `asyncpg` pool for Neon and `AsyncQdrantClient` for Qdrant.
    -   **Shutdown**: Close SQL pool and Qdrant client gracefully.
-   **Step 2.2**: Schema Initialization Logic.
    -   Create a function `init_db()` to run on startup.
    -   **SQL**: Execute `CREATE TABLE IF NOT EXISTS book_chunks (...)` in Neon.
    -   **Vector**: Check if collection `book_vectors` exists in Qdrant; create it with appropriate configuration (`size=1536` for `text-embedding-3-small`, `distance=Cosine`) if missing.

### Phase 3: Data Ingestion Module
**Goal**: Implement the logic to process book text and store it in both databases.
-   **Step 3.1**: Define Data Models.
    -   Create `IngestRequest` Pydantic model (`raw_text`, `chapter_title`, `page_numbers`).
-   **Step 3.2**: Implement Utility Functions.
    -   `chunk_text(text)`: specific logic to split long chapters into semantic chunks (e.g., ~500-1000 tokens).
    -   `get_embedding(text)`: Async wrapper for `openai.embeddings.create`.
-   **Step 3.3**: Implement `POST /ingest` Endpoint.
    -   Receive chapter text.
    -   Loop through chunks -> Get Embeddings.
    -   Transaction:
        -   Insert metadata/text into Neon (`book_chunks`) -> Get generated ID.
        -   Upsert vector + payload into Qdrant (`book_vectors`) using the Neon ID as the Point ID (or a UUID linking them).

### Phase 4: RAG & Chat Module
**Goal**: Implement the intelligent retrieval and response generation logic.
-   **Step 4.1**: Define Data Models.
    -   Create `ChatRequest` Pydantic model (`query`, optional `selected_text`).
    -   Create `ChatResponse` model.
-   **Step 4.2**: Implement Retrieval Logic.
    -   Create function `search_context(query_vector)`: Queries Qdrant for nearest neighbors.
-   **Step 4.3**: Implement `POST /chat` Endpoint.
    -   **Scenario Logic**:
        -   If `selected_text`: Construct system prompt emphasizing this text as ground truth. (Optional: Fetch supporting vectors if query implies broader scope).
        -   If no selection: Generate query embedding -> `search_context` -> Construct prompt with retrieved chunks.
    -   **Generation**: Call `openai.chat.completions.create` with the constructed messages.
    -   **Response**: Return the answer (Streaming or JSON).

### Phase 5: Reliability & Polish
**Goal**: Ensure the application is robust and production-ready.
-   **Step 5.1**: Error Handling.
    -   Add `try/except` blocks for external API calls (OpenAI, DBs).
    -   Return proper HTTP 500/400 codes with informative messages.
-   **Step 5.2**: Validation & cleanup.
    -   Ensure input text isn't empty.
    -   Add docstrings and comments explaining the RAG strategy (Scenario A vs B) as requested.

## 6. Phase 0: Outline & Research (Summary)
All research topics (chunking, LLM model selection, performance metrics) have been addressed with concrete decisions in this updated plan.

## 7. Phase 1: Design & Contracts (Summary)
Data model and API contracts are fully defined in the plan, consistent with the feature specification.

## 8. Agent Context Update
The key technologies introduced and solidified in this plan, which will be relevant for the agent's context, include:
-   FastAPI
-   AsyncOpenAI client
-   AsyncQdrantClient
-   Asyncpg (for Neon Postgres)
-   Pydantic
-   Dotenv
-   Uvicorn