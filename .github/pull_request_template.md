<!-- Submitting a new pack? Fill this out. Submitting something else? Delete this. -->

## What does it do?

<!-- One sentence. Specific. Dry. -->

## Why is it stupid?

<!-- The joke. -->

## Slug, name, category

- Slug: `your-slug`
- Name: Your Name
- Category: `oracles` / `generators` / `decision-making` / `randomness` / `text-analysis`

## Submission checklist

- [ ] `apis/{slug}/` contains `package.json`, `tsconfig.json`, and `src/index.ts`
- [ ] `skills/{slug}/SKILL.md` added
- [ ] Entry added to `website/data/apis.json` (full schema, see existing entries)
- [ ] No `fetch()`, no external imports, no `eval`/`Function`/`require`/`process` in pack source
- [ ] Only import is `@stupid-apis/shared`
- [ ] If using `callHaiku`, the LLM use is justified (deterministic packs preferred)
- [ ] `pnpm typecheck` passes
- [ ] `node scripts/lint-packs.mjs` passes
- [ ] No exclamation points in any output strings

## Anything else?

<!-- Inspiration, prior art, dedup notes. -->
