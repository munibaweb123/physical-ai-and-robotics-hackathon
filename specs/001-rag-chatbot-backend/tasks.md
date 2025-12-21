# Tasks for Integrated RAG Chatbot Backend

## Feature Name: Integrated RAG Chatbot Backend

## Dependencies:
-   This tasks list is dependent on the `spec.md` (specs/001-rag-chatbot-backend/spec.md) and `plan.md` (specs/001-rag-chatbot-backend/plan.md) being finalized.

## Implementation Strategy:
-   The implementation will follow a phased approach as outlined below, starting with environment setup, moving to database infrastructure, then core data ingestion and RAG/chat modules, and concluding with reliability and polish.
-   Tasks are organized by phase, with a logical flow. Parallelization opportunities are marked with `[P]`.

---

## Phase 1: Environment & Project Setup
**Goal**: Establish the project structure and install necessary dependencies.

- [x] T001 Define dependencies in requirements.txt for fastapi, uvicorn, pydantic, python-dotenv, openai, qdrant-client, asyncpg. (requirements.txt)
- [x] T002 Initialize main.py skeleton with FastAPI app instance. (main.py)
- [x] T003 Configure python-dotenv to load environment variables (OPENAI_API_KEY, NEON_DATABASE_URL, QDRANT_URL, QDRANT_API_KEY). (main.py)
- [x] T004 Create basic Pydantic Settings model for environment variables. (main.py)

---

## Phase 2: Database Infrastructure
**Goal**: Manage persistent connections and schema initialization.

- [x] T005 [P] Implement FastAPI's lifespan context manager for database connection management. (main.py)
- [x] T006 Initialize asyncpg connection pool for Neon Postgres on startup. (main.py)
- [x] T007 Close asyncpg connection pool for Neon Postgres on shutdown. (main.py)
- [x] T008 Initialize AsyncQdrantClient for Qdrant on startup. (main.py)
- [x] T009 Close AsyncQdrantClient for Qdrant on shutdown. (main.py)
- [x] T010 Create `init_db()` async function for schema initialization. (main.py)
- [x] T011 Execute `CREATE TABLE IF NOT EXISTS book_chunks (...)` in Neon Postgres within `init_db()`. (main.py)
- [x] T012 Check for `book_vectors` collection in Qdrant; create if missing with `VectorParams(size=1536, distance=Distance.COSINE)` within `init_db()`. (main.py)

---

## Phase 3: Data Ingestion Module
**Goal**: Implement the logic to process book text and store it in both databases.

- [x] T013 Define `IngestRequest` Pydantic model (`raw_text: str`, `chapter_title: str`, `page_numbers: Optional[str]`). (main.py)
- [x] T014 Implement `chunk_text(text: str) -> List[str]` utility function (logic to split text into ~500-1000 token segments). (main.py)
- [x] T015 Implement `get_embedding(text: str) -> List[float]` utility function (async call to `openai.embeddings.create`). (main.py)
- [x] T016 Build `POST /ingest` endpoint. (main.py)
- [x] T017 Within `/ingest`, iterate through generated text chunks. (main.py)
- [x] T018 Within `/ingest`, generate embedding for each chunk. (main.py)
- [x] T019 Within `/ingest`, insert text/metadata into Neon `book_chunks` table and retrieve generated ID. (main.py)
- [x] T020 Within `/ingest`, upsert embedding + payload into Qdrant `book_vectors` using the Neon ID as the point ID. (main.py)

---

## Phase 4: RAG & Chat Module
**Goal**: Implement the intelligent retrieval and response generation logic.

- [x] T021 Define `ChatRequest` Pydantic model (`query: str`, `selected_text: Optional[str] = None`). (main.py)
- [x] T022 Define `ChatResponse` Pydantic model (`response: str`). (main.py)
- [x] T023 Implement `search_context(query_vector)` helper function to query Qdrant for top-k nearest neighbors. (main.py)
- [x] T024 Build `POST /chat` endpoint. (main.py)
- [x] T025 Within `/chat`, implement Scenario A logic: If `selected_text` is `None`, generate query embedding and call `search_context`. (main.py)
- [x] T026 Within `/chat`, implement Scenario B logic: If `selected_text` exists, inject directly into system prompt as "Priority Context". (main.py)
- [x] T027 Within `/chat`, construct final prompt for OpenAI with context (Scenario A or B). (main.py)
- [x] T028 Within `/chat`, call `openai.chat.completions.create` (GPT-4o/3.5) with the final prompt. (main.py)
- [x] T029 Within `/chat`, return the LLM response. (main.py)

---

## Phase 5: Reliability & Polish
**Goal**: Ensure the application is robust and production-ready.

- [x] T030 Add `try/except` blocks for OpenAI and database calls. (main.py)
- [x] T031 Implement proper HTTP 500/400 error responses with informative messages. (main.py)
- [x] T032 Add Python docstrings to all major functions (`chunk_text`, `init_db`, endpoint handlers). (main.py)
- [x] T033 Add comments inside `POST /chat` explicitly distinguishing Scenario A and Scenario B logic. (main.py)
- [x] T034 Ensure input text isn't empty before processing. (main.py)

---

## Task Dependencies:
- Phase 1 must be completed before Phase 2.
- Phase 2 must be completed before Phase 3 and Phase 4.
- Phase 3 can run in parallel with Phase 4 after Phase 2 is complete, but for this implementation, a sequential flow is assumed within the single file.
- Phase 5 can overlap with other phases but is generally applied after core logic is in place.

## Parallel Execution Examples:
- T005, T008 (DB client initialization)
- T006, T007, T009 (DB client closing)
- Tasks within a single phase (e.g., utility functions) can be implemented in parallel if they don't have direct file-based dependencies.

## Suggested MVP Scope:
- Completion of Phases 1, 2, and 3 (Environment Setup, Database Infrastructure, Data Ingestion Module) and a functional, basic implementation of the chat endpoint without advanced RAG for `selected_text` (i.e., only Scenario A).
- A complete MVP would include a basic but functional `POST /ingest` and `POST /chat` endpoint (Scenario A), with error handling and comments.

---
