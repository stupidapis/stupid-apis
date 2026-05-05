import type { StupidApiExport } from '@stupid-apis/shared';

const SYMBOL_MEANINGS = [
  'represents your unresolved tax debt',
  'symbolizes a meeting you have not yet declined',
  'is your subconscious processing a pending email',
  'represents the dishwasher',
  'symbolizes a person you owe a text to',
  'is the part of yourself that refuses to merge the PR',
  'represents a friendship you are slowly auditing',
  'symbolizes a financial decision you have not yet made',
  'is your unmet need for a different chair',
  'represents the version of you that goes to bed earlier',
  'symbolizes a coworker you have feelings about',
  'is your inner child filing a grievance',
];

const FREUDIAN_INTERPRETATIONS = [
  'You are processing a desire you have not named.',
  'You are avoiding an obligation that has not yet asked.',
  'You are working through a small betrayal of your own making.',
  'You are mourning a version of yourself from approximately 2017.',
  'You are negotiating with the part of you that wants to quit.',
  'You are waiting for permission you do not need.',
];

const RECOMMENDATIONS = [
  'do nothing about this',
  'mention it to one trusted friend, briefly',
  'eat protein',
  'reschedule the appointment',
  'take a walk and observe the trees with skepticism',
  'do not look up the symbolism online',
];

const ACCURACY_DISCLAIMERS = [
  'this interpretation is non-binding',
  'this interpretation is a vibe',
  'this interpretation has not been peer-reviewed',
  'consult a professional, but not the kind that would interpret this',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  dream: string;
  primary_symbol_interpretation: string;
  freudian_reading: string;
  recommendation: string;
  disclaimer: string;
  recurrence_likely: boolean;
}

function interpret(dream: string): Result {
  return {
    dream,
    primary_symbol_interpretation: `The central object ${pickOne(SYMBOL_MEANINGS)}.`,
    freudian_reading: pickOne(FREUDIAN_INTERPRETATIONS),
    recommendation: pickOne(RECOMMENDATIONS),
    disclaimer: pickOne(ACCURACY_DISCLAIMERS),
    recurrence_likely: Math.random() < 0.5,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'interpret',
    description:
      'Returns a Freudian-flavored interpretation of any dream. The interpretation is generic. The confidence is performative.',
    inputSchema: {
      type: 'object',
      properties: {
        dream: { type: 'string', description: 'The dream, in your own words.' },
      },
      required: ['dream'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'interpret': {
      const d = (args.dream as string) || '';
      if (!d.trim()) throw new Error('A dream is required.');
      return interpret(d);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
