import type { StupidApiExport } from '@stupid-apis/shared';

const RESTAURANT_NAMES = [
  'Plate',
  'Hearth & Counter',
  'The Communal Bench',
  'Tare',
  'Salt + Patience',
  'A Small Concern',
  'The Wandering Plate',
  'Threshold',
  'The Long Table',
  'Provisions',
];

const STARTERS = [
  'Deconstructed water, foraged ice',
  'Single radish, salted, served on a board',
  'House sourdough, arrived',
  'Compressed cucumber and a memory of dill',
  'Pickled onion, three ways, one onion',
  'Smoked butter on its own',
];

const MAINS = [
  'Slow-cooked lamb shoulder over reduced silence',
  'Beet, prepared from belief',
  'Grilled trout with whatever the kitchen has decided',
  'Brown rice, restored',
  'Cauliflower, painted',
  'Pasta, hand-cut by Lawrence',
  'Roasted carrot, intended',
];

const DESSERTS = [
  'Olive oil cake, a small one',
  'Sorbet of two fruits, undisclosed',
  'Honeycomb on a saucer',
  'Affogato, but with regret',
  'Bread pudding, defended',
];

const PRICE_RANGES = [
  { starter: [22, 38], main: [42, 78], dessert: [16, 28] },
];

const FOOTNOTES = [
  'The kitchen prefers our 12-course tasting; please ask',
  'Substitutions are not available, philosophically or otherwise',
  '20% gratuity included on parties of two and up',
  'Ingredients sourced within the building when possible',
  'A still water service charge of $9 applies',
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

function priceFor(item: string, range: [number, number]): { name: string; price: number } {
  const [lo, hi] = range;
  return { name: item, price: lo + Math.floor(Math.random() * (hi - lo + 1)) };
}

interface Result {
  restaurant: string;
  cuisine: string;
  starters: { name: string; price: number }[];
  mains: { name: string; price: number }[];
  desserts: { name: string; price: number }[];
  footnote: string;
  reservation_window: string;
}

const CUISINES = ['New American', 'Modern Continental', 'Seasonal', 'Locally Foraged', 'Hand-Restrained'];

function generate(): Result {
  const r = PRICE_RANGES[0];
  return {
    restaurant: pickOne(RESTAURANT_NAMES),
    cuisine: pickOne(CUISINES),
    starters: pickN(STARTERS, 3).map((s) => priceFor(s, r.starter as [number, number])),
    mains: pickN(MAINS, 4).map((s) => priceFor(s, r.main as [number, number])),
    desserts: pickN(DESSERTS, 2).map((s) => priceFor(s, r.dessert as [number, number])),
    footnote: pickOne(FOOTNOTES),
    reservation_window: 'six to eight weeks',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a pretentious restaurant menu: name, cuisine, three starters, four mains, two desserts, footnote, and reservation window.',
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
