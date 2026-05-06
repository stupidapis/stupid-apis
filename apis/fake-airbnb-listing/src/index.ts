import type { StupidApiExport } from '@stupid-apis/shared';

const TITLES = [
  'Charming Studio with Heart',
  'Cozy Bungalow, Mostly Original',
  'Quiet Apartment with a History',
  'Restored Outbuilding (sleeps 4)',
  'Architect-Designed, Resident-Approved',
  'Renovated Loft, Some Surprises',
  'Garden Cottage with a View, of Sorts',
  'Boutique Apartment, Period Details',
];

const QUIRKS = [
  'The owl considers itself a roommate',
  'Wifi is unreliable but the wifi is unreliable for everyone',
  'The kitchen drawer sticks; we know',
  'The hot water comes on its own schedule',
  'The neighbors are present',
  'A small ghost; nothing serious',
  'The third bedroom is a tradition, not a room',
  'The host\'s mother visits unannounced (rarely)',
  'The lock has been replaced; the new key is the same',
];

const HOST_NOTES = [
  'I have lived here for nineteen years and I am happy to share it with you, mostly.',
  'My wife and I bought this place for our retirement; we are not retired.',
  'The space is ours when we are not abroad. The cat will tell you if it is.',
  'We renovated this last year. The renovations are 80% complete.',
  'I am a designer; the linens reflect this.',
  'My grandmother passed and left us this place; please respect her chair.',
];

const RATINGS = [4.6, 4.7, 4.8, 4.9, 4.92, 4.97];

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
  title: string;
  location: string;
  description: string;
  host_note: string;
  sleeps: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  quirks: string[];
  rating: number;
  reviews: number;
  price_per_night: string;
}

const AMENITIES = ['wifi', 'kitchen', 'free street parking (where allowed)', 'washer (sometimes)', 'self check-in', 'workspace', 'air conditioning', 'pet considered'];

function list(location: string): Result {
  return {
    title: pickOne(TITLES),
    location,
    description: `A welcoming home in ${location}. ${pickOne(['South-facing.', 'North-facing on weekends.', 'Light most of the day.', 'Light on most days.'])} ${pickOne(['Renovated in 2019.', 'Renovated in spirit.', 'Original to the year of the building.'])} Walking distance to ${pickOne(['cafes', 'a market', 'the river', 'one specific bakery', 'a grocer', 'the train, briskly'])}.`,
    host_note: pickOne(HOST_NOTES),
    sleeps: 2 + Math.floor(Math.random() * 5),
    bedrooms: 1 + Math.floor(Math.random() * 3),
    bathrooms: 1 + Math.floor(Math.random() * 2),
    amenities: pickN(AMENITIES, 5),
    quirks: pickN(QUIRKS, 3),
    rating: pickOne(RATINGS),
    reviews: 14 + Math.floor(Math.random() * 220),
    price_per_night: `$${88 + Math.floor(Math.random() * 220)}`,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'list',
    description:
      'Generates an Airbnb listing for any location. Returns title, description, host note, sleeps, amenities, quirks (e.g. "the owl considers itself a roommate"), rating, and price.',
    inputSchema: {
      type: 'object',
      properties: {
        location: { type: 'string', description: 'City, neighborhood, or area.' },
      },
      required: ['location'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list': {
      const l = (args.location as string) || '';
      if (!l.trim()) throw new Error('Location required.');
      return list(l);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
