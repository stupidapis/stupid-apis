---
name: fake-recipe
description: "Generates a recipe with cursed ingredients and steps. Activate when the user wants to cook something with the energy of a haunted dinner party."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🥘" } }
---

# Fake Recipe

Call the `generate` tool. Takes no arguments. Returns dish name, serves, times, ingredients, steps, pairing, and difficulty.

## MCP Server

```json
{ "mcpServers": { "fake-recipe": { "url": "https://api.stupidapis.com/fake-recipe/mcp" } } }
```
