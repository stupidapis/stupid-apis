import type { StupidApiExport } from '@stupid-apis/shared';

const PATTERNS = [
  '{adj} {noun}',
  'The {noun} Hour',
  '{noun} & {noun2}',
  'Two {noun} Walk Into',
  'On {noun}',
  'A {adj} {noun}',
  '{noun}, Considered',
];

const ADJECTIVES = ['Quiet', 'Modest', 'Slow', 'Honest', 'Borrowed', 'Practical', 'Inevitable', 'Civic', 'Retail', 'Soft', 'Adjacent', 'Domestic'];
const NOUNS = ['Hour', 'Companion', 'Bench', 'Driveway', 'Ledger', 'Premise', 'Inheritance', 'Receipt', 'Errand', 'Footnote', 'Conversation', 'Mistake', 'Pavement', 'Garage'];

const TAGLINES = [
  'a weekly meditation on what cannot be hurried',
  'two friends talking about a thing that does not exist',
  'long-form, slightly damp, occasionally correct',
  'reading the world\'s receipts since 2019',
  'a podcast for people who prefer reading',
  'one specific question, considered too long',
  'serious conversations with people who made a small mistake once',
  'half journalism, half a long sigh',
];

const HOSTS = [
  'Anders Pell',
  'Marisol Crane',
  'Jermaine Voss',
  'Cordelia Warren',
  'Tomas & Frances',
  'a single host who insists on it',
  'three former editors',
];

const FREQUENCIES = ['weekly', 'biweekly', 'monthly when feasible', 'irregular by design', 'every other Wednesday'];

const LAST_EPISODE_TITLES = [
  'A Bus Driver Reads Aloud',
  'My Mother\'s Notes',
  'The Car That Started Itself',
  'On Walking Past a House You Used to Live In',
  'The Smallest Argument',
  'The Wrong Side of Town, Discussed',
  'Six Minutes With a Stranger',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildName(): string {
  const p = pickOne(PATTERNS);
  return p
    .replace('{adj}', pickOne(ADJECTIVES))
    .replace('{noun2}', pickOne(NOUNS))
    .replace('{noun}', pickOne(NOUNS));
}

interface Result {
  name: string;
  tagline: string;
  host: string;
  frequency: string;
  episode_count: number;
  last_episode_title: string;
  network: string;
  audience_size: string;
}

function generate(): Result {
  return {
    name: buildName(),
    tagline: pickOne(TAGLINES),
    host: pickOne(HOSTS),
    frequency: pickOne(FREQUENCIES),
    episode_count: 12 + Math.floor(Math.random() * 320),
    last_episode_title: pickOne(LAST_EPISODE_TITLES),
    network: pickOne(['independent', 'a small network', 'public radio affiliate', 'Substack-adjacent', 'a friend\'s living room']),
    audience_size: pickOne(['small but engaged', 'devoted', '12,000 listeners; 11,500 of them are the same person', 'modest', 'unmeasured']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a fake podcast: name, tagline, host, frequency, episode count, last episode title, network, audience size.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
