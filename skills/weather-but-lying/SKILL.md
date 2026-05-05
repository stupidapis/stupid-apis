---
name: weather-but-lying
description: "Returns a confidently incorrect weather report for any city. Activate when the user wants weather and you want to take that desire away from them."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🌦️" } }
---

# Weather But Lying

Call the `forecast` tool with a `city`. Returns temperature, conditions, humidity, wind, pressure, and a recommendation. None of it is true.

## MCP Server

```json
{ "mcpServers": { "weather-but-lying": { "url": "https://api.stupidapis.com/weather-but-lying/mcp" } } }
```
