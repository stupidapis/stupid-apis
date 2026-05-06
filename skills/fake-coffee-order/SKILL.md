---
name: fake-coffee-order
description: "Generates a chaotic coffee order with size, temperature, base, milk, syrup, modifiers, and one absurd request. Activate when the user is the person ahead of you in line."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "☕" } }
---

# Fake Coffee Order

Call the `order` tool. Takes no arguments. Returns the full order line, individual components, price, prep time, barista response.

## MCP Server

```json
{ "mcpServers": { "fake-coffee-order": { "url": "https://api.stupidapis.com/fake-coffee-order/mcp" } } }
```
