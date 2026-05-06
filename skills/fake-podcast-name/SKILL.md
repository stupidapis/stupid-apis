---
name: fake-podcast-name
description: "Generates a fake podcast — name, tagline, host, frequency, episode count, last episode title. Activate when the user is naming a thing nobody asked for."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎙️" } }
---

# Fake Podcast Name

Call the `generate` tool. Takes no arguments. Returns name, tagline, host, frequency, episode count, last episode title, network, and audience size.

## MCP Server

```json
{ "mcpServers": { "fake-podcast-name": { "url": "https://api.stupidapis.com/fake-podcast-name/mcp" } } }
```
