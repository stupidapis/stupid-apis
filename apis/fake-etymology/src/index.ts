import type { StupidApiExport } from '@stupid-apis/shared';

const ROOTS = [
  'Old Norse',
  'Middle English',
  'Late Latin',
  'Vulgar Latin',
  'Proto-Germanic',
  'Old French',
  'Old Saxon',
  'Anglo-Norman',
  'Common Slavic',
  'Pre-Indic',
];

const PSEUDO_WORDS = [
  'sand-veikr', 'morn-spell', 'graef-stein', 'horde-mund', 'tundra-leik', 'verm-bend',
  'low-hund', 'broth-rik', 'fjall-grun', 'wend-mast', 'thrym-bole', 'orth-vild',
];

const ORIGINAL_MEANINGS = [
  'beach betrayal',
  'a small private grief',
  'the act of sweeping a doorway after midnight',
  'a question no one wanted to answer',
  'a third helping',
  'an unannounced arrival',
  'the rope that ties two unrelated objects',
  'the silence between argument and apology',
  'a tool used only once and then named',
  'a journey of less than a mile, taken seriously',
];

const PATHS = [
  'entered Middle English in the 12th century',
  'arrived via French traders',
  'first appears in a 1486 ledger of complaints',
  'was nearly lost; recovered in a song',
  'was pluralized incorrectly and the error stuck',
  'shifted meaning during a long winter',
];

const COGNATES = [
  'cognate with the Faroese verb for "to wait"',
  'cognate with a Lithuanian word for "porch"',
  'shares a root with the modern German word for "yes, but"',
  'cognate with Welsh "to be slightly sorry"',
  'a parallel form survives in Maltese',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  word: string;
  origin_language: string;
  proto_form: string;
  original_meaning: string;
  development: string;
  cognates: string;
  first_attested: number;
  citation: string;
}

function trace(word: string): Result {
  let h = 0;
  for (let i = 0; i < word.length; i++) h = ((h << 5) - h) + word.charCodeAt(i);
  h = Math.abs(h);
  return {
    word,
    origin_language: ROOTS[h % ROOTS.length],
    proto_form: PSEUDO_WORDS[h % PSEUDO_WORDS.length],
    original_meaning: ORIGINAL_MEANINGS[h % ORIGINAL_MEANINGS.length],
    development: PATHS[h % PATHS.length],
    cognates: COGNATES[h % COGNATES.length],
    first_attested: 1100 + (h % 800),
    citation: 'fragmentary, contested',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'trace',
    description:
      'Returns a made-up etymology for any word: origin language, proto-form, original meaning, development, cognates, and first attestation. Deterministic by input.',
    inputSchema: {
      type: 'object',
      properties: {
        word: { type: 'string', description: 'The word to trace.' },
      },
      required: ['word'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'trace': {
      const w = (args.word as string) || '';
      if (!w.trim()) throw new Error('Word required.');
      return trace(w);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
