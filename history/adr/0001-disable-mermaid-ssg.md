# ADR-0001: Disable Mermaid SSG Rendering

**Status**: Accepted
**Date**: 2025-11-29
**Tags**: docusaurus, mermaid, build-infrastructure

## Context
During the implementation of the Physical AI Course Book using Docusaurus, the build process failed during Static Site Generation (SSG). The error `ReactContextError: Hook useColorMode is called outside the <ColorModeProvider>` occurred when rendering the Mermaid diagram in `docs/capstone/autonomous-humanoid.md`.

This issue arises because the `@docusaurus/theme-mermaid` plugin attempts to access the theme's color context (light/dark mode) during the server-side rendering phase to style the diagrams. However, this context is not fully available or correctly initialized in the SSG environment for this plugin version, causing the build to crash.

## Decision
We decided to **temporarily disable Mermaid diagram rendering** by converting the `mermaid` code blocks to plain `text` blocks in the Markdown files.

This decision allows the build pipeline (`npm run build`) to succeed and the site to be deployed, ensuring the delivery of the core content and structure. We prioritize the availability of the documentation site over the visual rendering of a single diagram in the Capstone section.

## Consequences
**Positive:**
- The Docusaurus project builds successfully.
- The site can be deployed to production.
- All text content is available to users.

**Negative:**
- The Capstone Project workflow flowchart is not rendered as a visual diagram; it appears as a code block of Mermaid syntax.
- Users must visualize the flow mentally or copy the code to an external renderer.

## Alternatives
1.  **Debug and Patch Theme Context**: Investigate the Docusaurus and Mermaid theme integration to mock or provide the `ColorModeProvider` context during SSG.
    *   *Pros*: Fixes the root cause, enables features.
    *   *Cons*: High effort, requires deep knowledge of Docusaurus internals, risks delaying the feature release.
2.  **Client-Side Only Rendering**: Configure Mermaid to render only on the client side, skipping SSG.
    *   *Pros*: Should bypass the SSG error.
    *   *Cons*: might cause layout shift (CLS) on load; configuration options for this specific plugin integration were not immediately obvious or documented as a quick fix.
3.  **Generate Static Images**: Manually generate the flowchart as a PNG/SVG and embed it.
    *   *Pros*: Guaranteed rendering, no build dependencies.
    *   *Cons*: Harder to maintain/edit source; deviates from "docs-as-code" philosophy for diagrams.

## References
- [Docusaurus Mermaid Plugin Documentation](https://docusaurus.io/docs/markdown-features/diagrams)
- `specs/001-physical-ai-docs/plan.md`
- Build Error Log: `ReactContextError: Hook useColorMode is called outside the <ColorModeProvider>`