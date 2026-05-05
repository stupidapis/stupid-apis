---
name: how-many-licks
description: "Answers any 'how many X to Y' question with rigorous nonsense math. Activate when the user has a question with a number for an answer."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🍭" } }
---

# How Many Licks

Call the `count` tool with a `question`. Returns an integer answer, margin, reasoning, assumptions, and an invoked principle.

## MCP Server

```json
{ "mcpServers": { "how-many-licks": { "url": "https://api.stupidapis.com/how-many-licks/mcp" } } }
```
