import type { StupidApiExport } from '@stupid-apis/shared';

const QUOTES = [
  'Brilliantly beige.',
  'A triumph of restraint.',
  'You will not stop watching. Whether you should is another question.',
  'A small miracle, well disguised.',
  'I have not stopped thinking about it. I would like to.',
  'Demands a second viewing, if only to confirm the first.',
  'A masterclass in things being a certain length.',
  'Audacious. Possibly inadvertently.',
  'A book. A real book. Among books.',
  'I do not know what to think, and I am thinking about it now.',
  'It moved me to forward it to my brother.',
  'Tighter than its 312 pages would suggest.',
  'A confident debut. Confidence is a feature.',
  'It is exactly what it is, and that is a relief.',
];

const ATTRIBUTIONS = [
  'A Critic',
  'The New York Times (somebody at)',
  'The Guardian, possibly',
  'The Atlantic Monthly Quarterly',
  'Jeremy from work',
  'a verified user account',
  'a podcast nobody listens to',
  'a library committee in Vermont',
  'an unsigned blog entry from 2018',
];

const RECOMMEND = ['four out of five', '★★★★', 'recommended', 'recommended (with reservations)', 'a strong soft yes', 'a yes shaped like a question'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  work: string;
  work_type: string;
  pull_quote: string;
  attribution: string;
  publication: string;
  recommendation: string;
  star_rating: string;
}

function quote(work: string, workType: string): Result {
  return {
    work,
    work_type: workType,
    pull_quote: pickOne(QUOTES),
    attribution: pickOne(ATTRIBUTIONS),
    publication: pickOne(['The Quarterly', 'A Newsletter', 'Public Radio Affiliate', 'Substack (popular)', 'Goodreads aggregate']),
    recommendation: pickOne(RECOMMEND),
    star_rating: ['★', '★★', '★★★', '★★★★', '★★★★★'][2 + Math.floor(Math.random() * 3)],
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'quote',
    description:
      'Returns a fake pull quote for any work (book, film, album, podcast, talk). Includes attribution, publication, recommendation, and star rating.',
    inputSchema: {
      type: 'object',
      properties: {
        work: { type: 'string', description: 'The title.' },
        work_type: { type: 'string', enum: ['book', 'film', 'album', 'podcast', 'talk', 'play', 'show'], description: 'Default: book.' },
      },
      required: ['work'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'quote': {
      const w = (args.work as string) || '';
      if (!w.trim()) throw new Error('Work required.');
      const t = (args.work_type as string) || 'book';
      return quote(w, t);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
