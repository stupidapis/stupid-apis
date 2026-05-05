---
name: personality-test
description: "Asks one absurd question and assigns a personality type like 'INFJ-Toaster'. Activate when the user wants a label."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🧠" } }
---

# Personality Test

Two tools:
- `ask`: returns one absurd personality question
- `analyze`: takes the question + your answer, returns a type, traits, and compatibility

## MCP Server

```json
{ "mcpServers": { "personality-test": { "url": "https://api.stupidapis.com/personality-test/mcp" } } }
```
