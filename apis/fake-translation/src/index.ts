import type { StupidApiExport } from '@stupid-apis/shared';

const SYLLABLES = ['flor', 'gree', 'znak', 'moor', 'tuln', 'vor', 'krev', 'sho', 'lem', 'pesh', 'ovi', 'kar', 'duln', 'mest', 'ari', 'thod', 'wend', 'orth'];

const REGISTERS = ['formal', 'informal', 'archaic', 'commercial', 'sworn', 'whispered'];

const REGIONS = [
  'spoken in three valleys',
  'used at court',
  'permitted only in private',
  'reserved for grain transactions',
  'common in the lower districts',
  'considered impolite north of the river',
];

const GRAMMAR_RULES = [
  'verbs are inflected for the speaker\'s mood, not tense',
  'plurals double the second consonant',
  'questions end in a nasalized vowel',
  'the negative is expressed by reversing word order',
  'honorifics are indicated by stretching the final syllable',
  'subject and object swap when the speaker is seated',
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function pickByHash<T>(arr: readonly T[], h: number): T {
  return arr[h % arr.length];
}

function fakeWord(seed: number, len: number): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += SYLLABLES[(seed + i * 7) % SYLLABLES.length];
  }
  return out;
}

interface Result {
  english: string;
  language: string;
  translation: string;
  pronunciation: string;
  register: string;
  grammar_note: string;
  cultural_note: string;
}

function translate(english: string, language: string): Result {
  const h = hashString(english + '|' + language);
  const wordCount = Math.max(1, Math.min(6, english.split(/\s+/).filter(Boolean).length));
  let translation = '';
  for (let i = 0; i < wordCount; i++) {
    if (i > 0) translation += ' ';
    translation += fakeWord(h + i * 13, 1 + (h + i) % 3);
  }
  return {
    english,
    language,
    translation,
    pronunciation: translation.replace(/([aeiouy])/gi, '$1·').replace(/·$/, ''),
    register: pickByHash(REGISTERS, h),
    grammar_note: pickByHash(GRAMMAR_RULES, h >> 1),
    cultural_note: pickByHash(REGIONS, h >> 2),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'translate',
    description:
      'Translates English into a fake language with confident grammar rules. Returns the translation, pronunciation, register, and a grammar note.',
    inputSchema: {
      type: 'object',
      properties: {
        english: { type: 'string', description: 'The English phrase to translate.' },
        language: { type: 'string', description: 'The target language (any name; the API does not check).' },
      },
      required: ['english', 'language'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'translate': {
      const e = (args.english as string) || '';
      const l = (args.language as string) || '';
      if (!e.trim() || !l.trim()) throw new Error('Both english and language are required.');
      return translate(e, l);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
