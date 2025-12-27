---
description: Run a Docker image for the current project, intelligently detecting configuration.
---

## User Input

```text
$ARGUMENTS
```

## Outline

1. **Analyze Context**:
   - Identify if a Docker image has been recently built or is available locally.
   - Determine image name and tag (default to project name or user input).
   - Scan project for common application ports (e.g., `package.json` for Node.js, `requirements.txt` for Python, `docker-compose.yml` for defined services).

2. **Determine Run Strategy**:
   - Construct the run command: `docker run -p <host-port>:<container-port> --name <container-name> <image-name>:latest` (or similar).
   - If `docker-compose.yml` exists and defines services, offer to use `docker-compose up`.
   - If no image name provided, suggest recently built images or ask the user to specify.

3. **Execute Run**:
   - Execute the command and stream output.
   - Verify success (container starts, port mapping successful).

4. **Post-Run Report**:
   - Report container ID and status.
   - Suggest next steps (e.g., `docker logs`, `docker stop`).

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.
