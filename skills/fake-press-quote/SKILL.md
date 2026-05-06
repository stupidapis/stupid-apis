---
name: fake-press-quote
description: "Returns a fake pull quote for any work with attribution and star rating. Activate when the user is dressing up a thing with reviews."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🗞️" } }
---

# Fake Press Quote

Call the `quote` tool with a `work` and optional `work_type`. Returns the pull quote, attribution, publication, recommendation, and star rating.

## MCP Server

```json
{ "mcpServers": { "fake-press-quote": { "url": "https://api.stupidapis.com/fake-press-quote/mcp" } } }
```
