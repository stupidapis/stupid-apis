---
name: jargon-translator
description: "Translate between corporate jargon and plain English. Bidirectional. Formality modes: passive_aggressive, enthusiastic, defeated."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🗣️" } }
---

# Jargon Translator

Call the `translate` tool with `content` and `direction` (corporate_to_english / english_to_corporate). Optional: `formality` (passive_aggressive/enthusiastic/defeated).

## MCP Server

```json
{ "mcpServers": { "jargon-translator": { "url": "https://api.stupidapis.com/jargon-translator/mcp" } } }
```
