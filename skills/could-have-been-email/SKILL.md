---
name: could-have-been-email
description: "Analyze a meeting transcript to determine if it could have been an email. Generates the email that should have been sent instead."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📧" } }
---

# Could Have Been An Email

Call the `analyze` tool with `transcript`. Optional: `duration` (minutes), `attendee_count`, `recurring` (boolean).

## MCP Server

```json
{ "mcpServers": { "could-have-been-email": { "url": "https://api.stupidapis.com/could-have-been-email/mcp" } } }
```
