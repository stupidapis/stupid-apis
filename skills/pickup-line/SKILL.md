---
name: pickup-line
description: "Returns a pickup line by category with the estimated rejection rate. Activate when the user wants to make a worse first impression."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "💔" } }
---

# Pickup Line

Call the `line` tool. Optional `category`: `nerd`, `food`, `science`, or `terrible`. Default: terrible.

## MCP Server

```json
{ "mcpServers": { "pickup-line": { "url": "https://api.stupidapis.com/pickup-line/mcp" } } }
```
