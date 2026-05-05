---
name: medieval-job-title
description: "Convert a modern job title to its medieval equivalent. Returns court role, responsibilities, and a usable email signature. Activate when the user wants to spice up their LinkedIn."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🏰" } }
---

# Medieval Job Title

Call the `convert` tool with a `title`. Returns the medieval title, court role, three responsibilities, and an email signature.

## MCP Server

```json
{ "mcpServers": { "medieval-job-title": { "url": "https://api.stupidapis.com/medieval-job-title/mcp" } } }
```
