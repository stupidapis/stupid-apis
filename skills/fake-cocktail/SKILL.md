---
name: fake-cocktail
description: "Invents a cocktail with absurd ingredients and a tragic backstory. Activate when the user wants something to drink and a story to tell about it."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🍸" } }
---

# Fake Cocktail

Call the `invent` tool. Takes no arguments. Returns name, ingredients, glassware, method, garnish, ABV estimate, and a backstory.

## MCP Server

```json
{ "mcpServers": { "fake-cocktail": { "url": "https://api.stupidapis.com/fake-cocktail/mcp" } } }
```
