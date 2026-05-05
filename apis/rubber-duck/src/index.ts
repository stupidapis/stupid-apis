import type { StupidApiExport } from '@stupid-apis/shared';

// The duck does not read. The duck only listens.
// All questions are cliches by design — the rubber duck is a mirror, not a debugger.

const QUESTIONS = [
  'Have you tried turning it off and on again?',
  'Did you check the logs? All of them?',
  'Are you sure that is what the code is actually doing?',
  'Could it be a typo?',
  'Have you read the error message all the way through?',
  'Are you on the right branch?',
  'Did you save the file?',
  'Is something cached?',
  'Did you restart the dev server?',
  'Are you running the right version?',
  'What does the test say?',
  'Could it be a race condition?',
  'Did you check if it is null?',
  'Is the server actually running?',
  'What did you change last?',
  'Did you read the docs?',
  'Could it be a permissions issue?',
  'Are you in the right directory?',
  'Did you install dependencies?',
  'Did you push?',
  'Is it actually deployed?',
  'Did you clear the cache?',
  'Did you try a different browser?',
  'Is your system clock right?',
  'Are you sure that is the bug, and not a symptom?',
  'Could it be the network?',
  'Have you read the line above the line that errored?',
  'Is the environment variable set?',
  'Are you authenticated?',
  'Did you reload the page?',
];

const CLOSERS = [
  'Quack.',
  'The duck has nothing more to say.',
  'The duck is staring at you.',
  'The duck remains silent.',
  'The duck blinks. Once.',
  'The duck is unimpressed.',
  'The duck waits.',
];

const MOODS = ['solemn', 'unimpressed', 'patient', 'hopeful', 'smug', 'concerned'] as const;

type Mood = typeof MOODS[number];

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

interface ConsultResult {
  bug: string;
  duck_says: string[];
  closer: string;
  duck_mood: Mood;
  confidence_in_you: number;
  quacks: string;
}

function consult(bug: string): ConsultResult {
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 questions
  const confidence = 10 + Math.floor(Math.random() * 80);
  const quackCount = 1 + Math.floor(Math.random() * 3);
  return {
    bug,
    duck_says: pickN(QUESTIONS, count),
    closer: pickOne(CLOSERS),
    duck_mood: pickOne(MOODS),
    confidence_in_you: confidence,
    quacks: 'quack '.repeat(quackCount).trim() + '.',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'consult',
    description:
      'Describe a bug to the rubber duck. The duck responds with classic debugging questions, a closer, and a confidence rating. The duck does not read your bug. The duck only listens.',
    inputSchema: {
      type: 'object',
      properties: {
        bug: {
          type: 'string',
          description: 'A description of the problem. The duck will not analyze it. The duck will, however, judge.',
        },
      },
      required: ['bug'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'consult': {
      const bug = (args.bug as string) || '';
      if (!bug.trim()) throw new Error('The duck cannot help if you will not say anything.');
      return consult(bug);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
