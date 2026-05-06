---
name: breakup-text-generator
description: "Drafts a breakup text in five styles: cowardly, dramatic, corporate-pr, haiku, or honest. Activate when the user has decisions to make and wants drafts."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "💔" } }
---

# Breakup Text Generator

Call the `draft` tool. Optional `style`: `cowardly`, `dramatic`, `corporate-pr`, `haiku`, `honest` (default).

## MCP Server

```json
{ "mcpServers": { "breakup-text-generator": { "url": "https://api.stupidapis.com/breakup-text-generator/mcp" } } }
```
