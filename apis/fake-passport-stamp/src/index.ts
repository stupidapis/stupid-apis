import type { StupidApiExport } from '@stupid-apis/shared';

const COUNTRIES = [
  'Volyndia',
  'The Free Republic of Mast',
  'Greater Andale',
  'The Twin Provinces of Caster',
  'Pretzelsburg',
  'The Coastal Marches',
  'Ostrein',
  'The Quiet Federation',
  'Northern Helia',
  'The Margravate of Verdant Halls',
];

const ENTRY_PORTS = [
  'Port of Marled',
  'Helsmund International',
  'Eastern Land Crossing #4',
  'The Bridge at Tirek',
  'Old Port Astley',
  'Rail Station 17',
];

const PURPOSES = ['Tourism', 'Business (loosely defined)', 'Visiting family', 'Transit', 'Cultural exchange', 'Reasons not specified'];

const VISA_TYPES = ['B-2 (Tourist)', 'C (Transit)', 'V-3 (Visiting Cousin)', 'G (Generally)', 'M (Maybe)'];

const NOTES = [
  'Bearer is permitted to remain for 30 days. The 30 days are at the border officer\'s discretion.',
  'Currency exchange is mandatory at the airport, even if you brought our currency.',
  'Photography permitted everywhere except where signs indicate, which is most places.',
  'Bearer is asked to refrain from singing in public buildings.',
  'Bearer is required to register at any inn within 4 hours of arrival.',
];

const STAMP_DESCRIPTIONS = [
  'circular, blue ink, partially smudged',
  'rectangular, dated, slightly off-center',
  'oval with a small heraldic bird',
  'square; the corners have been worn down',
  'octagonal, multi-color, very official-feeling',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  country: string;
  entry_port: string;
  date: string;
  visa_type: string;
  visa_duration_days: number;
  purpose: string;
  stamp_description: string;
  customs_note: string;
  exit_required_by: string;
}

function stamp(): Result {
  const days = 14 + Math.floor(Math.random() * 75);
  const entry = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 60));
  const exit = new Date(entry.getTime() + days * 86400000);
  return {
    country: pickOne(COUNTRIES),
    entry_port: pickOne(ENTRY_PORTS),
    date: entry.toISOString().slice(0, 10),
    visa_type: pickOne(VISA_TYPES),
    visa_duration_days: days,
    purpose: pickOne(PURPOSES),
    stamp_description: pickOne(STAMP_DESCRIPTIONS),
    customs_note: pickOne(NOTES),
    exit_required_by: exit.toISOString().slice(0, 10),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'stamp',
    description:
      'Returns a passport entry stamp from an invented country. Includes visa type, duration, port of entry, customs note, and exit-by date.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'stamp':
      return stamp();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
