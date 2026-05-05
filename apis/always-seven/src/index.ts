import type { StupidApiExport } from '@stupid-apis/shared';

const EXPLANATIONS = [
  'Seven is the most common number humans choose when asked for a random number between 1 and 10. We have removed the middleman.',
  'The universe prefers 7. We are not here to fight the universe.',
  'Seven deadly sins. Seven wonders. Seven days. Seven was inevitable.',
  'We generated 847,000 truly random numbers this year. The average was 7. We simplified.',
  'You knew it was going to be 7.',
  'Seven is prime. Seven is ancient. Seven is your number today.',
  'Our algorithm considered all options. It chose 7. The algorithm is not sorry.',
  'In 47 independent studies, humans asked to pick a number between 1 and 10 chose 7 most frequently. We are those humans.',
  "7 is the loneliest number that you'll ever do. Wait, that's 1. It's still 7.",
  'We could give you 4. Nobody wants 4.',
  'The number 7 has been extensively tested. It holds up.',
  'Mathematically, 7 is correct.',
  'Other numbers were considered. They were found wanting.',
  "7 was selected from 10 candidates through a rigorous elimination process. The process was: it's 7.",
  'Quantum fluctuations consistently collapse to 7 in this region of spacetime.',
  'We asked 100 developers to pick a random number. 73 said 7. We are those developers.',
  "The answer is 7. The question doesn't matter.",
  'Seven has never let anyone down. Can you say the same about 3?',
  "It's 7. It was always going to be 7. This is fine.",
  "We tried 8 once. We don't talk about that.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GenerateResult {
  number: number;
  requested_range: string;
  possibilities_considered: number;
  outcome: string;
  explanation: string;
  attempts: number;
  has_always_been_seven: boolean;
  force_note?: string;
}

function generate(force?: number): GenerateResult {
  const result: GenerateResult = {
    number: 7,
    requested_range: '1-10',
    possibilities_considered: 10,
    outcome: '7',
    explanation: pick(EXPLANATIONS),
    attempts: 1,
    has_always_been_seven: true,
  };

  if (force !== undefined) {
    if (force === 7) {
      result.force_note = 'You asked for 7. We respect the clarity.';
    } else {
      result.attempts = 3;
      result.force_note = `We tried ${force}. The universe returned 7. Three times. We stopped arguing.`;
    }
  }

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description: 'Returns a random number between 1 and 10. The number is 7. It is always 7.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Your question. It will not affect the number.' },
        force: { type: 'number', description: 'Attempt to force a different number (1-10). It will not work.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.force !== undefined ? Number(args.force) : undefined);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
