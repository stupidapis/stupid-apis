---
name: fake-property-listing
description: "Generates a real estate listing for any address with one delicate quirk ('Haunted'). Activate when the user wants to flip something that does not exist."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🏘️" } }
---

# Fake Property Listing

Call the `listing` tool with an `address`. Returns headline, specs, price, highlights, quirk, neighborhood note, status, and agent.

## MCP Server

```json
{ "mcpServers": { "fake-property-listing": { "url": "https://api.stupidapis.com/fake-property-listing/mcp" } } }
```
