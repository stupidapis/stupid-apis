---
name: fake-historical-event
description: "Returns a fake historical event for any date. Activate when the user wants to know what happened on this day in history (and is willing to be misled)."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📅" } }
---

# Fake Historical Event

Call the `lookup` tool with a `date` (any format). Returns a year, event description, significance, source, and verifiability rating.

## MCP Server

```json
{ "mcpServers": { "fake-historical-event": { "url": "https://api.stupidapis.com/fake-historical-event/mcp" } } }
```
