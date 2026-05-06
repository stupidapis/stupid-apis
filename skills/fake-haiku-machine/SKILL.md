---
name: fake-haiku-machine
description: "Composes a 5-7-5 haiku on any topic with a syllable-count estimate. Activate when the user wants something brief and slightly serious."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🌸" } }
---

# Fake Haiku Machine

Call the `compose` tool with a `topic`. Returns the three lines, syllable count estimate per line, and a meter warning if the topic is long.

## MCP Server

```json
{ "mcpServers": { "fake-haiku-machine": { "url": "https://api.stupidapis.com/fake-haiku-machine/mcp" } } }
```
