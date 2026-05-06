---
name: social-entropy
description: "Generate a random number from the social entropy of 5 Reddit sources. The internet's collective posting behavior determines your number. Activate when the user wants randomness with a thin justification."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🌀" } }
---

# Social Entropy

Call the `generate` tool. Optional `sources`: comma-separated list of up to 5 subreddits or users (e.g. `"technology,worldnews,u/spez"`). Defaults to a curated set of five subreddits.

Returns a number 0-99 derived from upvotes, comments, age, and title length on each source's most recent hot post, plus a short Haiku-written analysis explaining why this number was inevitable.

## MCP Server

```json
{ "mcpServers": { "social-entropy": { "url": "https://api.stupidapis.com/social-entropy/mcp" } } }
```
