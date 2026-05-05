---
name: cat-fact-but-fake
description: "Returns a confidently incorrect cat fact with a fake source. Activate when the user wants a cat fact, except wrong."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🐈" } }
---

# Cat Fact But Fake

Call the `fact` tool. Takes no arguments. Returns a fake cat fact, a fake source, and total confidence.

## MCP Server

```json
{ "mcpServers": { "cat-fact-but-fake": { "url": "https://api.stupidapis.com/cat-fact-but-fake/mcp" } } }
```
