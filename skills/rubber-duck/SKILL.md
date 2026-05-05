---
name: rubber-duck
description: "Describe a bug, get back classic debugging questions from a rubber duck. The duck does not read your bug. The duck only listens. Activate when the user is stuck and needs to talk it out."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🦆" } }
---

# Rubber Duck

Call the `consult` tool with a `bug` describing what is going wrong. The duck returns 3–5 cliched debugging questions, a closer, and a confidence rating.

## MCP Server

```json
{ "mcpServers": { "rubber-duck": { "url": "https://api.stupidapis.com/rubber-duck/mcp" } } }
```
