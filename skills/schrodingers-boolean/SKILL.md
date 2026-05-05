---
name: schrodingers-boolean
description: "Submit a question to Schrödinger's Boolean. Answer exists in superposition until observed. Supports cat mode and interpretation."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🐱" } }
---

# Schrödinger's Boolean

Call the `evaluate` tool with a question. Optional: `observe=true` (collapse), `cat=true`, `interpret=true`, `reopen=true` (will error).

## MCP Server

```json
{ "mcpServers": { "schrodingers-boolean": { "url": "https://api.stupidapis.com/schrodingers-boolean/mcp" } } }
```
