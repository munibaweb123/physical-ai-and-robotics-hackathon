---
id: 22
title: Generate Tasks for RAG Chatbot Backend
stage: tasks
date_iso: 2025-11-29
surface: agent
model: gemini-1.5-pro
feature: rag-chatbot-backend
branch: 001-rag-chatbot-backend
user: Yusuf Traders
command: |
  /sp.tasks with Project Tasks: Integrated RAG Chatbot BackendPhase 1: Environment & Project SetupGoal: Establish the project structure and install necessary dependencies.Step 1.1: Define dependencies in requirements.txt.Includes: fastapi, uvicorn, pydantic, python-dotenv, openai, qdrant-client, asyncpg.Step 1.2: Initialize main.py skeleton.Set up FastAPI app instance.Configure python-dotenv to load API keys (OPENAI_API_KEY, NEON_DATABASE_URL, QDRANT_URL, QDRANT_API_KEY).Create basic Pydantic models for configuration/settings.Phase 2: Database Infrastructure[ ] Implement Connection ManagementDefine a global lifespan context manager.Neon: Initialize asyncpg.create_pool on startup; close on shutdown.Qdrant: Initialize AsyncQdrantClient on startup; close on shutdown.[ ] Implement Schema InitializationCreate an init_db() async function.SQL: Execute CREATE TABLE IF NOT EXISTS book_chunks (id SERIAL PRIMARY KEY, content TEXT, chapter_title TEXT, created_at TIMESTAMP DEFAULT NOW());.Vector: Use qdrant_client.get_collections() to check for book_vectors.Vector: If missing, use create_collection with VectorParams(size=1536, distance=Distance.COSINE).Phase 3: Data Ingestion Module[ ] Define Ingestion ModelsCreate IngestRequest Pydantic model (text: str, chapter_title: str, page_numbers: str/int).[ ] Create Utility FunctionsImplement chunk_text(text: str) -> List[str]: Logic to split text into ~500-1000 token segments.Implement get_embedding(text: str) -> List[float]: Async call to openai.embeddings.create (model: text-embedding-3-small).[ ] Build Ingest Endpoint (POST /ingest)Iterate through generated text chunks.Generate embedding for each chunk.SQL Insert: Save text/metadata to Neon; retrieve the generated id.Vector Upsert: Save embedding to Qdrant using the SQL id as the point ID (or payload reference).Phase 4: RAG & Chat Module[ ] Define Chat ModelsCreate ChatRequest model (query: str, selected_text: Optional[str] = None).Create ChatResponse model (answer: str, sources: Optional[List[str]]).[ ] Implement Retrieval LogicCreate search_context(query_vector) helper function to query Qdrant and return top k results.[ ] Build Chat Endpoint (POST /chat)Scenario A (Standard): - If selected_text is None: Generate query embedding -> Call search_context -> Format system prompt with retrieved context.Scenario B (Selected Text):If selected_text exists: Inject directly into system prompt as "Priority Context".Generation: Call openai.chat.completions.create (GPT-4o/3.5) with the final prompt.Output: Return the LLM response.Phase 5: Reliability & Polish[ ] Error HandlingWrap OpenAI and Database calls in try/except blocks.Raise HTTPException (500) for internal server errors.Raise HTTPException (400) for invalid inputs (e.g., empty text).[ ] Documentation & CleanupAdd Python docstrings to all major functions (chunk_text, init_db).Add comments inside POST /chat explicitly distinguishing Scenario A and Scenario B logic.
labels:
  - tasks
  - rag-chatbot-backend
links: {}
files_yaml:
  - specs/001-rag-chatbot-backend/tasks.md
