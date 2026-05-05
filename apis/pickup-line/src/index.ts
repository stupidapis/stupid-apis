import type { StupidApiExport } from '@stupid-apis/shared';

type Category = 'nerd' | 'food' | 'science' | 'terrible';

const LINES: Record<Category, string[]> = {
  nerd: [
    'Are you a compiler? Because you keep parsing me.',
    'You had me at "have you tried turning it off and on again."',
    'Are you Wi-Fi? Because I am feeling a connection.',
    'I would never null-check you.',
    'I would refactor my life around you.',
    'Are you a stack overflow answer? Because you solved my problem.',
    'You are O(1) in my heart.',
    'Are you HTTPS? Because I trust you with my data.',
  ],
  food: [
    'Are you a microwave? Because you make me melt.',
    'If you were a fruit, you would be a fineapple.',
    'I would smuggle you out of the produce section.',
    'You are the soup to my evening.',
    'Are you a sourdough starter? Because I would feed you for years.',
    'You had me at gluten-optional.',
  ],
  science: [
    'Are you a black hole? Because I cannot escape your pull.',
    'You must be made of copper and tellurium because you are Cu-Te.',
    'My favorite element is Uranium.',
    'You are the equilibrium I never reached.',
    'Are you a magnet? Because I am attracted to you.',
    'You are like a rare earth element. Confusing, and slightly radioactive.',
  ],
  terrible: [
    'Hi.',
    'Are you my landlord? Because I am behind on you.',
    'Would you fold my laundry.',
    'I find your username acceptable.',
    'I have a coupon for one of us. The other has to pay full price.',
    'My therapist will hear about this in twenty minutes.',
  ],
};

const VALID: Category[] = ['nerd', 'food', 'science', 'terrible'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  line: string;
  category: Category;
  estimated_rejection_rate: string;
  delivery_advice: string;
  confidence_required: string;
}

function deliver(category: Category): Result {
  const rejection = category === 'terrible' ? 95 + Math.floor(Math.random() * 5)
    : category === 'science' ? 70 + Math.floor(Math.random() * 25)
    : category === 'nerd' ? 65 + Math.floor(Math.random() * 25)
    : 60 + Math.floor(Math.random() * 30);
  return {
    line: pickOne(LINES[category]),
    category,
    estimated_rejection_rate: `${rejection}%`,
    delivery_advice: 'commit fully. there is no half-commit option.',
    confidence_required: 'unreasonable',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'line',
    description:
      'Returns a pickup line by category: nerd, food, science, or terrible. Includes the estimated rejection rate.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', enum: VALID, description: 'Pickup line category. Default: terrible.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'line': {
      const cat = ((args.category as string) || 'terrible').toLowerCase();
      if (!(VALID as string[]).includes(cat)) throw new Error(`Unknown category. Use: ${VALID.join(', ')}`);
      return deliver(cat as Category);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
