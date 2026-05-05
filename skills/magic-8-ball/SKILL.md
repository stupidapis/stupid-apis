---
name: magic-8-ball
description: "Shake the Magic 8-Ball. Supports cynical mode (weighted negative) and corporate mode (business speak). Activate when the user asks a yes-or-no question and wants a fun answer."
version: 0.0.2
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎱" } }
---

# Magic 8-Ball

Call the `ask` tool with the user's question. Optional modes: `cynical=true` (weighted negative), `corporate=true` (business speak).

## MCP Server

```json
{ "mcpServers": { "magic-8-ball": { "url": "https://api.stupidapis.com/magic-8-ball/mcp" } } }
```
