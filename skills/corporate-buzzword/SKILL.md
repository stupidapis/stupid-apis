---
name: corporate-buzzword
description: "Generates corporate buzzword text in various lengths. Activate when the user needs to fill a slide, an email, or a meeting."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "💼" } }
---

# Corporate Buzzword

Call the `generate` tool. Optional `format`: `phrase`, `sentence`, `paragraph`, or `vision`. Default: sentence.

## MCP Server

```json
{ "mcpServers": { "corporate-buzzword": { "url": "https://api.stupidapis.com/corporate-buzzword/mcp" } } }
```
