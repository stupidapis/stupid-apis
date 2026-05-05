---
name: fake-etymology
description: "Returns a made-up etymology for any word: origin language, proto-form, original meaning, and development. Activate when the user wants to win a Scrabble argument."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📚" } }
---

# Fake Etymology

Call the `trace` tool with a `word`. Returns origin language, proto-form, original meaning, development, cognates, and first attestation.

## MCP Server

```json
{ "mcpServers": { "fake-etymology": { "url": "https://api.stupidapis.com/fake-etymology/mcp" } } }
```
