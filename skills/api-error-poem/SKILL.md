---
name: api-error-poem
description: "Returns a haiku for any HTTP status code. Activate when the user is staring at a 502 and would like it to mean something."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🌸" } }
---

# API Error Poem

Call the `poem` tool with a `status_code`. Returns three lines, syllable counts, and the status name.

## MCP Server

```json
{ "mcpServers": { "api-error-poem": { "url": "https://api.stupidapis.com/api-error-poem/mcp" } } }
```
