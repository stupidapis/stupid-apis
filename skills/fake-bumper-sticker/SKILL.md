---
name: fake-bumper-sticker
description: "Returns a single bumper sticker slogan with placement, font, and regret estimate. Activate when the user wants to broadcast something quietly."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🚗" } }
---

# Fake Bumper Sticker

Call the `generate` tool. Takes no arguments. Returns slogan, placement, regret estimate, font, vehicle recommendation.

## MCP Server

```json
{ "mcpServers": { "fake-bumper-sticker": { "url": "https://api.stupidapis.com/fake-bumper-sticker/mcp" } } }
```
