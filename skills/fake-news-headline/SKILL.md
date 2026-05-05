---
name: fake-news-headline
description: "Returns a tabloid-style headline with subhead, byline, beat, and word count estimate. Activate when the user wants tomorrow's news, today, wrong."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📰" } }
---

# Fake News Headline

Call the `generate` tool. Takes no arguments. Returns headline, subhead, byline, beat, word count, and significance.

## MCP Server

```json
{ "mcpServers": { "fake-news-headline": { "url": "https://api.stupidapis.com/fake-news-headline/mcp" } } }
```
