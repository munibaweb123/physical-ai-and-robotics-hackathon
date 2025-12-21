# Feature Specification: Integrated RAG Chatbot Backend

## 1. Feature Name
Integrated RAG Chatbot Backend

## 2. Description
Develop a production-ready, single-file Python FastAPI backend (main.py) and a dependency file (requirements.txt) for a Retrieval-Augmented Generation (RAG) Chatbot embedded within a digital book reader application.

## 3. User Scenarios

### Scenario 1: Ingesting Book Content
- **As a book manager, I want to ingest raw book text with chapter titles and page numbers, so that the content becomes searchable and available for RAG.**
  - **Steps:**
    1. The book manager provides raw text, chapter title, and optional page numbers to the `/ingest` API endpoint.
    2. The system processes the text by chunking, generating embeddings, and storing it in a vector database (Qdrant) and a relational database (Neon Postgres).
    3. The system confirms successful ingestion.

### Scenario 2: Chatting with the Book Reader (Standard Query)
- **As a book reader, I want to ask questions about the book, so that I can get accurate answers based on the book's content.**
  - **Steps:**
    1. The reader inputs a natural language query to the `/chat` API endpoint.
    2. The system converts the user query into an embedding.
    3. The system performs a vector search in Qdrant to retrieve the top 3-5 most relevant book chunks.
    4. The system passes these chunks as "Context" to the OpenAI Chat Completion API (GPT-4o or GPT-3.5-turbo).
    5. The system returns a streaming response or a JSON object containing the answer.

### Scenario 3: Chatting with the Book Reader (Query with Selected Text)
- **As a book reader, I want to ask questions about a specific passage I've highlighted, so that the chatbot prioritizes my selected text for context.**
  - **Steps:**
    1. The reader inputs a natural language query and provides `selected_text` from the UI to the `/chat` API endpoint.
    2. The system prioritizes the `selected_text` by injecting it directly into the System Prompt as "Immediate Context" or "Ground Truth."
    3. The system may optionally perform a vector search for supporting context, but strictly instructs the LLM to prioritize the selected text.
    4. The system generates a response via an LLM, heavily relying on the selected text.
    5. The system returns a streaming response or a JSON object containing the answer.

## 4. Functional Requirements

### FR1: Backend Application Structure
- The system MUST consist of a single-file Python FastAPI backend (`main.py`).
- The system MUST provide a `requirements.txt` file listing all Python dependencies.

### FR2: Database Connection Management
- The system MUST initialize asynchronous connections for both Neon (Postgres) and Qdrant upon application startup.
- The system MUST ensure all database connections are closed gracefully upon application exit.

### FR3: Data Ingestion Endpoint (`POST /ingest`)
- The endpoint MUST accept `raw_text` (book chapters), `chapter_title`, and `page_numbers`.
- The system MUST chunk the `raw_text` into manageable segments.
- The system MUST generate vector embeddings for each chunk using OpenAI's `text-embedding-3-small` model.
- The system MUST upsert the generated vectors into Qdrant.
- The system MUST store the Chapter Title, Page Numbers, and original text content in Neon Postgres for persistent reference.

### FR4: RAG Chat Endpoint (`POST /chat`)
- The endpoint MUST accept `user_query` (string) and `selected_text` (optional string).
- If `selected_text` is present, the system MUST prioritize it by injecting it directly into the System Prompt as "Immediate Context" or "Ground Truth."
- The system MUST convert the `user_query` into an embedding.
- The system MUST perform a vector search in Qdrant to retrieve the top 3-5 most relevant book chunks.
- The system MUST pass the retrieved chunks as "Context" to the OpenAI Chat Completion API.
- The system MUST use GPT-4o or GPT-3.5-turbo for the OpenAI Chat Completion API.
- The system MUST return a streaming response or a JSON object containing the answer.
- The answer MUST be strictly derived from the provided context.
- The system MUST avoid hallucinating information not present in the provided book context.

### FR5: Database Schema
- **Neon Postgres (`book_chunks` table)**: MUST have `id` (Primary Key), `content` (Text), `chapter_title` (VarChar), `created_at` (Timestamp).
- **Qdrant (`book_vectors` collection)**: Payload MUST mirror the SQL metadata (e.g., `chapter_title`, `page_number`) to allow for hybrid filtering if necessary.

## 5. Non-Functional Requirements

### NFR1: Validation
- The system MUST use pydantic models for all request and response validation.

### NFR2: Security
- The system MUST manage sensitive credentials (OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY, NEON_DATABASE_URL) using Environment Variables.

### NFR3: Code Quality
- The code MUST include clear, explanatory comments specifically regarding the RAG retrieval logic and context injection strategies.

### NFR4: Error Handling
- The system MUST implement graceful error handling (e.g., fallback responses if Qdrant search returns no results).

### NFR5: Content Safety
- The system MUST strictly prompt the LLM to avoid hallucinating information that is not present in the provided book context.

## 6. Success Criteria

- The `main.py` and `requirements.txt` are provided, adhering to the specified tech stack.
- Database connections to Neon Postgres and Qdrant are established and gracefully managed.
- The `/ingest` endpoint successfully processes raw book text, chunks it, generates embeddings, and stores metadata in Neon Postgres and vectors in Qdrant.
- The `/chat` endpoint accurately answers user queries based on book content, prioritizing `selected_text` when provided.
- The chatbot adheres to the constraint of not hallucinating content.
- All data validation is handled via pydantic.
- All sensitive credentials are managed via environment variables.
- The codebase includes clear comments explaining the RAG logic.
- Graceful error handling is implemented for database and API interactions.

## 7. Key Entities

### BookChunk
- **Description**: A segment of raw text from a book.
- **Attributes**:
    - `id`: Unique identifier (database generated ID).
    - `content`: The raw text of the chunk.
    - `chapter_title`: The title of the chapter the chunk belongs to.
    - `page_numbers`: Optional string indicating page range.
    - `embedding`: Vector representation of the `content`.
    - `created_at`: Timestamp of ingestion.

### UserQuery
- **Description**: A natural language question posed by the user.
- **Attributes**:
    - `text`: The raw text of the query.
    - `embedding`: Vector representation of the `text`.

### SelectedText
- **Description**: A specific passage of text highlighted by the user within the book reader UI.
- **Attributes**:
    - `content`: The raw text of the selected passage.

## 8. Assumptions

- A suitable `.env` file with `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, and `NEON_DATABASE_URL` will be provided in the deployment environment.
- The OpenAI API keys have necessary permissions for embedding generation and chat completions.
- The Qdrant Cloud instance and Neon Serverless Postgres database are provisioned and accessible with the provided credentials.
- The digital book reader UI correctly provides `user_query` and `selected_text` (when applicable) to the `/chat` endpoint.
- Text chunking strategy (e.g., fixed size with overlap) will be implemented; specific parameters (`chunk_size`, `overlap`) will be determined during implementation, with initial defaults as placeholders.
- The preferred OpenAI chat model (`gpt-4o` or `gpt-3.5-turbo`) will be confirmed during the planning phase.
- Specific performance metrics and load expectations will be defined during the planning phase.

## 9. Open Questions
No further open questions; the specification is now comprehensive.
