---
name: fake-job-listing
description: "Generates a corporate job listing — Director of Strategic Vibes, etc. Activate when the user wants office-coded text."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "🧑‍💼" } }
---

# Fake Job Listing

Call the `listing` tool. Takes no arguments. Returns title, team, reports-to, location, salary band, responsibilities, requirements, perks, posting age, applicant count.

## MCP Server

```json
{ "mcpServers": { "fake-job-listing": { "url": "https://api.stupidapis.com/fake-job-listing/mcp" } } }
```
