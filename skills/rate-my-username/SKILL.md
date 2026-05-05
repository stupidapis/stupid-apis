---
name: rate-my-username
description: "Rates a username out of 10 with style, era guess, and a replacement strategy. Activate when the user is registering for something."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "👤" } }
---

# Rate My Username

Call the `rate` tool with a `username`. Returns rating, style, era guess, replacement strategy, example replacement, and vibe.

## MCP Server

```json
{ "mcpServers": { "rate-my-username": { "url": "https://api.stupidapis.com/rate-my-username/mcp" } } }
```
