import type { StupidApiExport } from '@stupid-apis/shared';

const ADJECTIVES = [
  'velvet', 'electric', 'wounded', 'soft', 'midnight', 'broken', 'unstable',
  'civic', 'private', 'public', 'former', 'borrowed', 'minor', 'distant',
];

const NOUNS = [
  'toasters', 'compromise', 'paperwork', 'denominations', 'kitchens', 'crows',
  'machines', 'children', 'beverages', 'teachers', 'libraries', 'umbrellas',
  'commuters', 'cellars', 'parking', 'dishes',
];

const SOLO = [
  'Phaedra', 'Bret', 'Saint Lonergan', 'Dolores Twice', 'Coastline',
  'Marcellus Park', 'Anaesthetic Cathy', 'Lou DeMatteo', 'Crissy Veil',
];

const GENRES = [
  'synthgrass', 'doom-folk', 'post-everything', 'ambient hardcore',
  'algebraic punk', 'midwestern metal', 'sad funk', 'church-basement noise',
  'acoustic industrial', 'nu-classical', 'beige rock', 'lobby-core',
];

const SONGS = [
  'Crumbs of Yesterday',
  'I Was the Microwave',
  'Soft and Sorry',
  'Returns Department',
  'Late to the Funeral',
  'Two-Bedroom Apocalypse',
  'Pre-Existing Condition',
  'The Wound is the Door',
  'My Mother\'s Briefcase',
  'Out of Service',
  'Receipt Paper',
  'Weekday Saint',
];

const LEGACIES = [
  'one EP, lost',
  'one good album, two bad ones',
  'a B-side that aged well',
  'a documentary about them is in development',
  'mostly remembered for a feud',
  'never charted; never broke up either',
  'their merch is now collectible',
  'covered once, on a TV show, badly',
  'cited as an influence by people who never heard them',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function bandName(): string {
  const r = Math.random();
  if (r < 0.4) return `The ${capitalize(pickOne(ADJECTIVES))} ${capitalize(pickOne(NOUNS))}`;
  if (r < 0.7) return `${capitalize(pickOne(NOUNS))}, ${capitalize(pickOne(NOUNS))}`;
  return pickOne(SOLO);
}

interface Result {
  band_name: string;
  genre: string;
  hit_song: string;
  hit_year: number;
  breakup_year: number;
  legacy: string;
}

function generate(): Result {
  const hit_year = 1978 + Math.floor(Math.random() * 45);
  const breakup_year = hit_year + 1 + Math.floor(Math.random() * 12);
  return {
    band_name: bandName(),
    genre: pickOne(GENRES),
    hit_song: pickOne(SONGS),
    hit_year,
    breakup_year,
    legacy: pickOne(LEGACIES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates one fake band: name, genre, hit song, hit year, breakup year, and legacy. The band did not exist. The legacy is canonical anyway.',
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
