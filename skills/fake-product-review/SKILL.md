---
name: fake-product-review
description: "Generates a fake product review weighted by star count. Activate when the user wants opinions on a product nobody bought."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "⭐" } }
---

# Fake Product Review

Call the `review` tool with a `product` and optional `stars` (1-5, default 3). Returns headline, body, reviewer, verified-purchase status, helpful votes, and post date.

## MCP Server

```json
{ "mcpServers": { "fake-product-review": { "url": "https://api.stupidapis.com/fake-product-review/mcp" } } }
```
