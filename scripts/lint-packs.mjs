#!/usr/bin/env node
// Pack security linter. Enforces the "we run all the code, locally" guarantee.
// Scans apis/{slug}/src/*.ts for forbidden patterns. Run via:
//   node scripts/lint-packs.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APIS_DIR = path.join(__dirname, '..', 'apis');

const FORBIDDEN = [
  { pattern: /\bfetch\s*\(/, name: 'fetch()',         hint: 'Use callHaiku from @stupid-apis/shared. Direct network calls are not permitted.' },
  { pattern: /\bXMLHttpRequest\b/, name: 'XMLHttpRequest', hint: 'No network access in pack source.' },
  { pattern: /\bWebSocket\b/, name: 'WebSocket',           hint: 'No network access in pack source.' },
  { pattern: /\beval\s*\(/, name: 'eval()',                 hint: 'No dynamic code execution.' },
  { pattern: /\bnew\s+Function\s*\(/, name: 'new Function()', hint: 'No dynamic code execution.' },
  { pattern: /(^|[^.])\bFunction\s*\(/, name: 'Function() constructor', hint: 'No dynamic code execution.' },
  { pattern: /\bprocess\./, name: 'process.*',              hint: 'Workers do not have Node globals.' },
  { pattern: /\brequire\s*\(/, name: 'require()',           hint: 'Use ESM imports.' },
  { pattern: /\bglobalThis\.[A-Za-z_]/, name: 'globalThis.*', hint: 'Pack code must be self-contained.' },
];

const ALLOWED_IMPORT_SOURCES = new Set(['@stupid-apis/shared']);

// Maintainer-authored packs that legitimately hit external data sources (ISS,
// ephemeris, Reddit, etc.). Adding to this list is a deliberate maintainer
// decision during PR review — community submissions don't get to add themselves.
const ALLOWLISTED_PACKS = new Set([
  'chaos-index',
  'emoji-oracle',
  'iss-number',
  'mercury-number',
  'social-entropy',
]);

const failures = [];

function lintFile(slug, file, content) {
  // Strip line/block comments and string literals so we don't false-positive
  // on the words "fetch" inside a description, error message, etc.
  const stripped = content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/`(?:\\.|[^`\\])*`/g, '``');

  for (const { pattern, name, hint } of FORBIDDEN) {
    if (pattern.test(stripped)) {
      failures.push({ slug, file, error: `forbidden token: ${name}`, hint });
    }
  }

  // Check imports
  const importRegex = /\bimport\s+(?:type\s+)?(?:[\w*${}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRegex.exec(stripped)) !== null) {
    const src = m[1];
    if (!ALLOWED_IMPORT_SOURCES.has(src)) {
      failures.push({
        slug, file,
        error: `import from "${src}" not allowed`,
        hint: `Allowed imports: ${[...ALLOWED_IMPORT_SOURCES].join(', ')}`,
      });
    }
  }
}

if (!fs.existsSync(APIS_DIR)) {
  console.error('apis/ directory not found.');
  process.exit(1);
}

let scanned = 0;
for (const slug of fs.readdirSync(APIS_DIR)) {
  const srcDir = path.join(APIS_DIR, slug, 'src');
  if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) continue;
  if (ALLOWLISTED_PACKS.has(slug)) continue;
  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith('.ts')) continue;
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    lintFile(slug, file, content);
    scanned++;
  }
}

if (failures.length > 0) {
  console.error(`\nPack lint failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):\n`);
  for (const f of failures) {
    console.error(`  apis/${f.slug}/src/${f.file}`);
    console.error(`    ✗ ${f.error}`);
    console.error(`    → ${f.hint}\n`);
  }
  process.exit(1);
}

console.log(`Pack lint passed (${scanned} files scanned, no issues).`);
