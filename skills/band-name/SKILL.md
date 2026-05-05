---
name: band-name
description: "Generates a fake band: name, genre, hit song, hit year, breakup year, and legacy. Activate when the user is naming a band, a project, or a side hustle."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎸" } }
---

# Band Name

Call the `generate` tool. Takes no arguments. Returns one band's full discography in summary form.

## MCP Server

```json
{ "mcpServers": { "band-name": { "url": "https://api.stupidapis.com/band-name/mcp" } } }
```
