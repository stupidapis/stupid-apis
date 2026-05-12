---
name: ministry-of-information
description: "Issues a bulletin from a generic Ministry of Information — bureaucratic, numbered, signed, distributed. Activate when the user wants official-sounding officialese."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📢" } }
---

# Ministry of Information

Call the `issue` tool. Takes no arguments. Returns the bulletin number, title, body, signatory, achievements, condemnations, classification, distribution, and the next bulletin's appointed hour.

## MCP Server

```json
{ "mcpServers": { "ministry-of-information": { "url": "https://api.stupidapis.com/ministry-of-information/mcp" } } }
```
