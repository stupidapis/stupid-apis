---
name: fake-nutrition-label
description: "Generates a Nutrition Facts label for any abstract item with abstract nutrients. Activate when the user wants to quantify the unquantifiable."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🥄" } }
---

# Fake Nutrition Label

Call the `label` tool with an `item`. Returns serving size, calories, six abstract nutrients with daily values, ingredients, and a footer.

## MCP Server

```json
{ "mcpServers": { "fake-nutrition-label": { "url": "https://api.stupidapis.com/fake-nutrition-label/mcp" } } }
```
