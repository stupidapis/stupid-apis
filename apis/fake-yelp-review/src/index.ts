import type { StupidApiExport } from '@stupid-apis/shared';

const ONE_STAR = [
  'I am writing this from my car. The car is fine.',
  'Service was attentive in a way I did not ask for.',
  'The hostess remembered my name. We have not met.',
  'They were out of the thing. They are always out of the thing.',
  'My water glass was 60% ice. Address this.',
  'I asked for the check 11 minutes ago. The check has its own ideas.',
];

const THREE_STAR = [
  'It was fine. The bread came out too soon, but that is on me.',
  'A reasonable choice for what it is. I would go back, with reservations.',
  'The lighting is unflattering, but the food is also unflattering.',
  'The waiter forgot the napkins. We managed.',
  'I have eaten here twice. The first time was better. The second time was longer.',
];

const FIVE_STAR = [
  'My grandmother would approve. My grandmother is hard to please.',
  'I came for one thing and left committed. The host saw me leaving and waved.',
  'The mushrooms were the centerpiece, and that is the right call.',
  'I have not stopped thinking about it. I have not been here in two weeks.',
  'They remembered my dog\'s name. The dog was not present.',
];

const TITLES_BY_STARS: Record<number, string[]> = {
  1: ['Disappointing', 'Will not return', 'A waste', 'Not a fan'],
  2: ['Could be better', 'Mostly fine, mostly', 'Underwhelmed', 'Eh'],
  3: ['Acceptable', 'Workable', 'Honestly fine', 'Mid-tier'],
  4: ['Good', 'Solid', 'I would go back', 'Pleased'],
  5: ['Excellent', 'A favorite', 'My new place', 'Will be back'],
};

const REVIEWERS = ['Patricia M.', 'Greg T.', 'A Local Foodie', 'A Reluctant Reviewer', 'Karen', 'A Visitor', 'Anonymous (verified)'];
const SPECIFICS = [
  'Came on a Tuesday at 7pm.',
  'Sat by the window. The window was an opinion.',
  'Came for the brunch, stayed because we had to.',
  'Came with my mother-in-law.',
  'Two-top. Got the corner table; lighting was kind.',
  'Walk-in. Waited 18 minutes. Worth it (?).',
  'Brought my own bread, which they allowed.',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function bodyForStars(stars: number): string {
  if (stars <= 1) return pickOne(ONE_STAR);
  if (stars >= 5) return pickOne(FIVE_STAR);
  if (stars === 2) return pickOne(THREE_STAR).replace(/\.$/, ', and not in a good way.');
  if (stars === 4) return pickOne(THREE_STAR).replace(/\.$/, ', and somehow it worked.');
  return pickOne(THREE_STAR);
}

interface Result {
  business: string;
  stars: number;
  title: string;
  body: string;
  reviewer: string;
  visited_on: string;
  helpful_votes: number;
  cool_votes: number;
  funny_votes: number;
  photos_attached: number;
}

function review(business: string, stars: number): Result {
  const specific = pickOne(SPECIFICS);
  return {
    business,
    stars,
    title: pickOne(TITLES_BY_STARS[stars]),
    body: `${specific} ${bodyForStars(stars)}`,
    reviewer: pickOne(REVIEWERS),
    visited_on: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 60)).toISOString().slice(0, 10),
    helpful_votes: Math.floor(Math.random() * 80),
    cool_votes: Math.floor(Math.random() * 20),
    funny_votes: Math.floor(Math.random() * 14),
    photos_attached: Math.floor(Math.random() * 6),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'review',
    description:
      'Generates a Yelp-style review for any business with a specific opening detail. Star count weights tone. Returns title, body, reviewer, votes, and photo count.',
    inputSchema: {
      type: 'object',
      properties: {
        business: { type: 'string', description: 'Business name.' },
        stars: { type: 'number', description: '1-5 (default 3).' },
      },
      required: ['business'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'review': {
      const b = (args.business as string) || '';
      if (!b.trim()) throw new Error('Business required.');
      const stars = Math.min(5, Math.max(1, Math.round(Number(args.stars) || 3)));
      return review(b, stars);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
