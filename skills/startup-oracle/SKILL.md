---
name: startup-oracle
description: "Evaluate a startup idea. Returns a brutal verdict, pivots required, funny comparable, YC rejection reason, and actual TAM (always $4 trillion)."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🚀" } }
---

# Is This a Good Startup Idea?

Call the `evaluate` tool with `idea`. Optional: `have_you_talked_to_users`, `is_it_uber_for`, `vc_buzzword_count`.

## MCP Server

```json
{ "mcpServers": { "startup-oracle": { "url": "https://api.stupidapis.com/startup-oracle/mcp" } } }
```
