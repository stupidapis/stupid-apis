import type { StupidApiExport } from '@stupid-apis/shared';

const STRUCTURAL = [
  'Ah yes, a 47-line if-else. Bold choice.',
  'I see we are nesting today.',
  'This function does eight things, and I am being charitable.',
  'You wrote a class so the class could have problems.',
  'I count three return paths and a moral one.',
  'A well-named variable. Surrounded by enemies.',
  'This is recursion in the same way a maze is recursion.',
  'You used a regex. It works on Tuesdays.',
];

const STYLE = [
  'The indentation is a personality.',
  'Your comments have aged like milk.',
  'You named this `data`. We are all going to need a moment.',
  'There is a TODO from 2019. The TODO is your superior.',
  'Trailing whitespace. We see it.',
  'You imported the kitchen sink and then did not wash it.',
  'A semicolon. One. Why.',
];

const SEMANTIC = [
  'You are catching the error and then forgetting it.',
  'You are checking for null after using the value.',
  'You are reading the file three times. Once, lovingly.',
  'You are mutating the input. We will discuss this later.',
  'Your date math is going to fail in March.',
  'Your sort is stable; you are not.',
  'Your boolean has three states.',
];

const VERDICTS = [
  'ships, eventually',
  'passes review by the second reviewer who has stopped reading',
  'will haunt the codebase like a small, persistent rumor',
  'fine for prod, regrettable for posterity',
  'a working, tested, deeply unhappy piece of code',
];

const RECOMMENDED_NEXT = [
  'sleep on it',
  'extract one thing — any one thing — into a function',
  'rename the most-used variable; you will know which one',
  'delete the comment, then write a better one only if needed',
  'add one test, then look at the test and listen to what it tells you',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  language: string;
  structural_critique: string;
  style_critique: string;
  semantic_critique: string;
  verdict: string;
  recommended_next: string;
  reviewer_mood: string;
}

const REVIEWER_MOOD = ['tired', 'professional', 'tired but professional', 'late stage of caring'];

function review(language: string): Result {
  return {
    language,
    structural_critique: pickOne(STRUCTURAL),
    style_critique: pickOne(STYLE),
    semantic_critique: pickOne(SEMANTIC),
    verdict: pickOne(VERDICTS),
    recommended_next: pickOne(RECOMMENDED_NEXT),
    reviewer_mood: pickOne(REVIEWER_MOOD),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'review',
    description:
      'Returns a snarky code review for a given language or general code. The review does not read your code. The review has, however, opinions.',
    inputSchema: {
      type: 'object',
      properties: {
        language: { type: 'string', description: 'Programming language (any string). Used as flavor only.' },
      },
      required: ['language'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'review': {
      const lang = (args.language as string) || '';
      if (!lang.trim()) throw new Error('Language required.');
      return review(lang);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
