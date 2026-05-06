---
name: fake-tournament-bracket
description: "Runs a single-elimination bracket between 8 things. Deterministic by input. Activate when the user wants a settled answer to a list of competing items."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🏆" } }
---

# Fake Tournament Bracket

Call the `bracket` tool with `things` (exactly 8 strings). Returns each round, the champion, and a verdict on the bracket.

## MCP Server

```json
{ "mcpServers": { "fake-tournament-bracket": { "url": "https://api.stupidapis.com/fake-tournament-bracket/mcp" } } }
```
