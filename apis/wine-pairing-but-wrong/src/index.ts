import type { StupidApiExport } from '@stupid-apis/shared';

const WINES = [
  '2019 Bordeaux (left bank)',
  '2017 Barolo',
  '2021 Sancerre',
  'a six-month-old natural pet-nat from Slovenia',
  'a Lambrusco that was once promising',
  '1998 Chateau Margaux',
  'a chilled red whose name nobody remembers',
  '2020 Riesling, dry, kabinett',
  'a pinot grigio in a green bottle',
  'a Madeira from the second-to-last cellar',
  '2018 Châteauneuf-du-Pape',
  'a White Zinfandel',
  'a hot vermouth',
  'a port nobody opened',
  'a cellar-warm Albariño',
];

const REASONINGS = [
  'the tannins balance the cardboard',
  'the acidity cuts through the regret',
  'the minerality complements the lighting',
  'the body matches the texture of the wrapper',
  'the finish lingers approximately as long as the meal',
  'the wine and the food are equally surprised to be here',
  'they share an aroma profile that is best described as "near"',
  'they have nothing in common, which is the point',
];

const SOMM_NOTES = [
  'serve at fridge temperature, but pretend it is cellar temperature',
  'decant for forty minutes; explain why',
  'pour into a juice glass to communicate intent',
  'use the wrong glassware on purpose',
  'serve with conviction',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  food: string;
  wine: string;
  reasoning: string;
  sommelier_note: string;
  confidence: string;
  do_not_explain_to: string;
}

const DONT_EXPLAIN = [
  'an actual sommelier',
  'your father-in-law',
  'anyone who works in hospitality',
  'the wine\'s producer',
  'a Wine Spectator subscriber',
];

function pair(food: string): Result {
  return {
    food,
    wine: pickOne(WINES),
    reasoning: pickOne(REASONINGS),
    sommelier_note: pickOne(SOMM_NOTES),
    confidence: 'professional',
    do_not_explain_to: pickOne(DONT_EXPLAIN),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'pair',
    description:
      'Pairs any food with a wildly inappropriate wine. Returns the pairing, reasoning, sommelier note, and a list of people not to explain it to.',
    inputSchema: {
      type: 'object',
      properties: {
        food: { type: 'string', description: 'The food, dish, or eating situation.' },
      },
      required: ['food'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'pair': {
      const food = (args.food as string) || '';
      if (!food.trim()) throw new Error('Food required.');
      return pair(food);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
