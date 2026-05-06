import type { StupidApiExport } from '@stupid-apis/shared';

const SIZES = ['short', 'tall', 'grande', 'venti', 'trenta', 'medium-medium'];
const TEMPS = ['hot', 'iced', 'extra hot', 'lukewarm by request'];
const BASES = ['flat white', 'latte', 'cappuccino', 'macchiato', 'americano', 'cortado', 'cold brew', 'pour-over', 'drip', 'mocha', 'cappuccino freddo'];
const MILKS = ['oat milk', 'almond milk', 'soy', 'whole milk', 'skim', 'half-and-half', 'macadamia', 'pea protein milk'];
const SYRUPS = ['vanilla', 'lavender', 'caramel', 'hazelnut', 'turmeric', 'pistachio', 'maple', 'cinnamon dolce'];
const MODIFIERS = ['half decaf', 'extra shot', 'ristretto', 'no foam', 'extra foam', 'light ice', 'no ice', 'with whip', 'no whip'];
const ABSURDS = ['two pumps of guilt', 'one pump of resignation', 'served in two cups for emotional reasons', 'with the lid on', 'name spelled deliberately wrong', 'named after a relative', 'in a personal cup brought from home'];

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
  order: string;
  components: {
    size: string;
    temperature: string;
    base: string;
    milk: string;
    syrup: string;
    modifiers: string[];
    absurd: string;
  };
  estimated_price: string;
  estimated_prep_time: string;
  barista_response: string;
}

const BARISTA_RESPONSES = [
  'a small sigh, then nothing',
  'a polite nod and three minutes of silence',
  'asks the customer to repeat the order',
  'rings it up without comment',
  'asks the customer for their name',
  'tells the customer the syrup is not in stock',
];

function order(): Result {
  const size = pickOne(SIZES);
  const temp = pickOne(TEMPS);
  const base = pickOne(BASES);
  const milk = pickOne(MILKS);
  const syrup = pickOne(SYRUPS);
  const mods = pickN(MODIFIERS, 2);
  const absurd = pickOne(ABSURDS);

  const orderText = `A ${size} ${temp} ${syrup} ${milk} ${base}, ${mods.join(', ')}, ${absurd}.`;

  return {
    order: orderText,
    components: { size, temperature: temp, base, milk, syrup, modifiers: mods, absurd },
    estimated_price: `$${(6 + Math.random() * 6).toFixed(2)}`,
    estimated_prep_time: `${4 + Math.floor(Math.random() * 8)} minutes`,
    barista_response: pickOne(BARISTA_RESPONSES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'order',
    description:
      'Generates a chaotic Starbucks-style coffee order: size, temp, base, milk, syrup, modifiers, plus one absurd request. Returns the full order line plus components, price, prep time, and barista response.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'order':
      return order();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
