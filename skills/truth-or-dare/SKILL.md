---
name: truth-or-dare
description: "Returns a truth question or a dare. Activate when the user has run out of icebreakers."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎲" } }
---

# Truth or Dare

Call the `pick` tool. Optional `mode`: `truth`, `dare`, or `either` (default).

## MCP Server

```json
{ "mcpServers": { "truth-or-dare": { "url": "https://api.stupidapis.com/truth-or-dare/mcp" } } }
```
