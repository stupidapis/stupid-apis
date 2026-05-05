import type { StupidApiExport } from '@stupid-apis/shared';

const VERBS = [
  'leverage', 'synergize', 'ideate', 'operationalize', 'scale', 'unpack',
  'action', 'level-set', 'unblock', 'right-size', 'recalibrate', 'optimize',
  'circle back on', 'parking-lot', 'workshop',
];

const ADJECTIVES = [
  'cross-functional', 'holistic', 'strategic', 'agile', 'scalable',
  'north-star', 'mission-critical', 'value-add', 'best-in-class', 'turn-key',
  'frictionless', 'customer-obsessed', 'data-driven',
];

const NOUNS = [
  'alignment', 'bandwidth', 'takeaways', 'deliverables', 'runway', 'learnings',
  'optics', 'roadmap', 'thought leadership', 'execution', 'narrative', 'paradigm',
  'verticals', 'synergies', 'KPIs',
];

const CONNECTORS = ['around', 'against', 'into', 'across', 'on'];

type Format = 'phrase' | 'sentence' | 'paragraph' | 'vision';

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function phrase(): string {
  return `${pickOne(VERBS)} our ${pickOne(ADJECTIVES)} ${pickOne(NOUNS)}`;
}

function sentence(): string {
  return `We need to ${phrase()} in order to drive ${pickOne(NOUNS)} ${pickOne(CONNECTORS)} ${pickOne(NOUNS)}.`;
}

function paragraph(): string {
  return [sentence(), sentence(), sentence()].join(' ');
}

function vision(): string {
  return `To be the most ${pickOne(ADJECTIVES)} ${pickOne(NOUNS)} in our space — empowering teams to ${pickOne(VERBS)} ${pickOne(ADJECTIVES)} ${pickOne(NOUNS)} at unprecedented scale.`;
}

interface Result {
  output: string;
  format: Format;
  jargon_density: string;
  meaning: string;
  suggested_use: string;
}

const VALID: Format[] = ['phrase', 'sentence', 'paragraph', 'vision'];

function generate(format: Format): Result {
  const out = format === 'phrase' ? phrase()
    : format === 'sentence' ? sentence()
    : format === 'paragraph' ? paragraph()
    : vision();
  return {
    output: out,
    format,
    jargon_density: `${Math.min(99, 60 + Math.floor(Math.random() * 40))}%`,
    meaning: 'unclear by design',
    suggested_use: 'a slide deck',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates corporate buzzword text. Format options: phrase (verb + adj + noun), sentence, paragraph, or vision (statement). Default: sentence.',
    inputSchema: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: VALID, description: 'Output length and structure.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const f = ((args.format as string) || 'sentence') as Format;
      if (!(VALID as string[]).includes(f)) throw new Error(`Unknown format. Use: ${VALID.join(', ')}`);
      return generate(f);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
