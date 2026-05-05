---
name: fake-museum-plaque
description: "Writes a museum plaque for any object: title, period, materials, provenance, significance, viewing note, catalog number. Activate when the user wants to elevate the mundane."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🏛️" } }
---

# Fake Museum Plaque

Call the `describe` tool with an `object`. Returns the full plaque with provenance and viewing instructions.

## MCP Server

```json
{ "mcpServers": { "fake-museum-plaque": { "url": "https://api.stupidapis.com/fake-museum-plaque/mcp" } } }
```
