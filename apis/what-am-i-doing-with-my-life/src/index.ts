import type { StupidApiExport } from '@stupid-apis/shared';

const ANSWERS = [
  'Approximately what you set out to do, in a slightly worse way.',
  'Something a younger version of you would tolerate but not respect.',
  'A series of small reasonable decisions adding up to a question you cannot ask.',
  'A holding pattern. A patient one.',
  'Mostly the right thing. Mostly.',
  'The thing you said you would do. Just slower.',
  'A draft. A long one.',
  'A version of the plan, with three of the bullets removed.',
  'Living. With opinions.',
  'A thing you can describe in twelve words but explain in three.',
  'Trying. Not always well, but trying. That is allowed.',
  'Reading the same email twice. Then once more, for the variance.',
  'Not nothing. Not everything. Something in the middle, on a Tuesday.',
  'Building a life from materials you did not choose, in a hand you have learned.',
];

const SECOND_OPINIONS = [
  'a friend who has not seen you in a while would say: doing fine, considering',
  'your therapist (if you had one) would say: this is workable',
  'your mother would say: are you eating',
  'your future self would say: you got there',
  'a stranger watching you would say: not their concern',
];

const SMALL_RECOMMENDATIONS = [
  'one walk',
  'one phone call you have been avoiding',
  'one less tab',
  'one early bedtime, just to try it',
  'one boring afternoon, fully',
  'a glass of water',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  question: string;
  answer: string;
  confidence: '100%';
  second_opinion: string;
  small_recommendation: string;
  follow_up_required: boolean;
}

function ask(): Result {
  return {
    question: 'What am I doing with my life?',
    answer: pickOne(ANSWERS),
    confidence: '100%',
    second_opinion: pickOne(SECOND_OPINIONS),
    small_recommendation: pickOne(SMALL_RECOMMENDATIONS),
    follow_up_required: Math.random() < 0.5,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'ask',
    description:
      'Returns an existential answer to "what am I doing with my life", with confidence (always 100%), a second opinion, and a small recommendation.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'ask':
      return ask();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
