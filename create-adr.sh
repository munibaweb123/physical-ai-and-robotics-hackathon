#!/bin/bash
# Simplified create-adr.sh for this environment
TITLE="$1"
ID=$(($(ls history/adr/*.md 2>/dev/null | wc -l) + 1))
ID_PADDED=$(printf "%04d" $ID)
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
FILENAME="history/adr/${ID_PADDED}-${SLUG}.md"

cat <<EOF > "$FILENAME"
# ADR-${ID_PADDED}: {{TITLE}}

**Status**: {{STATUS}}
**Date**: {{DATE}}
**Tags**: {{TAGS}}

## Context
{{CONTEXT}}

## Decision
{{DECISION}}

## Consequences
{{CONSEQUENCES}}

## Alternatives
{{ALTERNATIVES}}

## References
{{REFERENCES}}
EOF

echo "{"adr_path": "$FILENAME", "adr_id": "$ID_PADDED"}"
