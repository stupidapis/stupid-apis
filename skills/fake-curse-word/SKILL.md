---
name: fake-curse-word
description: "Invents a fictional curse word with usage notes and an example sentence. Activate when the user needs an expletive that nobody can object to."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🤬" } }
---

# Fake Curse Word

Call the `generate` tool. Takes no arguments. Returns word, pronunciation, part of speech, usage, example sentence, intensity, jurisdictions, censorship recommendation.

## MCP Server

```json
{ "mcpServers": { "fake-curse-word": { "url": "https://api.stupidapis.com/fake-curse-word/mcp" } } }
```
