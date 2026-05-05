---
name: alignment-chart
description: "Places any thing on a D&D alignment chart with reasoning. Deterministic by input. Activate when the user is settling a debate."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🎲" } }
---

# Alignment Chart

Call the `place` tool with a `thing`. Returns the alignment, axis breakdown, reasoning, and alternative reading.

## MCP Server

```json
{ "mcpServers": { "alignment-chart": { "url": "https://api.stupidapis.com/alignment-chart/mcp" } } }
```
