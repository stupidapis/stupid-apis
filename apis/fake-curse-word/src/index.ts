import type { StupidApiExport } from '@stupid-apis/shared';

// Invents a fictional curse word with usage rules. The word is invented
// (no real-language profanity), so this stays family-friendly while
// playing the form of a vulgar dictionary entry.

const SYLLABLES = ['snorg', 'flark', 'dribb', 'morn', 'thrum', 'krev', 'pleng', 'wend', 'voost', 'gabb', 'plick', 'shoob'];
const SUFFIXES = ['le', 'ed', 'ish', 'ing', 'ery', 'ened', 'ster'];

const PARTS_OF_SPEECH = ['noun', 'verb (intransitive)', 'verb (transitive)', 'adjective', 'adverb', 'interjection'];

const USAGES = [
  'Used to express mild surprise',
  'Used to express stronger displeasure than acceptable in a kitchen',
  'Used in moments of inconvenience',
  'Used between consenting adults of equal patience',
  'Used affectionately, in private',
  'Used as a substitute when the speaker forgets the word they meant',
];

const EXAMPLES = [
  'Oh {word}.',
  'That is {word}.',
  'Don\'t be such a {word}.',
  'I {word}-ed it.',
  'Stop {word}-ing.',
  'You absolute {word}.',
];

const JURISDICTIONS = ['Banned in three states', 'Permitted in writing', 'Considered impolite north of the river', 'Acceptable in the home, never in the office', 'Prohibited at religious services'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildWord(): string {
  const root = pickOne(SYLLABLES);
  const ending = Math.random() < 0.5 ? pickOne(SUFFIXES) : '';
  return root + ending;
}

interface Result {
  word: string;
  part_of_speech: string;
  pronunciation: string;
  usage: string;
  example_sentence: string;
  intensity: string;
  jurisdictions: string;
  censorship_recommendation: string;
}

function generate(): Result {
  const word = buildWord();
  const example = pickOne(EXAMPLES).replace(/{word}/g, word);
  return {
    word,
    part_of_speech: pickOne(PARTS_OF_SPEECH),
    pronunciation: word.replace(/([aeiou])/gi, '$1·').replace(/·$/, ''),
    usage: pickOne(USAGES),
    example_sentence: example,
    intensity: pickOne(['mild', 'medium', 'strong', 'reserved for vehicles', 'reserved for one specific situation']),
    jurisdictions: pickOne(JURISDICTIONS),
    censorship_recommendation: pickOne(['print as-is', 'first letter only, the rest dashes', 'bleep on broadcast television', 'no censorship needed; nobody knows what it means']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Invents a fictional curse word with part of speech, usage notes, an example sentence, intensity, and jurisdiction notes. Stays family-friendly because the word does not exist.',
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
