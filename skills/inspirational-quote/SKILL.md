---
name: inspirational-quote
description: "Returns a motivational quote attributed to a famous person who almost certainly did not say it. Activate when the user needs a slide-deck closer."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "💬" } }
---

# Inspirational Quote

Call the `generate` tool. Takes no arguments. Returns the quote, its (incorrect) attribution, the actual (also fake) source, and an authenticity warning.

## MCP Server

```json
{ "mcpServers": { "inspirational-quote": { "url": "https://api.stupidapis.com/inspirational-quote/mcp" } } }
```
