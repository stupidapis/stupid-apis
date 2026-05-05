import type { StupidApiExport } from '@stupid-apis/shared';

const PLACES = [
  'the Duchy of Pretzelsburg',
  'the Free City of Twomast',
  'the Loose Federation of Smallhold',
  'the Margravate of Verdant Halls',
  'the Bishopric of Lower Cellar',
  'the Republic of Quiet Provinces',
  'the Court of Greater Wending',
  'the Outer Banner of Tuln',
  'the Confederation of Unmarked Borders',
  'the Principality of the Half-Bridge',
];

const ACTIONS = [
  'declared war on bread',
  'lost a treaty in a card game',
  'misplaced its national anthem for six weeks',
  'banned the use of the letter Q for a single afternoon',
  'voted to relocate, then voted to stay, then voted to relocate again',
  'began trading exclusively in salt for one growing season',
  'crowned a new monarch by mistake',
  'commissioned a wall and then forgot which side it was for',
  'experienced a brief and minor schism over the proper name of a hill',
  'minted a coin worth three other coins',
  'celebrated its first ever holiday by accident',
];

const SIGNIFICANCES = [
  'the consequences are still being unraveled',
  'the matter was settled within twelve days',
  'no record survives that has been peer-reviewed',
  'the chronicler responsible was later disinvited from court',
  'the event is taught in two schools and denied in three',
  'historians consider it minor; locals do not',
];

const SOURCES = [
  'a fragment of parchment recovered from a ledger',
  'an oral history collected in 1894',
  'one diary entry, possibly fabricated',
  'a footnote in a textbook nobody owns',
  'a stained-glass window of unclear provenance',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  date: string;
  year: number;
  event: string;
  significance: string;
  source: string;
  verifiability: 'low' | 'very low' | 'absent';
}

function lookup(date: string): Result {
  // Hash the date to a deterministic year + indices
  let h = 0;
  for (let i = 0; i < date.length; i++) h = ((h << 5) - h) + date.charCodeAt(i);
  h = Math.abs(h);
  const year = 800 + (h % 1100);
  return {
    date,
    year,
    event: `${pickOne(PLACES)} ${pickOne(ACTIONS)}`,
    significance: pickOne(SIGNIFICANCES),
    source: pickOne(SOURCES),
    verifiability: pickOne(['low', 'very low', 'absent']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'lookup',
    description:
      'Returns a fake historical event for any date. Includes year, event, significance, source, and verifiability. None of it is real.',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Any date string (e.g. "May 5" or "2026-05-05")' },
      },
      required: ['date'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'lookup': {
      const d = (args.date as string) || '';
      if (!d.trim()) throw new Error('Date required.');
      return lookup(d);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
