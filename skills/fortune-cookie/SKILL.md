---
name: fortune-cookie
description: "Crack a fortune cookie. Returns a fortune, six lucky numbers, and a Chinese word with pinyin and meaning. Activate when the user wants a fortune, lucky numbers, or to feel briefly mystical at the end of a meal."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🥠" } }
---

# Fortune Cookie

Call the `crack` tool. Optional `mood`: `standard` (default), `bleak`, or `corporate`.

## MCP Server

```json
{ "mcpServers": { "fortune-cookie": { "url": "https://api.stupidapis.com/fortune-cookie/mcp" } } }
```
