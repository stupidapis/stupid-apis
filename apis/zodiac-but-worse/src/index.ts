import type { StupidApiExport } from '@stupid-apis/shared';

interface Sign {
  name: string;
  symbol: string;
  element: string;
  traits: string[];
  unfortunate_alignment: string;
}

const SIGNS: Sign[] = [
  { name: 'The Disappointed Raccoon', symbol: '🦝', element: 'asphalt', traits: ['observant', 'unwelcome', 'precise'], unfortunate_alignment: 'compatible with no one' },
  { name: 'The Forgotten Tab', symbol: '🗂️', element: 'memory', traits: ['lingering', 'unread', 'still cued up'], unfortunate_alignment: 'compatible with the Unwashed Mug' },
  { name: 'The Unwashed Mug', symbol: '☕', element: 'milk', traits: ['inert', 'patient', 'inevitable'], unfortunate_alignment: 'compatible with the Forgotten Tab' },
  { name: 'The Damp Sock', symbol: '🧦', element: 'water (small)', traits: ['unsettling', 'tactile', 'avoidable'], unfortunate_alignment: 'incompatible with footwear' },
  { name: 'The Loud Neighbor', symbol: '🚪', element: 'wall', traits: ['committed', 'unaware', 'persistent'], unfortunate_alignment: 'compatible with thin walls' },
  { name: 'The Last Slice', symbol: '🍕', element: 'cardboard', traits: ['polite', 'unclaimed', 'judged'], unfortunate_alignment: 'compatible with the dishwasher' },
  { name: 'The Drained Battery', symbol: '🔋', element: 'static', traits: ['waning', 'familiar', 'eventually'], unfortunate_alignment: 'compatible with airports' },
  { name: 'The Open Loop', symbol: '🔁', element: 'time', traits: ['returning', 'unresolved', 'present'], unfortunate_alignment: 'compatible with no one yet' },
  { name: 'The Cold Pizza', symbol: '🍕', element: 'fridge', traits: ['waiting', 'principled', 'misunderstood'], unfortunate_alignment: 'compatible with morning' },
  { name: 'The Empty Group Chat', symbol: '💬', element: 'silence', traits: ['hopeful', 'patient', 'thinning'], unfortunate_alignment: 'compatible with read receipts' },
  { name: 'The Plastic Fork', symbol: '🍴', element: 'styrofoam', traits: ['minor', 'available', 'inevitable'], unfortunate_alignment: 'compatible with takeout' },
  { name: 'The Buffering Wheel', symbol: '⌛', element: 'wifi', traits: ['hopeful', 'eternal', 'spinning'], unfortunate_alignment: 'compatible with hotels' },
];

interface Result {
  birthday: string;
  new_sign: string;
  symbol: string;
  element: string;
  traits: string[];
  unfortunate_alignment: string;
  retired_sign: string;
}

function hashDate(d: string): number {
  let h = 0;
  for (let i = 0; i < d.length; i++) h = ((h << 5) - h) + d.charCodeAt(i);
  return Math.abs(h);
}

function assign(birthday: string): Result {
  const sign = SIGNS[hashDate(birthday) % SIGNS.length];
  return {
    birthday,
    new_sign: sign.name,
    symbol: sign.symbol,
    element: sign.element,
    traits: sign.traits,
    unfortunate_alignment: sign.unfortunate_alignment,
    retired_sign: 'unverified — please bring your own',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'assign',
    description:
      'Assigns a new, worse zodiac sign based on birthday. Returns the sign, symbol, element, traits, alignment, and the retired (real) sign.',
    inputSchema: {
      type: 'object',
      properties: {
        birthday: { type: 'string', description: 'Birthday in any format. The string is hashed to pick a sign.' },
      },
      required: ['birthday'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'assign': {
      const b = (args.birthday as string) || '';
      if (!b.trim()) throw new Error('Birthday required.');
      return assign(b);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
