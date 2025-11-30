---
id: "61"
title: "Fix Qdrant search method deprecation"
stage: "green"
date: "2025-11-30"
surface: "agent"
model: "gemini-2.5-flash-image"
feature: "docusaurus-chatbot-ui"
branch: "main"
user: "YOusuf Traders"
command: "ERROR:main:Error searching Qdrant: 'AsyncQdrantClient' object has no attribute 'search'"
labels:
  - "bugfix"
  - "qdrant"
  - "backend"
links:
  spec: "null"
files_yaml:
  - "main.py"
tests_yaml: []
prompt_text: |
  ERROR:main:Error searching Qdrant: 'AsyncQdrantClient' object has no attribute 'search'
response_text: |
  I've fixed the error in `main.py`.
  
  **The Issue:**
  The `qdrant-client` library (version 1.16.1) uses `query_points` instead of `search` for finding vectors in its async client.
  
  **The Fix:**
  I updated the `search_qdrant` function in `main.py` to use the correct method: `qdrant_client.query_points`.
  
  **Action Required:**
  The `uvicorn` server should automatically reload with this change. If it doesn't, please stop it (Ctrl+C) and start it again:
  ```bash
  uvicorn main:app --reload
  ```
  
  Then try asking your question about "physical AI" again!
---
