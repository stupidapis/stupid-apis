---
name: fake-airbnb-listing
description: "Generates an Airbnb-style listing for any location, with quirks like 'the owl considers itself a roommate'. Activate when the user wants to feel like a host."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🏠" } }
---

# Fake Airbnb Listing

Call the `list` tool with a `location`. Returns title, description, host note, sleeps, amenities, quirks, rating, and price per night.

## MCP Server

```json
{ "mcpServers": { "fake-airbnb-listing": { "url": "https://api.stupidapis.com/fake-airbnb-listing/mcp" } } }
```
