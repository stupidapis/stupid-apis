---
name: insult-my-code
description: "Returns a snarky code review with structural, style, and semantic critiques. The review does not read your code. The review has opinions."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "💻" } }
---

# Insult My Code

Call the `review` tool with a `language`. Returns three critiques (structural, style, semantic), a verdict, a recommended next step, and the reviewer's mood.

## MCP Server

```json
{ "mcpServers": { "insult-my-code": { "url": "https://api.stupidapis.com/insult-my-code/mcp" } } }
```
