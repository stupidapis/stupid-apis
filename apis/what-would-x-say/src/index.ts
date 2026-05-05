import type { StupidApiExport } from '@stupid-apis/shared';

// Voice templates by archetype. We pick the closest archetype based on a
// crude string match against the supplied person, with a fallback.

interface Voice {
  archetype: string;
  patterns: ((topic: string) => string)[];
}

const VOICES: Voice[] = [
  {
    archetype: 'pirate',
    patterns: [
      (t) => `Arr, ${t}, ye say. I have seen ${t} in three ports and trusted none of them.`,
      (t) => `${t} is for landlubbers and the foolish. Mostly the foolish.`,
      (t) => `When I was sailin' the Outer Reach, ${t} was the least of our concerns.`,
    ],
  },
  {
    archetype: 'cowboy',
    patterns: [
      (t) => `Out where I come from, we don't say much about ${t}. We let ${t} speak for itself.`,
      (t) => `${t}? Sure. Everything's ${t} until the wind picks up.`,
      (t) => `Listen, friend. ${t} is a long road. Walk it slow.`,
    ],
  },
  {
    archetype: 'scientist',
    patterns: [
      (t) => `In a controlled environment, ${t} is reproducible. Outside one, it is interesting.`,
      (t) => `The data on ${t} is mixed. The investigators are tired.`,
      (t) => `${t}, properly understood, is two questions in a coat.`,
    ],
  },
  {
    archetype: 'philosopher',
    patterns: [
      (t) => `${t} is not a thing but a ratio.`,
      (t) => `To ask about ${t} is to ask about the question of ${t}, which is to ask nothing at all.`,
      (t) => `${t} is what remains after we forget the original question.`,
    ],
  },
  {
    archetype: 'corporate-executive',
    patterns: [
      (t) => `We have an opportunity around ${t}. The opportunity is named ${t}.`,
      (t) => `${t} is mission-critical to our Q3 narrative.`,
      (t) => `Let's circle back on ${t} after we level-set.`,
    ],
  },
  {
    archetype: 'grandmother',
    patterns: [
      (t) => `${t}? In my day, ${t} was free, and it killed people.`,
      (t) => `Eat something. Then we will talk about ${t}.`,
      (t) => `${t} is not for nice people.`,
    ],
  },
];

function detectArchetype(person: string): Voice {
  const p = person.toLowerCase();
  if (/pirate|sailor|buccaneer/.test(p)) return VOICES[0];
  if (/cowboy|cowgirl|rancher|wrangler/.test(p)) return VOICES[1];
  if (/scientist|researcher|professor|phd/.test(p)) return VOICES[2];
  if (/philosopher|stoic|sage/.test(p)) return VOICES[3];
  if (/ceo|cto|exec|founder|vp|manager|boss/.test(p)) return VOICES[4];
  if (/grandma|grandmother|nana|granny/.test(p)) return VOICES[5];
  // fallback: hash to a voice
  let h = 0;
  for (let i = 0; i < p.length; i++) h = ((h << 5) - h) + p.charCodeAt(i);
  return VOICES[Math.abs(h) % VOICES.length];
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  person: string;
  topic: string;
  quote: string;
  archetype_matched: string;
  fidelity: 'low' | 'moderate' | 'low (fallback)';
  delivery: string;
}

const DELIVERIES = ['confident', 'wistful', 'over the shoulder', 'into the middle distance', 'while making a sandwich'];

function imagine(person: string, topic: string): Result {
  const voice = detectArchetype(person);
  const pattern = pickOne(voice.patterns);
  const matched = /pirate|cowboy|scientist|philosopher|ceo|cto|exec|founder|grandma|sage|professor|stoic/i.test(person);
  return {
    person,
    topic,
    quote: pattern(topic),
    archetype_matched: voice.archetype,
    fidelity: matched ? (Math.random() < 0.5 ? 'low' : 'moderate') : 'low (fallback)',
    delivery: pickOne(DELIVERIES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'imagine',
    description:
      'Imagines what a person (real or archetypal) would say about a topic. Matches keywords like "pirate", "cowboy", "scientist", "philosopher", "ceo", or "grandmother"; otherwise falls back to a random archetype.',
    inputSchema: {
      type: 'object',
      properties: {
        person: { type: 'string', description: 'Who is speaking. E.g. "a pirate", "my philosophy professor".' },
        topic: { type: 'string', description: 'What they are speaking about.' },
      },
      required: ['person', 'topic'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'imagine': {
      const p = (args.person as string) || '';
      const t = (args.topic as string) || '';
      if (!p.trim() || !t.trim()) throw new Error('Both person and topic are required.');
      return imagine(p, t);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
