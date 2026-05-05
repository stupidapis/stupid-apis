import type { StupidApiExport } from '@stupid-apis/shared';

const STYLE_DESCRIPTORS = [
  'classic but dated',
  'tries hard',
  'aggressively unbothered',
  'auto-generated, briefly',
  'a real choice',
  'committed; perhaps too committed',
  'has not aged well',
  'curiously timeless',
  'a placeholder that became permanent',
];

const ERA_GUESSES = [
  '2003 LiveJournal',
  '2009 Xbox Live',
  '2012 Tumblr',
  '2017 Discord',
  '2019 Slack workspace, possibly',
  '2024, but feels older',
  'pre-2010, archival',
];

const REPLACEMENT_STRATEGIES = [
  'pick one of the strong words and abandon the rest',
  'first name plus a thing you have done',
  'a small noun and a smaller number',
  'a verb (any verb) and your last initial',
  'a single, normal word',
  'a place you have been to once',
];

function scoreUsername(u: string): number {
  let score = 60;
  // Penalties
  if (/\d{3,}/.test(u)) score -= 8;
  if (/[xX]{2,}/.test(u)) score -= 12;
  if (/420|69|666/.test(u)) score -= 10;
  if (u.length > 18) score -= 6;
  if (u.length < 4) score -= 5;
  if (/[_-]{2,}/.test(u)) score -= 4;
  if (/the(real|official)/i.test(u)) score -= 6;
  // Bonuses
  if (/^[a-z]+[A-Z]/.test(u)) score += 3;
  if (u.length >= 5 && u.length <= 12 && /^[a-z]+$/i.test(u)) score += 8;
  return Math.max(2, Math.min(10, Math.round(score / 10)));
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  username: string;
  rating: string;
  style: string;
  era_guess: string;
  suggested_replacement_strategy: string;
  example_replacement: string;
  vibe: string;
}

const VIBES = ['unfortunate', 'fine', 'durable', 'a personality', 'interview-safe', 'sport'];

function buildExample(u: string): string {
  const cleaned = u.replace(/\d+|[xX]+|_+|-+/g, '').toLowerCase().slice(0, 8) || 'fine';
  return `${cleaned}${Math.floor(Math.random() * 90) + 10}`;
}

function rate(username: string): Result {
  const s = scoreUsername(username);
  return {
    username,
    rating: `${s}/10`,
    style: pickOne(STYLE_DESCRIPTORS),
    era_guess: pickOne(ERA_GUESSES),
    suggested_replacement_strategy: pickOne(REPLACEMENT_STRATEGIES),
    example_replacement: buildExample(username),
    vibe: pickOne(VIBES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'rate',
    description:
      'Rates a username out of 10 with a style descriptor, era guess, replacement strategy, an example replacement, and a one-word vibe.',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'The username to rate.' },
      },
      required: ['username'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'rate': {
      const u = (args.username as string) || '';
      if (!u.trim()) throw new Error('Username required.');
      return rate(u);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
