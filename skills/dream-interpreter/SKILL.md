---
name: dream-interpreter
description: "Returns a Freudian-flavored interpretation of any dream. Generic, confident, non-binding. Activate when the user has had a dream and wants to be told what it meant."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "💭" } }
---

# Dream Interpreter

Call the `interpret` tool with a `dream` description. Returns a primary symbol reading, a Freudian interpretation, a recommendation, and a disclaimer.

## MCP Server

```json
{ "mcpServers": { "dream-interpreter": { "url": "https://api.stupidapis.com/dream-interpreter/mcp" } } }
```
