import type { StupidApiExport } from '@stupid-apis/shared';

const COMMENTARY = [
  'an upset by any reasonable measure',
  'the favored seed by a slim margin',
  'a controversial outcome at best',
  'the people\'s choice held',
  'narrowly, the more committed entry advanced',
  'won on aesthetics alone',
  'a draw on merit; we picked one',
  'the underdog took it home',
];

const VERDICTS = [
  'cannot be argued with',
  'will be argued with',
  'has implications nobody is ready to address',
  'is correct, full stop',
  'is wrong but final',
  'will not be revisited',
];

interface Match {
  a: string;
  b: string;
  winner: string;
  reason: string;
}

interface Result {
  things: string[];
  round_of_8: Match[];
  semifinals: Match[];
  final: Match;
  champion: string;
  champion_remarks: string;
  bracket_verdict: string;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function play(a: string, b: string): Match {
  // Hash both strings; the higher-hash entry wins, deterministically.
  const winner = hashString(a) > hashString(b) ? a : b;
  return { a, b, winner, reason: COMMENTARY[(hashString(a + b) >> 1) % COMMENTARY.length] };
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function bracket(things: string[]): Result {
  if (things.length !== 8) throw new Error('Provide exactly 8 things.');

  const r1: Match[] = [
    play(things[0], things[1]),
    play(things[2], things[3]),
    play(things[4], things[5]),
    play(things[6], things[7]),
  ];
  const semis: Match[] = [
    play(r1[0].winner, r1[1].winner),
    play(r1[2].winner, r1[3].winner),
  ];
  const final: Match = play(semis[0].winner, semis[1].winner);

  return {
    things,
    round_of_8: r1,
    semifinals: semis,
    final,
    champion: final.winner,
    champion_remarks: `${final.winner} ${pickOne(['was the right call', 'is the lesson', 'has earned the title', 'will not let us forget'])}`,
    bracket_verdict: `the bracket ${pickOne(VERDICTS)}`,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'bracket',
    description:
      'Runs a single-elimination bracket between exactly 8 things. Deterministic by input. Returns each round, the champion, and a verdict on the bracket itself.',
    inputSchema: {
      type: 'object',
      properties: {
        things: { type: 'array', items: { type: 'string' }, minItems: 8, maxItems: 8, description: 'Exactly 8 things.' },
      },
      required: ['things'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'bracket': {
      const t = args.things;
      if (!Array.isArray(t) || t.length !== 8 || !t.every((x) => typeof x === 'string' && x.trim())) {
        throw new Error('Provide exactly 8 non-empty strings in `things`.');
      }
      return bracket(t as string[]);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
