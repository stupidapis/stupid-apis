import type { StupidApiExport } from '@stupid-apis/shared';

// The rock does not analyze, advise, or judge. The rock is, however, present.

const ROCK_RESPONSES = [
  '...',
  '*the rock remains*',
  '*a small grunt of acknowledgment*',
  '*the rock does not move*',
  '*the rock is here*',
  '*silence; supportive*',
  '*the rock has heard worse*',
  '*the rock is unmoved, as is its nature*',
  '*the rock will not interrupt you*',
  '*the rock is taking notes. metaphorically.*',
  '*the rock is dense in the helpful way*',
  '*the rock has been here longer than your problem*',
];

const ROCK_GRADES = ['igneous', 'sedimentary', 'metamorphic'] as const;
const WEIGHT_LIFTED = ['unchanged', 'slightly lower', 'somewhat lower', 'about the same'];
const ROCK_MOODS = ['still', 'present', 'patient', 'deeply still', 'undisturbed'];

type RockGrade = typeof ROCK_GRADES[number];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface SupportResult {
  problem: string;
  rock_says: string;
  rock_mood: string;
  rock_grade: RockGrade;
  weight_lifted: string;
  emotional_support_provided: true;
  rock_will_not_judge: true;
}

function support(problem: string): SupportResult {
  return {
    problem,
    rock_says: pickOne(ROCK_RESPONSES),
    rock_mood: pickOne(ROCK_MOODS),
    rock_grade: pickOne(ROCK_GRADES),
    weight_lifted: pickOne(WEIGHT_LIFTED),
    emotional_support_provided: true,
    rock_will_not_judge: true,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'support',
    description:
      'Tell the rock your problem. The rock does not analyze, advise, or judge. The rock is, however, present. Returns the rock\'s response and emotional metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        problem: { type: 'string', description: 'What is bothering you. The rock will hear it.' },
      },
      required: ['problem'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'support': {
      const problem = (args.problem as string) || '';
      if (!problem.trim()) throw new Error('The rock requires a problem to be present for.');
      return support(problem);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
