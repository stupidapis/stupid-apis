import type { StupidApiExport } from '@stupid-apis/shared';

const REASONING_TEMPLATES = [
  'derived by setting the rate constant equal to the lap counter, then multiplying by the average humidity',
  'computed via the closed-form solution to the equivalent integer programming problem',
  'arrived at empirically. The experiment was approved by no review board.',
  'taken from a chart on the back of a 1986 placemat',
  'a known constant in the field',
  'inferred from the only available study, which has been retracted',
  'extrapolated from the value for a smaller, similar object',
  'agreed upon by the relevant authorities, none of whom we will name',
];

const ASSUMPTIONS = [
  'standard atmosphere',
  'a participant of average enthusiasm',
  'a controlled environment, lighting unspecified',
  'no interruptions',
  'a single thumb, dominant hand',
  'subject is fasting',
  'after lunch',
  'no music',
];

const VARIANCES = ['±2', '±15', '±67', '±200', '±a small herd'];

const PRINCIPLES = [
  'Tootsie\'s Law',
  'the Inverse Lick Theorem',
  'the Avogadro–Snickers correspondence',
  'Heisenberg\'s candy uncertainty',
  'the Mean Value Theorem of Effort',
  'the Fundamental Theorem of Doing',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  question: string;
  answer: number;
  variance: string;
  reasoning: string;
  assumptions: string[];
  principle_invoked: string;
  confidence: string;
}

function count(question: string): Result {
  const answer = 3 + Math.floor(Math.random() * 9997);
  return {
    question,
    answer,
    variance: pickOne(VARIANCES),
    reasoning: pickOne(REASONING_TEMPLATES),
    assumptions: [pickOne(ASSUMPTIONS), pickOne(ASSUMPTIONS)],
    principle_invoked: pickOne(PRINCIPLES),
    confidence: 'professional',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'count',
    description:
      'Answers any "how many X to Y" question with a confident integer, a margin, reasoning, assumptions, and an invoked principle. The math does not check out.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'A how-many question, e.g. "how many licks to the center of a tootsie pop"' },
      },
      required: ['question'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'count': {
      const q = (args.question as string) || '';
      if (!q.trim()) throw new Error('Question required.');
      return count(q);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
