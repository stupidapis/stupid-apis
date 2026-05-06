import type { StupidApiExport } from '@stupid-apis/shared';

// Composes a 5-7-5 haiku about a topic by stitching together three lines
// from curated banks. The opening 5-syllable line is fixed; the 7 in the
// middle includes the topic; the closing 5 is a turn.

const OPENERS_5 = [
  'A quiet morning',
  'The kettle is hot',
  'Snow on the rooftop',
  'Light through the window',
  'A door left ajar',
  'The phone is silent',
  'A long Sunday rests',
  'Bread on the counter',
  'Wind moves the curtain',
  'Tea steeps in patience',
];

const CLOSERS_5 = [
  'nothing has been lost',
  'the cat does not move',
  'the world is workable',
  'no one will explain',
  'the day will arrive',
  'the bell does not ring',
  'a small mercy holds',
  'the kettle will sing',
  'the day starts again',
  'the table is set',
];

// Middle line patterns. Stitching the topic in produces ~7 syllables for
// short topics; for long topics, line shape is approximate. The pack admits
// this in the meter_warning field.
const MIDDLES = [
  'I think of {topic} now,',
  '{topic} sits, present, near,',
  'Beside the {topic} again,',
  'Under {topic}\'s gaze,',
  'I have known {topic} long,',
  '{topic} does not require,',
  'The {topic} watches us,',
  'Through the {topic}, it goes,',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Approximate vowel-group syllable count.
function approximateSyllables(line: string): number {
  const cleaned = line.toLowerCase().replace(/[^a-z\s]/g, ' ');
  const words = cleaned.split(/\s+/).filter(Boolean);
  let total = 0;
  for (const w of words) {
    const groups = w.match(/[aeiouy]+/g) || [];
    let n = groups.length;
    if (w.endsWith('e') && n > 1) n -= 1;
    total += Math.max(1, n);
  }
  return total;
}

interface Result {
  topic: string;
  haiku: string[];
  syllable_estimate: number[];
  meter_warning: string | null;
  attribution: string;
}

function compose(topic: string): Result {
  const top = topic.trim().toLowerCase();
  const lines = [pickOne(OPENERS_5), pickOne(MIDDLES).replace('{topic}', top), pickOne(CLOSERS_5)];
  const counts = lines.map(approximateSyllables);
  const target = [5, 7, 5];
  const off = counts.some((c, i) => Math.abs(c - target[i]) > 1);
  return {
    topic,
    haiku: lines,
    syllable_estimate: counts,
    meter_warning: off ? 'meter approximate; topic may be long for the form' : null,
    attribution: 'composed by the Fake Haiku Machine',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'compose',
    description:
      'Composes a 5-7-5 haiku on any topic. Returns the three lines, an estimated syllable count per line, and a meter warning if the topic is long.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'The topic of the haiku.' },
      },
      required: ['topic'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'compose': {
      const t = (args.topic as string) || '';
      if (!t.trim()) throw new Error('Topic required.');
      return compose(t);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
