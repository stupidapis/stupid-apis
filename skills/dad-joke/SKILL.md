---
name: dad-joke
description: "Tell one dad joke with setup, punchline, groan factor, and a delivery note. Activate when the user wants a joke, an icebreaker, or something to text the family group chat."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "👔" } }
---

# Dad Joke

Call the `tell` tool. Optional `category`: `food`, `animals`, `puns`, `tech`, or `dad`.

## MCP Server

```json
{ "mcpServers": { "dad-joke": { "url": "https://api.stupidapis.com/dad-joke/mcp" } } }
```
