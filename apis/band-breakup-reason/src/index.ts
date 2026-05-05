import type { StupidApiExport } from '@stupid-apis/shared';

const REASONS = [
  'Creative differences over the bassist\'s sourdough starter',
  'The drummer wanted to experiment with silence',
  'A van. There was a van. The van is the reason.',
  'Two members fell in love. Then they fell out. Then they all fell out.',
  'The keyboardist began reading philosophy on tour',
  'Someone called the EP "the album" in an interview',
  'A cease-and-desist over a name that turned out to be a real chain of dry cleaners',
  'The guitarist quit to open a small farm; the small farm closed in eight months',
  'Disagreements over whether to play the song that everyone wanted to hear',
  'Recording the second album took 19 months and produced four songs and a lawsuit',
  'The producer was, in retrospect, the problem',
  'A poorly-timed Twitter argument with a more famous band',
  'The label asked them to be "more accessible"; they tried; the label dropped them anyway',
  'A long argument about whether the snare should be live',
];

const FINAL_GIG = [
  'a half-empty club in Cleveland',
  'a wedding they were paid to play',
  'a friend\'s house, in the kitchen',
  'a benefit for a public access station',
  'a festival side stage; the headliner cancelled',
  'a Belgian record store; the door was locked from outside',
];

const REUNION_PROBABILITY = ['low', 'moderate', 'high (for money)', 'never (rumored)'];

const POSTSCRIPTS = [
  'the bassist now has a podcast',
  'the drummer joined a more famous band',
  'the singer released a solo record nobody understood',
  'the guitarist is teaching lessons in a strip mall',
  'the keyboardist is fine, mostly',
  'the manager is now the manager of someone else',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  band: string;
  reason: string;
  final_gig: string;
  reunion_probability: string;
  postscript: string;
  documentary_in_development: boolean;
}

function explain(band: string): Result {
  return {
    band,
    reason: pickOne(REASONS),
    final_gig: pickOne(FINAL_GIG),
    reunion_probability: pickOne(REUNION_PROBABILITY),
    postscript: pickOne(POSTSCRIPTS),
    documentary_in_development: Math.random() < 0.4,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'explain',
    description:
      'Explains why a band broke up. Returns the reason, location of the final gig, reunion probability, postscript, and documentary status.',
    inputSchema: {
      type: 'object',
      properties: {
        band: { type: 'string', description: 'The band name (real or fake).' },
      },
      required: ['band'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'explain': {
      const b = (args.band as string) || '';
      if (!b.trim()) throw new Error('Band name required.');
      return explain(b);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
