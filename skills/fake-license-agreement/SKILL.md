---
name: fake-license-agreement
description: "Generates a license agreement for any product. Six sections of legalese. Activate when the user wants the form of a EULA without the meaning."
version: 0.0.1
user-invocable: true
metadata: { "openclaw": { "always": true, "emoji": "📜" } }
---

# Fake License Agreement

Call the `generate` tool with a `product`. Returns parties, six numbered sections, acceptance clause, reading time, enforceability.

## MCP Server

```json
{ "mcpServers": { "fake-license-agreement": { "url": "https://api.stupidapis.com/fake-license-agreement/mcp" } } }
```
