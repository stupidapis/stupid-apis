---
name: fake-self-help-book
description: "Generates a fake self-help book: title, subtitle, author, chapters, endorsement, publisher note. Activate when the user is browsing an airport bookstore."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📖" } }
---

# Fake Self-Help Book

Call the `generate` tool. Takes no arguments. Returns title, subtitle, author, six chapters, endorsement, publisher note, page count, and shelf position.

## MCP Server

```json
{ "mcpServers": { "fake-self-help-book": { "url": "https://api.stupidapis.com/fake-self-help-book/mcp" } } }
```
