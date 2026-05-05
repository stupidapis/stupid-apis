# Stupid APIs

A public catalog of deliberately absurd APIs. Every endpoint is real. Every response is questionable. One new API drops every day.

- **Live site:** https://stupidapis.com
- **Gateway:** https://api.stupidapis.com
- **API of the day:** https://api.stupidapis.com/today

## What this is

Each API is a small TypeScript pack that does something specific, dry, and confidently wrong. Examples:

- `magic-8-ball` — outsource your decisions
- `weather-but-lying` — confidently incorrect weather forecasts
- `emotional-support-rock` — tell a rock your problem; the rock listens
- `dad-joke` — one joke, with groan factor

Every pack is exposed three ways: REST, MCP (for AI assistants), and as an [OpenClaw](https://pipeworx.io) skill.

## Architecture

- **`apis/{slug}/`** — individual packs (pure logic, no HTTP concerns)
- **`workers/gateway/`** — Cloudflare Worker serving REST + MCP, handling rate limits, release-date gating, and email notifications
- **`shared/`** — types and the `callHaiku` helper for LLM-backed packs
- **`skills/{slug}/SKILL.md`** — OpenClaw skill descriptors
- **`website/`** — static site (`stupidapis.com`)

## Local dev

```bash
pnpm install
pnpm typecheck
pnpm run dev      # wrangler dev on the gateway
node website/build.js && python3 -m http.server -d website/pages 8080
```

## Contributing

Submissions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the pack contract and security rules.

The short version: write a pack under `apis/{your-slug}/`, add an entry to `website/data/apis.json`, open a PR. CI will check the security boundary automatically (no `fetch`, no external imports, no `eval`).

## License

MIT — see [LICENSE](LICENSE).
