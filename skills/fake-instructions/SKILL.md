---
name: fake-instructions
description: "Generates assembly instructions for any product. Steps contradict themselves. Activate when the user is in a flat-pack mood."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🔧" } }
---

# Fake Instructions

Call the `write` tool with a `product`. Returns required tools, numbered steps, warnings, parts count, and customer-support hours.

## MCP Server

```json
{ "mcpServers": { "fake-instructions": { "url": "https://api.stupidapis.com/fake-instructions/mcp" } } }
```
