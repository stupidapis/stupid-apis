---
name: ship-on-friday
description: "Check whether you should ship on Friday. Always no. Supports deploy type (hotfix/feature/refactor) and team size. Activate when someone mentions Friday deploys."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🚨" } }
---

# Should I Ship on Friday?

Call the `check` tool. Optional params: `deploy_type`, `team_size`, `is_friday` (override).

## MCP Server

```json
{ "mcpServers": { "ship-on-friday": { "url": "https://api.stupidapis.com/ship-on-friday/mcp" } } }
```
