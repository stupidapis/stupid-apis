---
name: fake-obituary
description: "Generates a dignified obituary for a fictional person. Activate when the user wants to honor someone who did not exist."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🕯️" } }
---

# Fake Obituary

Call the `generate` tool. Takes no arguments. Returns name, dates, age, hometown, occupation, the text, who they are survived by, service note, and flowers/donations.

## MCP Server

```json
{ "mcpServers": { "fake-obituary": { "url": "https://api.stupidapis.com/fake-obituary/mcp" } } }
```
