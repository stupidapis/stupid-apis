import type { StupidApiExport } from '@stupid-apis/shared';

const HEADLINES = [
  'Charming starter home with character',
  'Light-filled with original details',
  'Mid-century, gently lived in',
  'A rare find on this block',
  'Updated where it counts',
  'Move-in ready (with one exception)',
];

const HIGHLIGHTS = [
  'Original hardwood throughout (mostly).',
  'Updated kitchen, retains its opinions.',
  'South-facing.',
  'Walkable to two of three things you would want.',
  'Quiet street; the neighbors are quieter.',
  'Vaulted ceilings in two rooms; haunted in one.',
  'Garage parks one car or two complaints.',
  'Bathroom: recently retiled. Patina: original.',
];

const QUIRKS = [
  'Studio. South-facing. Haunted.',
  'Third bedroom is a tradition.',
  'The basement is finished but uncommitted.',
  'Closet door has views.',
  'Boiler is reliable on most days.',
  'Hot tub in the photos is from a different listing.',
];

const NEIGHBORHOOD = [
  'Walking distance to one cafe, one pharmacy, one neighbor everyone knows.',
  'Family-friendly block with a long-running parking dispute.',
  'Up-and-coming, in the way that has been said for 14 years.',
  'Established neighborhood with a strong civic association.',
  'Quiet, except on Tuesdays.',
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
  address: string;
  headline: string;
  beds: number;
  baths: number;
  square_feet: number;
  year_built: number;
  list_price: string;
  description: string;
  highlights: string[];
  quirk: string;
  neighborhood: string;
  status: 'active' | 'pending' | 'come back later';
  agent: string;
}

function listing(address: string): Result {
  const beds = 1 + Math.floor(Math.random() * 4);
  const baths = 1 + Math.floor(Math.random() * 3);
  const sqft = 600 + Math.floor(Math.random() * 2200);
  const year = 1900 + Math.floor(Math.random() * 124);
  const price = 200 + Math.floor(Math.random() * 1800);
  return {
    address,
    headline: pickOne(HEADLINES),
    beds,
    baths,
    square_feet: sqft,
    year_built: year,
    list_price: `$${price.toLocaleString()},000`,
    description: `${beds} bed, ${baths} bath at ${address}. ${pickOne(HEADLINES)}. ${pickOne(['Sold as-is.', 'Inspections welcomed.', 'Bring offers.', 'No contingencies preferred.'])}`,
    highlights: pickN(HIGHLIGHTS, 4),
    quirk: pickOne(QUIRKS),
    neighborhood: pickOne(NEIGHBORHOOD),
    status: pickOne(['active', 'pending', 'come back later']),
    agent: pickOne(['Marisol Crane, Realtor', 'Tomas Reiner, Broker Associate', 'Helen Park, Listing Agent']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'listing',
    description:
      'Generates a real estate listing for any address. Returns headline, beds/baths/sqft, year built, price, highlights, one quirk (e.g. "Haunted"), neighborhood note, status, and listing agent.',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Property address.' },
      },
      required: ['address'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'listing': {
      const a = (args.address as string) || '';
      if (!a.trim()) throw new Error('Address required.');
      return listing(a);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
