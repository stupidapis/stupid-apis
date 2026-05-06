import type { StupidApiExport } from '@stupid-apis/shared';

const SERVING_DESCRIPTORS = [
  '1 evening',
  '1 group chat',
  '1 commute',
  '1 conversation',
  '1 phone call you have been avoiding',
  '1 quiet Sunday',
  '1 brief misunderstanding',
  '1 walk around the block',
];

const ABSTRACT_NUTRIENTS = [
  'Existential Dread',
  'Hope (declining)',
  'Conviction',
  'Quiet Resentment',
  'Unspoken Concerns',
  'Caffeine Equivalent',
  'Forgiveness (residual)',
  'Plans Made and Forgotten',
  'Patience',
  'Charisma',
  'Trust (issued)',
  'Trust (revoked)',
];

const FOOTERS = [
  '* Percent Daily Values are based on a 2,000-feeling diet',
  '* Values may vary based on the season and the company you keep',
  '* Not approved by anyone with credentials',
  '* The label is the meal',
  '* For sale where regulated, recommended where not',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

interface Result {
  item: string;
  serving_size: string;
  servings_per_container: string;
  calories: number;
  nutrients: { name: string; amount: string; daily_value: string }[];
  ingredients: string[];
  footer: string;
}

const FAKE_INGREDIENTS = [
  'mostly time',
  'one small regret',
  'water',
  'context',
  'unspoken assumptions',
  'anhydrous patience',
  'carriers',
  'naturally occurring optimism',
  'enriched circumstance',
  'a stabilizer',
];

function label(item: string): Result {
  const nutrients = pickN(ABSTRACT_NUTRIENTS, 6).map((n) => ({
    name: n,
    amount: `${Math.floor(Math.random() * 80) + 5} units`,
    daily_value: `${Math.floor(Math.random() * 200)}%`,
  }));
  return {
    item,
    serving_size: pickOne(SERVING_DESCRIPTORS),
    servings_per_container: `about ${Math.floor(Math.random() * 5) + 1}`,
    calories: 40 + Math.floor(Math.random() * 800),
    nutrients,
    ingredients: pickN(FAKE_INGREDIENTS, 5),
    footer: pickOne(FOOTERS),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'label',
    description:
      'Generates a Nutrition Facts label for any abstract or absurd item. Lists serving size, calories, abstract nutrients (Existential Dread, Hope), ingredients, and a footer.',
    inputSchema: {
      type: 'object',
      properties: {
        item: { type: 'string', description: 'The item to label.' },
      },
      required: ['item'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'label': {
      const i = (args.item as string) || '';
      if (!i.trim()) throw new Error('Item required.');
      return label(i);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
