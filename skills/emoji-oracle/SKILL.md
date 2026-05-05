---
name: emoji-oracle
description: "Consult the Emoji Oracle. Responds with a cryptic emoji prophecy and vibe check. Supports interpretation and custom emoji count."
version: 0.0.2
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🔮" } }
---

# Emoji Oracle

Call the `consult` tool with the question. Optional: `interpret=true`, `emoji_count` (1-5).

## MCP Server

```json
{ "mcpServers": { "emoji-oracle": { "url": "https://api.stupidapis.com/emoji-oracle/mcp" } } }
```
