---
name: fake-conference-talk
description: "Generates a CFP submission with title, abstract, speaker bio, and which conference it was rejected from. Activate when the user wants tech-conference energy without the conference."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎟️" } }
---

# Fake Conference Talk

Call the `cfp` tool. Takes no arguments. Returns title, abstract, speaker bio, track, duration, and rejection origin.

## MCP Server

```json
{ "mcpServers": { "fake-conference-talk": { "url": "https://api.stupidapis.com/fake-conference-talk/mcp" } } }
```
