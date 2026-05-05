import type { StupidApiExport } from '@stupid-apis/shared';

const DISH_PREFIXES = ['Braised', 'Reverse-Seared', 'Slow-Pulled', 'Crust-Forward', 'Twice-Lonely', 'Pan-Forgotten', 'Stewed'];
const DISH_NOUNS = ['Chickpeas', 'Beets', 'Endive', 'Marrow', 'Lamb Shank', 'Cabbage', 'Celery Root', 'Sourdough'];
const DISH_SUFFIXES = ['with Burnt Butter', 'in a Honey Reduction', 'with Pickled Apology', 'over Sage Memory', 'with Citrus Tension'];

const INGREDIENTS = [
  '2 cups all-purpose flour',
  '1 large yellow onion, regretted',
  '3 tablespoons olive oil',
  '1 bay leaf, named',
  'a pinch of resentment',
  '1 lemon, witnessed',
  '4 cloves garlic, lightly crushed in spirit',
  'a small handful of unspoken concerns',
  '1 cup vegetable stock, or 1 cup water plus what you remember',
  '2 sprigs thyme',
  'kosher salt, to taste',
  '1 teaspoon paprika',
  'butter, the unsalted kind, the unfaithful kind',
  'one egg, told the truth',
  'a quart of patience, divided',
];

const STEPS = [
  'Preheat the oven to 400°F. Apologize to the oven.',
  'In a heavy skillet, warm the oil until it shimmers slightly more than expected.',
  'Add the onions and cook until translucent, then briefly opaque, then translucent again.',
  'Whisper your intentions to the butter.',
  'Stir constantly. Do not stop. Do not look away.',
  'Reduce by half. Reduce by another half. Reduce until the pan is smaller than it was.',
  'Add the bay leaf. Acknowledge it.',
  'Cover and let rest for the length of one phone call you have been avoiding.',
  'Season with salt. Then with more salt. Then forgive the salt.',
  'Plate immediately. Do not photograph it. The food does not consent.',
  'Garnish with thyme. Or with something that looks like thyme.',
  'Taste. Adjust. Taste again. Recommit.',
];

const PAIRINGS = [
  'a glass of water, sparkling, judgmental',
  'a 2019 white burgundy you will not finish',
  'cold tea',
  'one beer',
  'the leftover wine from Saturday',
  'whatever the host is having',
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
  dish_name: string;
  serves: number;
  prep_time: string;
  cook_time: string;
  ingredients: string[];
  steps: string[];
  pairing: string;
  difficulty: string;
}

function generate(): Result {
  return {
    dish_name: `${pickOne(DISH_PREFIXES)} ${pickOne(DISH_NOUNS)} ${pickOne(DISH_SUFFIXES)}`,
    serves: 2 + Math.floor(Math.random() * 6),
    prep_time: `${15 + Math.floor(Math.random() * 30)} minutes`,
    cook_time: `${30 + Math.floor(Math.random() * 90)} minutes`,
    ingredients: pickN(INGREDIENTS, 7),
    steps: pickN(STEPS, 6),
    pairing: pickOne(PAIRINGS),
    difficulty: pickOne(['accessible', 'intermediate', 'unwise', 'unknowable']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a recipe with cursed ingredients and steps. Returns dish name, serves, prep time, cook time, ingredients, steps, pairing, and difficulty.',
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
