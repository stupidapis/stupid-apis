---
name: what-would-x-say
description: "Imagines what a person (real or archetypal) would say about a topic. Activate when the user wants a fake quote in a recognizable voice."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🗣️" } }
---

# What Would X Say

Call the `imagine` tool with a `person` and a `topic`. Returns a quote in their style, the matched archetype, fidelity rating, and a delivery note.

## MCP Server

```json
{ "mcpServers": { "what-would-x-say": { "url": "https://api.stupidapis.com/what-would-x-say/mcp" } } }
```
