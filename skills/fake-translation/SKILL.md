---
name: fake-translation
description: "Translates English into a fake language with confident grammar rules. Activate when the user wants the appearance of multilingual capability."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🗺️" } }
---

# Fake Translation

Call the `translate` tool with `english` and `language`. Returns the translation, pronunciation guide, register, and grammar note.

## MCP Server

```json
{ "mcpServers": { "fake-translation": { "url": "https://api.stupidapis.com/fake-translation/mcp" } } }
```
