import type { StupidApiExport } from '@stupid-apis/shared';

const FIXES = [
  'Fixed a bug nobody reported but everyone suffered from',
  'Fixed the dropdown. The dropdown was the issue.',
  'Repaired a regression introduced in the patch that fixed the previous regression',
  'The button now works on Tuesdays',
  'Resolved an issue caused by another issue',
  'Restored functionality that was previously labeled as a feature',
  'Fixed an off-by-one error. We do not know which one.',
  'Re-enabled a feature that was disabled in 2022',
];

const FEATURES = [
  'New onboarding flow that nobody asked for',
  'Added a settings panel; the settings do not yet do anything',
  'Introduced a feature flag to disable the feature you wanted',
  'Added telemetry. Trust us.',
  'Added a search bar. The search returns no results.',
  'Added emoji support to a place where emoji should not be',
  'New keyboard shortcut. It is the same as an existing keyboard shortcut.',
];

const CHANGES = [
  'Updated dependencies. We do not know why.',
  'Refactored a function that was working',
  'Improved performance for users we do not have',
  'Renamed a variable; the new name is also bad',
  'Removed a feature that two users were using',
  'Migrated from one bad library to a slightly newer bad library',
  'Reduced bundle size by 0.4%',
];

const REMOVALS = [
  'Removed the dark mode toggle. Dark mode is now the default. Light mode is no longer supported.',
  'Removed the help text. The help was not helping.',
  'Deprecated an API endpoint. We will sunset it in 90 days. The countdown started two years ago.',
  'Removed support for Internet Explorer 11. Yes, finally.',
  'Removed a button.',
  'Sunset the legacy admin panel; the new one will arrive shortly',
];

const KNOWN_ISSUES = [
  'The previous bug is still present, but in a new place',
  'Dark mode is currently darker than dark',
  'CSV exports may include a small additional column',
  'Push notifications occasionally arrive in the past',
  'No known issues. We have not looked.',
  'A specific user reports the timezone is wrong; we cannot reproduce',
];

function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

interface Result {
  version: string;
  released: string;
  fixed: string[];
  added: string[];
  changed: string[];
  removed: string[];
  known_issues: string[];
  signed_by: string;
}

function generate(version: string): Result {
  const today = new Date().toISOString().slice(0, 10);
  return {
    version,
    released: today,
    fixed: pickN(FIXES, 2),
    added: pickN(FEATURES, 2),
    changed: pickN(CHANGES, 2),
    removed: pickN(REMOVALS, 1),
    known_issues: pickN(KNOWN_ISSUES, 2),
    signed_by: 'the team',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a passive-aggressive software changelog for a given version. Returns fixed/added/changed/removed/known_issues sections.',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string', description: 'Version string, e.g. "2.4.1"' },
      },
      required: ['version'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const v = (args.version as string) || '';
      if (!v.trim()) throw new Error('Version required.');
      return generate(v);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
