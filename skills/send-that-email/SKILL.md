---
name: send-that-email
description: "Analyze whether you should send that email. Scores passive aggression, regret probability, and provides a recommendation (weighted toward no)."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📧" } }
---

# Should I Send That Email?

Call the `analyze` tool with `content`. Optional: `recipient_type` (boss/ex/investor/mom), `time_since_writing` (minutes), `drunk` (boolean).

## MCP Server

```json
{ "mcpServers": { "send-that-email": { "url": "https://api.stupidapis.com/send-that-email/mcp" } } }
```
