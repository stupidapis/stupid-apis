---
name: fake-warning-label
description: "Returns a warning label for any object. Symbol, warning, precautions, jurisdiction. Activate when the user wants to over-disclaim something."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "⚠️" } }
---

# Fake Warning Label

Call the `label` tool with an `object`. Returns symbol, header, warning, three precautions, jurisdiction note, and certification.

## MCP Server

```json
{ "mcpServers": { "fake-warning-label": { "url": "https://api.stupidapis.com/fake-warning-label/mcp" } } }
```
