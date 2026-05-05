import type { StupidApiExport } from '@stupid-apis/shared';

const PROVENANCE = [
  'Believed to have witnessed three breakups',
  'Recovered from an estate sale; signed but illegibly',
  'Donated by an anonymous benefactor in 1987 with no accompanying note',
  'On loan from a private collection that requests anonymity',
  'Long thought lost; found behind a couch',
  'Acquired in 2014 in lieu of payment',
  'Carried by hand across a state line; details disputed',
  'Purchased from a yard sale for $4',
];

const SIGNIFICANCES = [
  'A representative example of its period and class',
  'Notable for its complete unwillingness to be remarkable',
  'Demonstrates a workmanship typical of the late afternoon',
  'Among the only surviving examples of its kind, locally',
  'A common object made unfamiliar by attention',
  'Considered minor by experts and major by visitors',
  'A study in restraint, or possibly fatigue',
];

const MATERIALS = [
  'wood, paint, and intent',
  'mixed media; mostly mixed',
  'glass, plastic, and a small amount of regret',
  'paper, glue, and conditional optimism',
  'metal, wax, and what is left of an opinion',
  'ceramic and dust, in equal parts',
  'cloth, thread, and proximity',
];

const PERIODS = [
  'mid-2000s',
  'late afternoon, c. 1987',
  'pre-pandemic',
  'second wave (regional)',
  'a Tuesday',
  'unknown but recent',
  'c. 2003',
];

const VIEWING_NOTES = [
  'view from the left side, slightly squinting',
  'best appreciated in indirect light',
  'pause for thirty seconds before moving on',
  'do not touch; the docent will know',
  'continue to the next gallery; this work does not require attention',
  'consider its absence',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  object: string;
  title: string;
  period: string;
  materials: string;
  provenance: string;
  significance: string;
  viewing_note: string;
  catalog_number: string;
}

function describe(object: string): Result {
  // Capitalize first letter for the title
  const title = object.charAt(0).toUpperCase() + object.slice(1);
  const period = pickOne(PERIODS);
  const cat = `${(['M', 'A', 'V', 'P'][Math.floor(Math.random() * 4)])}.${1900 + Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
  return {
    object,
    title: `${title}, ${period}`,
    period,
    materials: pickOne(MATERIALS),
    provenance: pickOne(PROVENANCE),
    significance: pickOne(SIGNIFICANCES),
    viewing_note: pickOne(VIEWING_NOTES),
    catalog_number: cat,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'describe',
    description:
      'Writes a museum plaque for any object. Returns title, period, materials, provenance, significance, viewing note, and a catalog number.',
    inputSchema: {
      type: 'object',
      properties: {
        object: { type: 'string', description: 'The object (e.g. "chair", "stapler", "USB cable")' },
      },
      required: ['object'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'describe': {
      const o = (args.object as string) || '';
      if (!o.trim()) throw new Error('Object required.');
      return describe(o);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
