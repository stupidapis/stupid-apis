import type { StupidApiExport } from '@stupid-apis/shared';

const NAMES = [
  'The Wounded Accountant',
  'A Brief Misunderstanding',
  'The Last Train',
  'Pre-Existing Condition',
  'The Quiet Resignation',
  'Tuesday\'s Apology',
  'The Honest Friend',
  'A Small Inheritance',
  'The Office Romance',
  'Monday Morning',
  'The Three-Day Notice',
  'Late Capitalism',
];

const SPIRITS = [
  'gin', 'rye', 'vodka', 'mezcal', 'rum (white)', 'rum (dark)', 'tequila blanco', 'cognac', 'sake',
];

const MIXERS = [
  'tonic', 'soda water', 'vermouth (dry)', 'vermouth (sweet)', 'amaro', 'lemon juice', 'lime juice', 'grapefruit juice',
];

const ABSURD = [
  'one olive', 'tears',
  'a thimble of regret', 'a single basil leaf, named',
  '1 dash of bitters, principled', 'a pinch of resentment',
  'an ice cube from your hometown', 'a quarter teaspoon of unspoken concerns',
  '0.25 oz simple syrup made with sea salt',
  'one drop of orange flower water',
  'the rind of a lemon you have known a long time',
];

const GLASSWARE = ['coupe', 'rocks', 'highball', 'martini', 'mug', 'small jar'];
const GARNISHES = ['lemon twist', 'olive', 'rosemary sprig', 'cinnamon stick', 'sea salt rim', 'one ice cube, large'];
const METHODS = ['stirred, not shaken', 'shaken hard', 'built in glass', 'rolled', 'thrown back and forth between two tins'];

const BACKSTORIES = [
  'invented in 2014 at a bar that closed in 2015',
  'served only at a bar in Tucson; the bar denies its existence',
  'attributed to a barkeep who was later revealed to be three children in a coat',
  'first appeared in a 1972 cookbook withdrawn after one printing',
  'rumored to have been ordered by a sitting senator, which the senator denies',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  name: string;
  ingredients: string[];
  glassware: string;
  method: string;
  garnish: string;
  backstory: string;
  abv_estimate: string;
  recommended_for: string;
}

const RECOMMENDED_FOR = [
  'a wedding you did not want to attend',
  'a Wednesday',
  'after the difficult phone call',
  'on the porch in a coat',
  'when the hosts are watching',
];

function invent(): Result {
  return {
    name: pickOne(NAMES),
    ingredients: [
      `2 oz ${pickOne(SPIRITS)}`,
      `0.75 oz ${pickOne(MIXERS)}`,
      pickOne(ABSURD),
      pickOne(ABSURD),
    ],
    glassware: pickOne(GLASSWARE),
    method: pickOne(METHODS),
    garnish: pickOne(GARNISHES),
    backstory: pickOne(BACKSTORIES),
    abv_estimate: `${22 + Math.floor(Math.random() * 22)}%`,
    recommended_for: pickOne(RECOMMENDED_FOR),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'invent',
    description:
      'Invents a cocktail with absurd ingredients and a brief tragic backstory. Returns name, ingredients, glassware, method, garnish, and ABV estimate.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'invent':
      return invent();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
