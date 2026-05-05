---
name: band-breakup-reason
description: "Explains why a band broke up. Activate when the user has a band (real or fake) and wants closure, falsely."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🥁" } }
---

# Band Breakup Reason

Call the `explain` tool with a `band` name. Returns the reason, final gig location, reunion probability, postscript, and documentary status.

## MCP Server

```json
{ "mcpServers": { "band-breakup-reason": { "url": "https://api.stupidapis.com/band-breakup-reason/mcp" } } }
```
