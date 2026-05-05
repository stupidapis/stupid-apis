import type { StupidApiExport } from '@stupid-apis/shared';

const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
] as const;

type Alignment = typeof ALIGNMENTS[number];

const REASONINGS: Record<Alignment, string[]> = {
  'Lawful Good': ['follows the rules and means it', 'helps without being asked', 'returns the cart'],
  'Neutral Good': ['well-intentioned, casually pragmatic', 'will help if it is convenient and even if not'],
  'Chaotic Good': ['breaks the rule to help', 'noisy on principle', 'organizes things you did not ask for'],
  'Lawful Neutral': ['the rule is the rule', 'will report you', 'has a label maker'],
  'True Neutral': ['equally indifferent in all directions', 'will not pick a side', 'neither rises nor falls'],
  'Chaotic Neutral': ['unpredictable, uninterested', 'will start a thing and not finish it', 'has opinions about Tuesdays'],
  'Lawful Evil': ['follows the rules to harm', 'cites policy when it suits', 'has a five-year plan'],
  'Neutral Evil': ['self-interested, casually so', 'will throw you under the bus, but politely'],
  'Chaotic Evil': ['ungovernable, uninterested in cover', 'enjoys breaking things', 'is the reason for the lock'],
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

interface Result {
  thing: string;
  alignment: Alignment;
  axis: { law_chaos: 'lawful' | 'neutral' | 'chaotic'; good_evil: 'good' | 'neutral' | 'evil' };
  reasoning: string;
  certainty: string;
  alternative_reading: Alignment;
}

function place(thing: string): Result {
  const h = hashString(thing);
  const alignment = ALIGNMENTS[h % 9];
  const alt = ALIGNMENTS[(h + 4) % 9];
  const parts = alignment.split(' ');
  const law_chaos = parts[0].toLowerCase() === 'true' ? 'neutral' : parts[0].toLowerCase() as 'lawful' | 'neutral' | 'chaotic';
  const good_evil = parts[1].toLowerCase() as 'good' | 'neutral' | 'evil';
  return {
    thing,
    alignment,
    axis: { law_chaos, good_evil },
    reasoning: REASONINGS[alignment][h % REASONINGS[alignment].length],
    certainty: 'final',
    alternative_reading: alt,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'place',
    description:
      'Places any thing on a 9-cell D&D alignment chart. Returns the alignment, axis breakdown, reasoning, and an alternative reading.',
    inputSchema: {
      type: 'object',
      properties: {
        thing: { type: 'string', description: 'The thing to align (e.g. "pineapple on pizza", "loud chewing", "your manager")' },
      },
      required: ['thing'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'place': {
      const t = (args.thing as string) || '';
      if (!t.trim()) throw new Error('Thing required.');
      return place(t);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
