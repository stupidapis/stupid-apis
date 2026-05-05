import type { StupidApiExport } from '@stupid-apis/shared';

const HEADLINES = [
  'Local Man Discovers Tuesday, Refuses to Comment',
  'Area Woman Finally Reads the Full Email',
  'Studies Show Studies are Mostly Studies',
  'New Bill Would Require All Email to Be Returned',
  'Couple Spends Anniversary Comparing Subscriptions',
  'Scientists Confirm What You Already Suspected About Salt',
  'Local Bakery Pivots, Then Pivots Back, Then Closes',
  'Officials Warn About New Thing You Have Never Heard Of',
  'Resident Wins Argument; Spouse Disputes Result',
  'Dentist Has Concerns He Will Not Articulate',
  'New Study Suggests You Are Tired',
  'Town Adopts Resolution; Resolution Adopts Cat',
  'Man Buys Plant. Plant Disappointed.',
  'Mayor Issues Statement About Statement',
  'Birds Continue, Sources Confirm',
  'Couple Eats Dinner Without Discussing The Thing',
  'Remote Worker Slowly Becoming One With Chair',
  'Local Pizza Place Now Doing "Heat Things Up Slightly Less"',
  'Group Chat Reaches Day 47 of Planning Drinks',
  'Parents Finally Use the Good Towels',
];

const BEATS = ['local', 'national', 'business', 'science', 'lifestyle', 'opinion'] as const;

const SUBHEADS = [
  'Witnesses describe events as "happening, mostly"',
  'Officials encourage residents to "remain in their homes, perhaps"',
  'Experts say more research is needed; experts always say this',
  'Statement to follow when convenient',
  'A correction may be issued',
  'Investigation pending; nobody is investigating',
];

const BYLINES = [
  'a stringer who would prefer not to be named',
  'staff',
  'wire',
  'a contributor',
  'an intern who has since moved on',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  headline: string;
  subhead: string;
  byline: string;
  beat: typeof BEATS[number];
  word_count_estimate: number;
  significance: 'low' | 'very low' | 'genuine';
}

function generate(): Result {
  return {
    headline: pickOne(HEADLINES),
    subhead: pickOne(SUBHEADS),
    byline: pickOne(BYLINES),
    beat: pickOne(BEATS),
    word_count_estimate: 200 + Math.floor(Math.random() * 800),
    significance: pickOne(['low', 'very low', 'genuine']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Returns a tabloid-style headline with subhead, byline, beat, word count estimate, and significance rating.',
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
