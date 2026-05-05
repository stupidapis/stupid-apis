---
name: passive-aggression
description: "Detect passive aggression in text. Scores severity, identifies phrases, translates to plain English, suggests a response."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "😊" } }
---

# Passive Aggression Detector

Call the `detect` tool with `content`. Optional: `context` (email/slack/text/review), `relationship` (boss/coworker/ex/vendor/mom/investor/self).

## MCP Server

```json
{ "mcpServers": { "passive-aggression": { "url": "https://api.stupidapis.com/passive-aggression/mcp" } } }
```
