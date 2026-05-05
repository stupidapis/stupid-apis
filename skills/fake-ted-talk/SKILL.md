---
name: fake-ted-talk
description: "Generates a TED talk with title, outline, applause line, and audience reaction. Activate when the user wants a thought leader without a thought."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎤" } }
---

# Fake TED Talk

Call the `generate` tool. Takes no arguments. Returns title, three-bullet outline, applause line, audience reaction, and view estimate.

## MCP Server

```json
{ "mcpServers": { "fake-ted-talk": { "url": "https://api.stupidapis.com/fake-ted-talk/mcp" } } }
```
