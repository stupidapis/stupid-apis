---
name: fake-horoscope
description: "Returns a daily horoscope: vague mysticism plus mundane warnings. Activate when the user provides a zodiac sign and wants cosmic justification for staying inside."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🔮" } }
---

# Fake Horoscope

Call the `read` tool with a `sign` (aries through pisces, lowercase). Returns the reading, lucky color, unlucky object, emotional forecast, and cosmic advice.

## MCP Server

```json
{ "mcpServers": { "fake-horoscope": { "url": "https://api.stupidapis.com/fake-horoscope/mcp" } } }
```
