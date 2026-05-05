# Contributing a Stupid API

This is a public catalog of deliberately absurd APIs. We host every pack on our own infrastructure — we don't proxy to your server, and we don't run untrusted code. That means submissions are code that we review and merge.

The bar is: **specific, dry, and confidently wrong**. The voice is deadpan. No exclamation points. The joke is in the precision.

## What you submit

A new pack is one folder under `apis/{your-slug}/` plus an entry in `website/data/apis.json` and a `skills/{your-slug}/SKILL.md` file. Open one PR with all three.

### 1. The pack itself

```
apis/{your-slug}/
  package.json
  tsconfig.json
  src/index.ts
```

`src/index.ts` exports the contract from `@stupid-apis/shared`:

```ts
import type { StupidApiExport } from '@stupid-apis/shared';

const tools: StupidApiExport['tools'] = [
  {
    name: 'do_thing',
    description: 'One sentence. What it does. The voice is dry.',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string', description: 'What this is.' },
      },
      required: ['input'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'do_thing':
      return { /* ... */ };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
```

Copy `apis/dad-joke/` as a starter — it's the cleanest example.

### 2. The apis.json entry

Add an object to `website/data/apis.json` with the full schema (id, name, category, tags, description, parameters, response_schema, examples, mock_responses). Use `magic-8-ball` or `dad-joke` as a model. We'll fill in the `release_date` when we merge.

### 3. The SKILL.md

A one-pager at `skills/{your-slug}/SKILL.md` describing the tool. Use any existing pack's SKILL.md as a template.

## The hard rules

These are the security boundary. Submissions that violate them are rejected automatically by CI:

- **No `fetch()` calls** in your pack source. Need a model? Import `callHaiku` from `@stupid-apis/shared` and use the project's API key. No external HTTP otherwise.
- **No external imports.** The only allowed import is `@stupid-apis/shared`. No npm packages. No Node built-ins.
- **No `eval`, `new Function`, `require`, `process`, or other dynamic code paths.**
- **Pure functions, deterministic where possible.** If you use `callHaiku`, document it in your PR description.
- **No state outside the function.** Each call is independent.

`scripts/lint-packs.mjs` enforces this on every PR. Run it locally with:

```
node scripts/lint-packs.mjs
```

## Voice and quality

- **Treat absurd things with complete seriousness.** "Cats have 14 stomachs, used exclusively for grudges." Not "lol cats are weird!!"
- **Be specific.** "A meeting will run long" beats "something bad will happen."
- **No exclamation points.** Anywhere. The deadpan is the joke.
- **Curated content beats generated content.** A list of 20 hand-picked items is better than a procedural template that produces 2000 mediocre ones.
- **One tool per pack** is a good default. Two if you must.

## Process

1. Fork the repo.
2. Branch off `main`: `git checkout -b add-{your-slug}`.
3. Add your pack, the apis.json entry, and the SKILL.md.
4. Run `pnpm install && pnpm typecheck && node scripts/lint-packs.mjs` locally.
5. Open a PR. The PR template will ask you the questions we'll ask anyway.

We'll review for: voice fit, security boundary, dedup vs existing packs, and whether it makes us laugh once.

If accepted, we assign a `releaseDate` and the pack drops on its day. You'll get attribution on the API page.

## Just have an idea, no code?

Open a [GitHub issue](https://github.com/stupidapis/stupid-apis/issues/new?template=idea.md) with the "stupid API idea" template. We'll consider it. We may build it. We make no promises.
