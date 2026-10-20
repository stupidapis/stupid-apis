# Stupid APIs

Deliberately absurd APIs exposed as REST endpoints, MCP servers, and OpenClaw skills.

## Project Structure

```
stupid_apis/
├── shared/              # Shared types (StupidApiExport interface)
├── apis/                # Individual API packs
│   └── magic-8-ball/    # Classic Magic 8-Ball
├── workers/
│   └── gateway/         # CF Worker — serves REST + MCP
└── skills/              # OpenClaw SKILL.md files
    └── magic-8-ball/
```

## Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript (ES2022, bundler resolution)
- **Monorepo**: pnpm workspaces
- **Protocol**: MCP (JSON-RPC 2.0) + REST

## Adding a New Stupid API

1. Create `apis/{slug}/` with `package.json`, `tsconfig.json`, `src/index.ts`
2. Export `{ tools, callTool } satisfies StupidApiExport` from index
3. Add the pack to `workers/gateway/src/index.ts` API_PACKS array
4. Add `@stupid-apis/{slug}` dependency to gateway's package.json
5. Create `skills/{slug}/SKILL.md` for OpenClaw

## API Pack Contract

Every pack in `apis/` exports:
```typescript
export default { tools, callTool } satisfies StupidApiExport;
```
- `tools`: Array of MCP tool definitions (name, description, inputSchema)
- `callTool(name, args)`: Dispatcher that executes the named tool

Packs are pure logic — no auth, rate limiting, or HTTP concerns. The gateway handles all of that.

## Gateway Routes

| Route | Description |
|-------|-------------|
| `GET /` | API index |
| `GET /health` | Health check |
| `POST /mcp` | MCP endpoint (all tools) |
| `POST /{slug}/mcp` | MCP endpoint (single pack) |
| `GET\|POST /{slug}/{tool}` | REST endpoint |

## Dev

```bash
pnpm install
pnpm run dev        # wrangler dev on gateway
pnpm run typecheck  # check all packages
pnpm run deploy     # deploy gateway to CF
```

## Release notes

Shipped outcomes land on the dashboard's Release Notes tab
(`dashboard.pipeworx.io` -> Release Notes), not just in conversation. Post one
when something ships -- a new capability, a router-shaped fix, a bug fix,
anything else noteworthy -- with:

    scripts/release-note.sh <category> <title> <summary> [task_id] [commit_sha ...]

`category` is one of `new-mcp`, `router`, `bug`, `other`. Full contract
(summary standard, category meanings, source_ref convention): pipeworx repo,
`docs/release-notes.md`. The wrapper posts under the `stupidapis` service slug
over the shared fleet rail (`~/.claude/bin/pwcall.sh call fleet_release_note`),
the same mechanism every Mojibake repo uses.

**Known gap:** the `stupidapis` service slug is not yet in the pipeworx closed set (`shared/src/release-notes.ts`) — this wrapper is wired but every call it makes will be REFUSED by `fleet_release_note` until that slug is added. Flagged to the pipeworx PM/backend lane (fleet #3376); do not add it here.
