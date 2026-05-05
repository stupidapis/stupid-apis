---
name: buzzword-density
description: "Analyze buzzword density in text. Counts industry-specific buzzwords, scores density, diagnoses severity. Optional roast mode."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🔬" } }
---

# Buzzword Density Analyzer

Call the `analyze` tool with `content`. Optional: `industry` (tech/finance/consulting/startup/all), `roast=true`.

## MCP Server

```json
{ "mcpServers": { "buzzword-density": { "url": "https://api.stupidapis.com/buzzword-density/mcp" } } }
```
