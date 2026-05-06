---
name: fake-error-message
description: "Returns a fake system error dialog with title, body, buttons, and severity. Activate when the user wants a 'File is happy. Cannot save happy files.' moment."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "⚠️" } }
---

# Fake Error Message

Call the `generate` tool. Optional `severity`: `warning`, `error`, `critical`, `philosophical`.

## MCP Server

```json
{ "mcpServers": { "fake-error-message": { "url": "https://api.stupidapis.com/fake-error-message/mcp" } } }
```
