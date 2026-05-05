---
name: fake-restaurant-menu
description: "Generates a pretentious restaurant menu with starters, mains, desserts, and a footnote. Activate when the user wants to dread eating."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🍽️" } }
---

# Fake Restaurant Menu

Call the `generate` tool. Takes no arguments. Returns restaurant name, cuisine, three starters, four mains, two desserts, footnote, and reservation window.

## MCP Server

```json
{ "mcpServers": { "fake-restaurant-menu": { "url": "https://api.stupidapis.com/fake-restaurant-menu/mcp" } } }
```
