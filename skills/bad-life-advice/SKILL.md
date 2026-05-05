---
name: bad-life-advice
description: "Returns confidently terrible life advice with attributed source and regret estimate. Activate when the user is at a crossroads and wants the wrong answer."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🪧" } }
---

# Bad Life Advice

Call the `advise` tool. Takes no arguments. Returns advice, confidence, source, and a regret estimate.

## MCP Server

```json
{ "mcpServers": { "bad-life-advice": { "url": "https://api.stupidapis.com/bad-life-advice/mcp" } } }
```
