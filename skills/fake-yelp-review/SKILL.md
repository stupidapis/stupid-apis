---
name: fake-yelp-review
description: "Generates a Yelp-style review for any business with one too many specifics. Activate when the user wants local-business judgment with attitude."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🍴" } }
---

# Fake Yelp Review

Call the `review` tool with `business` and optional `stars` (1-5, default 3). Returns title, body, reviewer, vote counts, photo count.

## MCP Server

```json
{ "mcpServers": { "fake-yelp-review": { "url": "https://api.stupidapis.com/fake-yelp-review/mcp" } } }
```
