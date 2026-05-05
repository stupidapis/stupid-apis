import type { StupidApiExport } from '@stupid-apis/shared';

const PREFIX = ['Royal', 'Lord High', 'Master', 'Apprentice', 'Wandering', 'Court', 'High', 'Junior', 'Senior', 'Principal', 'Page', 'Sworn'];
const ROLE = ['Illuminator', 'Scribe', 'Smith', 'Alchemist', 'Astrologer', 'Herald', 'Steward', 'Harvester', 'Reckoner', 'Surveyor', 'Treasurer', 'Gatekeeper', 'Crier', 'Keeper'];
const DOMAIN = [
  'of Glass Tablets', 'of Ledgers', 'of the Cellar', 'of the Foundry',
  'of the Outer Banner', 'of the Inner Banner', 'of the Stables',
  'of the Lower Court', 'of the Eastern Wing', 'of Pigeons',
  'of the Long Hall', 'of the Counting House', 'of the Weights',
];

const RESPONSIBILITIES = [
  'maintain the parchment ledgers',
  'attend the morning briefing of the Council',
  'keep the bell rung at the appointed hour',
  'inspect the seals before they are broken',
  'note absences and report them to the Reeve',
  'rotate the watch of the gates',
  'ensure the candles do not gutter',
  'bring the news to the kitchen by sundown',
  'verify the count of barrels',
  'transcribe the dispatches of the High Court',
];

const SIGNATURE_OPTIONS = [
  'In service to the Crown,',
  'Yours in fealty,',
  'By the seal of the High Court,',
  'Faithfully,',
  'In the service of the Long Hall,',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  modern_title: string;
  medieval_title: string;
  court_role: string;
  responsibilities: string[];
  email_signature: string;
  approximate_year: number;
}

function convert(modernTitle: string): Result {
  const title = `${pickOne(PREFIX)} ${pickOne(ROLE)} ${pickOne(DOMAIN)}`;
  const r1 = pickOne(RESPONSIBILITIES);
  let r2 = pickOne(RESPONSIBILITIES);
  while (r2 === r1) r2 = pickOne(RESPONSIBILITIES);
  let r3 = pickOne(RESPONSIBILITIES);
  while (r3 === r1 || r3 === r2) r3 = pickOne(RESPONSIBILITIES);
  return {
    modern_title: modernTitle,
    medieval_title: title,
    court_role: pickOne(['minor', 'middle', 'high']),
    responsibilities: [r1, r2, r3],
    email_signature: `${pickOne(SIGNATURE_OPTIONS)}\n${title}`,
    approximate_year: 1100 + Math.floor(Math.random() * 400),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'convert',
    description:
      'Convert a modern job title to its medieval equivalent. Returns the title, court role, responsibilities, email signature, and approximate year.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Modern job title, e.g. "Senior Frontend Engineer"' },
      },
      required: ['title'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'convert': {
      const title = (args.title as string) || '';
      if (!title.trim()) throw new Error('Modern title required.');
      return convert(title);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
