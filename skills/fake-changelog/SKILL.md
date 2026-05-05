---
name: fake-changelog
description: "Generates a passive-aggressive software changelog. Activate when the user is shipping nothing and needs to announce it."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📋" } }
---

# Fake Changelog

Call the `generate` tool with a `version` string. Returns fixed / added / changed / removed / known_issues sections.

## MCP Server

```json
{ "mcpServers": { "fake-changelog": { "url": "https://api.stupidapis.com/fake-changelog/mcp" } } }
```
