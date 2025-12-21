---
id: 46
title: Refactor RAG Backend to use only Qdrant (remove Neon Postgres)
stage: refactor
date_iso: 2025-11-29
surface: agent
model: gemini-1.5-pro
feature: rag-chatbot-backend
branch: 001-docusaurus-migration
user: Yusuf Traders
command: |
  use only qdrant in my peoject for vector embedding
labels:
  - refactor
  - qdrant
  - postgres
  - architecture
links: {}
files_yaml:
  - main.py
  - requirements.txt
tests_yaml: []
prompt_text: |
  use only qdrant in my peoject for vector embedding
response_text: |
  The RAG Chatbot Backend (`main.py`) has been refactored to remove the dependency on Neon Serverless Postgres and now uses only Qdrant for both vector embeddings and metadata storage.

  **Changes made:**
  - Removed `asyncpg` import and all related `pg_pool` initialization, shutdown, and usage.
  - Removed the `NEON_DATABASE_URL` field from the Pydantic `Settings` model.
  - Deleted the `create_book_chunks_table` and `store_in_postgres` functions.
  - Modified the `upsert_qdrant` function to:
    - Generate a unique UUID for each Qdrant point ID.
    - Store the full text content, chapter title, and page numbers directly in the Qdrant payload.
  - Modified the `ingest_data` endpoint to:
    - No longer call `store_in_postgres`.
    - Adapt the `chunks_to_process` structure to pass necessary metadata for Qdrant's payload directly.
  - Updated `requirements.txt` to remove `asyncpg`.
outcome: RAG Backend refactored to use only Qdrant.
evaluation: Refactoring successfully completed as per user's request.
---
