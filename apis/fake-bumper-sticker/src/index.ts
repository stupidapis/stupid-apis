import type { StupidApiExport } from '@stupid-apis/shared';

const SLOGANS = [
  'I brake for things I should not',
  'My other car is also disappointing',
  'Honk if you have read the terms',
  'Ask me about my retirement plan (I do not have one)',
  'I would rather be lost',
  'Coexist (with reservations)',
  'My child is on the honor roll, but only the one in our living room',
  'I voted, eventually',
  'I am a vegetarian on weekends',
  'Slower traffic keep right; everyone keep right',
  'Live, Laugh, Lobby',
  'I love my dog and one other thing',
  'Caution: contains opinions',
  'Reading is fundamental, but only the parts I agree with',
];

const PLACEMENTS = ['centered, lower bumper', 'window decal, passenger side', 'driver side, slightly off-center', 'across the entire tailgate (regrettable)', 'rear windshield, lower right'];

const REGRETS = ['low', 'medium', 'high', 'will be removed within a year', 'permanent regret expected'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  slogan: string;
  recommended_placement: string;
  regret_estimate: string;
  font_recommendation: string;
  vehicle_recommendation: string;
}

function generate(): Result {
  return {
    slogan: pickOne(SLOGANS),
    recommended_placement: pickOne(PLACEMENTS),
    regret_estimate: pickOne(REGRETS),
    font_recommendation: pickOne(['all-caps Helvetica', 'Comic Sans (tasteful)', 'serif italic on white', 'condensed sans-serif, white on black', 'handwritten marker']),
    vehicle_recommendation: pickOne(['a Subaru', 'a minivan', 'a vintage Volvo wagon', 'an unwashed sedan', 'a pickup truck (older than the driver)', 'a hatchback with a rack']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Returns one bumper sticker with placement, font, regret estimate, and recommended vehicle.',
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
