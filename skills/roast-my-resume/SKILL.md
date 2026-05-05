---
name: roast-my-resume
description: "Roasts one resume bullet with formatting observation, rewrite strategy, and verdict. Activate when the user is between drafts."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📄" } }
---

# Roast My Resume

Call the `roast` tool with a `bullet`. Returns a formatting observation, a rewrite strategy, a verdict, a reception estimate, and remaining questions.

## MCP Server

```json
{ "mcpServers": { "roast-my-resume": { "url": "https://api.stupidapis.com/roast-my-resume/mcp" } } }
```
