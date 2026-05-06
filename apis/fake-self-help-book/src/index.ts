import type { StupidApiExport } from '@stupid-apis/shared';

const TITLE_TEMPLATES = [
  'The Power of Doing Less, Slower',
  'The Inconvenient Yes',
  'Stop Trying',
  'You Are Already Late',
  'The Subtle Art of Showing Up',
  'Small Mistakes, Quietly',
  'The Quiet Ambition',
  'Maybe Tomorrow',
  'The Five-Minute Excuse',
  'How to Disappoint Yourself Honestly',
];

const SUBTITLES = [
  'and other lessons from a life lived adjacent to success',
  'a counterintuitive guide for the ambitious-but-tired',
  'why the secret has been wrong, and what to replace it with',
  'a manifesto for people who own at least one houseplant',
  'reflections from a sabbatical I did not take',
  'the only book on this subject, by accident',
];

const CHAPTERS = [
  'Chapter 1: The First Lie I Told Myself',
  'Chapter 2: Why Most Advice is Vending Machine',
  'Chapter 3: The Houseplant Method',
  'Chapter 4: Saying No to Yes',
  'Chapter 5: The Eleven-Minute Tea',
  'Chapter 6: Showing Up, Then Leaving',
  'Chapter 7: A Long Walk About Money',
  'Chapter 8: The People in Your Phone',
  'Chapter 9: Tuesday is the Real Monday',
  'Chapter 10: The Inheritance You Did Not Ask For',
  'Chapter 11: Naps as Strategy',
  'Chapter 12: Where We Go from Here (Nowhere)',
];

const ENDORSERS = [
  '"A revelation. Or close enough." — A Famous Author',
  '"This book changed my morning." — Unverified',
  '"I read it in one sitting and then sat for a long time." — A Reader',
  '"Smart, sad, and slightly damp." — A Critic',
  '"I gave it to my mother. She has not called." — A Daughter',
];

const PUBLISHER_NOTES = [
  'expanded edition with new foreword',
  'translated into eleven languages, mostly poorly',
  'a New York Times bestseller for one week',
  'over 200,000 copies sold, returned, and resold',
  'optioned for a documentary that did not happen',
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
  title: string;
  subtitle: string;
  author: string;
  chapters: string[];
  endorsement: string;
  publisher_note: string;
  page_count: number;
  shelf_position: string;
}

const AUTHORS = [
  'Helena Brooks',
  'Tomas Reiner',
  'Maya Petrov, MA',
  'Dr. Lewis Mond',
  'Cassandra Lee, PhD',
  'Edmund Walther',
];

const SHELVES = [
  'mid-shelf, ambitious section',
  'end cap, near checkout',
  'discount bin, eventually',
  'staff picks (briefly)',
  'in the airport, between thrillers and biographies',
];

function generate(): Result {
  return {
    title: pickOne(TITLE_TEMPLATES),
    subtitle: pickOne(SUBTITLES),
    author: pickOne(AUTHORS),
    chapters: pickN(CHAPTERS, 6),
    endorsement: pickOne(ENDORSERS),
    publisher_note: pickOne(PUBLISHER_NOTES),
    page_count: 180 + Math.floor(Math.random() * 160),
    shelf_position: pickOne(SHELVES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a fake self-help book: title, subtitle, author, six chapters, an endorsement, publisher note, page count, and shelf position.',
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
