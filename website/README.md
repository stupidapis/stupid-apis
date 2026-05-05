# StupidAPIs.com Website

Static site generated from JSON data files. No framework, no dependencies.

## Quick Start

```bash
node build.js                          # Generate all pages
python3 -m http.server -d pages/ 8080  # Serve locally
```

Open http://localhost:8080

## Adding a New API

1. Add an entry to `data/apis.json`
2. Run `node build.js`
3. That's it.

The build script generates:
- API detail page at `pages/apis/{id}.html`
- Updated homepage with the new API in the catalog
- Updated category page with the new API

### Required fields in apis.json

```json
{
  "id": "your-api-slug",
  "name": "Your API Name",
  "category": "decision-making",
  "tags": ["tag1", "tag2"],
  "description": "One-line description",
  "long_description": "Longer description for the API detail page",
  "stupidity": 1,
  "added_date": "2025-01-01",
  "call_count": 0,
  "base_url": "https://api.stupidapis.com/your-api-slug",
  "endpoints": [{ "method": "GET", "path": "/action", "description": "..." }],
  "parameters": [{ "name": "param", "type": "string", "required": true, "description": "..." }],
  "response_schema": [{ "field": "result", "type": "string", "description": "..." }],
  "examples": { "curl": "...", "python": "...", "javascript": "...", "response": {} },
  "mock_responses": [{}],
  "clippy_message": "It looks like you're..."
}
```

### Adding a New Category

Add an entry to `data/categories.json` and rebuild.

## File Structure

```
website/
├── data/
│   ├── apis.json           # All API definitions
│   └── categories.json     # Category definitions
├── assets/
│   ├── css/
│   │   ├── base.css        # Layout, typography, responsive
│   │   └── components.css  # Cards, playground, tables, etc.
│   ├── js/
│   │   ├── main.js         # Nav, filters, tabs, counters
│   │   ├── playground.js   # API playground with mock fallback
│   │   └── clippy.js       # Clippy dismiss/reappear logic
│   └── images/
│       ├── clippy.svg      # Animated Clippy
│       └── under-construction.svg
├── pages/                  # Generated (don't edit)
│   ├── index.html
│   ├── docs.html
│   ├── apis/*.html
│   └── categories/*.html
└── build.js                # Build script (node, no deps)
```