tests_yaml: []
prompt_text: |
  /sp.tasks with Project Tasks: Integrated RAG Chatbot BackendPhase 1: Environment & Project SetupGoal: Establish the project structure and install necessary dependencies.Step 1.1: Define dependencies in requirements.txt.Includes: fastapi, uvicorn, pydantic, python-dotenv, openai, qdrant-client, asyncpg.Step 1.2: Initialize main.py skeleton.Set up FastAPI app instance.Configure python-dotenv to load API keys (OPENAI_API_KEY, NEON_DATABASE_URL, QDRANT_URL, QDRANT_API_KEY).Create basic Pydantic models for configuration/settings.Phase 2: Database Infrastructure[ ] Implement Connection ManagementDefine a global lifespan context manager.Neon: Initialize asyncpg.create_pool on startup; close on shutdown.Qdrant: Initialize AsyncQdrantClient on startup; close on shutdown.[ ] Implement Schema InitializationCreate an init_db() async function.SQL: Execute CREATE TABLE IF NOT EXISTS book_chunks (id SERIAL PRIMARY KEY, content TEXT, chapter_title TEXT, created_at TIMESTAMP DEFAULT NOW());.Vector: Use qdrant_client.get_collections() to check for book_vectors.Vector: If missing, use create_collection with VectorParams(size=1536, distance=Distance.COSINE).Phase 3: Data Ingestion Module[ ] Define Ingestion ModelsCreate IngestRequest Pydantic model (text: str, chapter_title: str, page_numbers: str/int).[ ] Create Utility FunctionsImplement chunk_text(text: str) -> List[str]: Logic to split text into ~500-1000 token segments.Implement get_embedding(text: str) -> List[float]: Async call to openai.embeddings.create (model: text-embedding-3-small).[ ] Build Ingest Endpoint (POST /ingest)Iterate through generated text chunks.Generate embedding for each chunk.SQL Insert: Save text/metadata to Neon; retrieve the generated id.Vector Upsert: Save embedding to Qdrant using the SQL id as the point ID (or payload reference).Phase 4: RAG & Chat Module[ ] Define Chat ModelsCreate ChatRequest model (query: str, selected_text: Optional[str] = None).Create ChatResponse model (answer: str, sources: Optional[List[str]]).[ ] Implement Retrieval LogicCreate search_context(query_vector) helper function to query Qdrant and return top k results.[ ] Build Chat Endpoint (POST /chat)Scenario A (Standard): - If selected_text is None: Generate query embedding -> Call search_context -> Format system prompt with retrieved context.Scenario B (Selected Text):If selected_text exists: Inject directly into system prompt as "Priority Context".Generation: Call openai.chat.completions.create (GPT-4o/3.5) with the final prompt.Output: Return the LLM response.Phase 5: Reliability & Polish[ ] Error HandlingWrap OpenAI and Database calls in try/except blocks.Raise HTTPException (500) for internal server errors.Raise HTTPException (400) for invalid inputs (e.g., empty text).[ ] Documentation & CleanupAdd Python docstrings to all major functions (chunk_text, init_db).Add comments inside POST /chat explicitly distinguishing Scenario A and Scenario B logic.
response_text: |
  The `tasks.md` for the `rag-chatbot-backend` feature has been successfully generated based on the provided detailed steps.

  **Task Generation Complete:**
  *   **Path to tasks.md:** `specs/001-rag-chatbot-backend/tasks.md`
  *   **Total Task Count:** 34
  *   **Tasks per Phase:**
      *   Phase 1: Environment & Project Setup: 4 tasks
      *   Phase 2: Database Infrastructure: 8 tasks
      *   Phase 3: Data Ingestion Module: 8 tasks
      *   Phase 4: RAG & Chat Module: 9 tasks
      *   Phase 5: Reliability & Polish: 5 tasks
  *   **Parallel Opportunities:** General parallelization examples are noted in `tasks.md`, primarily for setup and independent utility functions.
  *   **Independent Test Criteria:** Implicit in the goal of each phase.
  *   **Suggested MVP Scope:** As detailed in the `tasks.md` file.
  *   **Format Validation:** All tasks adhere to the specified format.
outcome: Tasks generated and PHR created.
evaluation: Tasks generated successfully with proper formatting and structure.
---
