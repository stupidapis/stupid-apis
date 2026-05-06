---
name: rejection-letter
description: "Drafts a polite, vague rejection letter for any kind of submission. Activate when the user needs to say no in many words."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📭" } }
---

# Rejection Letter

Call the `write` tool with a `kind` (`job`, `grant`, `paper`, `manuscript`, `pitch`, `application`) and optional `name`. Returns greeting, body, closing, signatory, and a vagueness score.

## MCP Server

```json
{ "mcpServers": { "rejection-letter": { "url": "https://api.stupidapis.com/rejection-letter/mcp" } } }
```
