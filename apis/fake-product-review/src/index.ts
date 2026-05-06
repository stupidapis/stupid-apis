import type { StupidApiExport } from '@stupid-apis/shared';

const ONE_STAR = [
  'Crashed once in 2019. My grandmother died the next year. Coincidence?',
  'Arrived in three pieces, none of them the right ones.',
  'The instructions are in a language. I am not sure which one.',
  'It works. That is the most upsetting part.',
  'I bought this and now my dog has stopped looking at me.',
];

const THREE_STAR = [
  'It is a thing. It does what it says, eventually.',
  'I have owned worse. I have also owned better. This sits in the middle, watching.',
  'Adequate. The packaging was disproportionate.',
  'Functions. The user manual functions less.',
  'Fine. Not transformative. Did not ruin my month.',
];

const FIVE_STAR = [
  'I am writing this from the grocery store. I cannot put it down.',
  'My therapist asked what changed. I showed her this.',
  'I would die for this product. I know how that sounds.',
  'My mother does not call. This product does, in its own way.',
  'I have ordered three more. One for emergencies. Two for friends I have not made yet.',
];

const HEADLINES_BY_STARS: Record<number, string[]> = {
  1: ['Disappointing', 'Save your money', 'Returned, eventually', 'Not what was advertised', 'A long sigh'],
  2: ['Could be better', 'I expected more', 'Mostly fine', 'Not for me', 'Returned'],
  3: ['It is fine', 'Acceptable', 'Functions', 'Adequate', 'Will do'],
  4: ['Pretty good', 'Mostly very good', 'I would buy again', 'Solid', 'Pleased'],
  5: ['Life-changing', 'Buy two', 'I am a different person', 'A small miracle', 'Tell your mother'],
};

const REVIEWERS = [
  'Sarah K.',
  'A Verified Customer',
  'Tom from Indiana',
  'M. from California',
  'Concerned Citizen',
  'Bridget L.',
  'A Skeptic',
  'Andre M.',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function bodyForStars(stars: number): string {
  if (stars <= 1) return pickOne(ONE_STAR);
  if (stars >= 5) return pickOne(FIVE_STAR);
  if (stars === 2) return pickOne(THREE_STAR).replace(/middle/, 'lower middle');
  if (stars === 4) return pickOne(THREE_STAR).replace(/middle/, 'upper middle');
  return pickOne(THREE_STAR);
}

interface Result {
  product: string;
  stars: number;
  headline: string;
  body: string;
  reviewer: string;
  verified_purchase: boolean;
  helpful_votes: number;
  posted: string;
}

function review(product: string, stars: number): Result {
  return {
    product,
    stars,
    headline: pickOne(HEADLINES_BY_STARS[stars]),
    body: bodyForStars(stars),
    reviewer: pickOne(REVIEWERS),
    verified_purchase: Math.random() < 0.85,
    helpful_votes: Math.floor(Math.random() * 220),
    posted: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 365)).toISOString().slice(0, 10),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'review',
    description:
      'Generates a fake product review for any product name. Star count (1-5) weights the tone of the body and headline.',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'string', description: 'Product name.' },
        stars: { type: 'number', description: 'Star rating 1-5. Default: 3.' },
      },
      required: ['product'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'review': {
      const p = (args.product as string) || '';
      if (!p.trim()) throw new Error('Product required.');
      const stars = Math.min(5, Math.max(1, Math.round(Number(args.stars) || 3)));
      return review(p, stars);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
