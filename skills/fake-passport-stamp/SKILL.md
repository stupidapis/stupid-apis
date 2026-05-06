---
name: fake-passport-stamp
description: "Returns a passport stamp from an invented country with visa type, duration, and customs note. Activate when the user wants to claim a place."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🛂" } }
---

# Fake Passport Stamp

Call the `stamp` tool. Takes no arguments. Returns country, entry port, date, visa type, duration, purpose, stamp description, customs note, and exit-by date.

## MCP Server

```json
{ "mcpServers": { "fake-passport-stamp": { "url": "https://api.stupidapis.com/fake-passport-stamp/mcp" } } }
```
