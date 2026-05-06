import type { StupidApiExport } from '@stupid-apis/shared';

const HEADERS = ['WARNING', 'CAUTION', 'NOTICE', 'PLEASE READ', 'IMPORTANT'];

const WARNINGS = [
  'Do not dream within 4 feet of this device.',
  'Risk of mild surprise.',
  'May cause feelings.',
  'Do not operate while sad.',
  'Not for indoor use, except in cases of indoor use.',
  'Do not aim at family members or expensive furniture.',
  'Reading these instructions may invalidate the warranty.',
  'Contents may have settled in transit. Settle the contents.',
  'Sharp edges where you would not expect them.',
  'May contain trace amounts of regret.',
  'For external use only, except where internal.',
  'Discontinue use if symptoms persist or improve.',
  'Do not look directly at this product for extended periods.',
  'Some assembly required. Some assembly possible. Some assembly inadvisable.',
];

const PRECAUTIONS = [
  'wear protective eyewear',
  'wash hands before use',
  'wash hands after use',
  'do not use within 30 minutes of meaningful conversation',
  'keep away from children, pets, and electricians',
  'use only as intended (intent unclear)',
  'consult a professional, but not the kind that would help',
];

const SYMBOLS = ['⚠', '☢', '☣', '✦', '✕', '⚡'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

interface Result {
  object: string;
  symbol: string;
  header: string;
  warning: string;
  precautions: string[];
  jurisdiction: string;
  certification: string;
}

const JURISDICTIONS = ['Permitted in 47 of 50 states', 'Banned in California', 'Approved by the local township only', 'Pending review in three jurisdictions', 'Sold where regulated'];

function label(object: string): Result {
  return {
    object,
    symbol: pickOne(SYMBOLS),
    header: pickOne(HEADERS),
    warning: pickOne(WARNINGS),
    precautions: pickN(PRECAUTIONS, 3),
    jurisdiction: pickOne(JURISDICTIONS),
    certification: pickOne(['Self-certified', 'Tested by no one', 'CE-marked (impressively)', 'OSHA-compliant in spirit', 'ISO-shaped']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'label',
    description:
      'Returns a warning label for any object. Includes header, symbol, warning, three precautions, jurisdiction note, and certification.',
    inputSchema: {
      type: 'object',
      properties: {
        object: { type: 'string', description: 'The object being labeled.' },
      },
      required: ['object'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'label': {
      const o = (args.object as string) || '';
      if (!o.trim()) throw new Error('Object required.');
      return label(o);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
