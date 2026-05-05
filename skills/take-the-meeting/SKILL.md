---
name: take-the-meeting
description: "Evaluate whether a meeting is worth attending. Returns time cost, productivity coffins, email viability, and a polite decline template."
version: 0.0.3
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📅" } }
---

# Should I Take the Meeting?

Call the `evaluate` tool. Optional: `duration`, `attendee_count`, `has_agenda`, `recurring`, `could_be_email`.

## MCP Server

```json
{ "mcpServers": { "take-the-meeting": { "url": "https://api.stupidapis.com/take-the-meeting/mcp" } } }
```
