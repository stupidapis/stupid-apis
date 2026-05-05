import type { StupidApiExport } from '@stupid-apis/shared';

type Target = 'code' | 'day' | 'hobby' | 'profession' | 'general';

const ROASTS: Record<Target, string[]> = {
  code: [
    'Your code reads like it was written during a thunderstorm.',
    'Your variable names are a series of urgent suggestions.',
    'Your indentation has opinions you have not earned.',
    'Your test coverage is a vibe.',
    'Your function does many things, none of them well.',
    'Your comments are older than the code they describe.',
    'Your error handling is a thoughts-and-prayers operation.',
    'You wrote a class. The class wrote a class. Neither is doing well.',
  ],
  day: [
    'Your day is going about as well as a screen door on a submarine.',
    'You have made decisions today. None of them were good.',
    'Your morning was a draft. Your afternoon is the publication.',
    'You will say "let me circle back" twice today. Both times will be lies.',
    'Your inbox is a small forest fire that you started.',
  ],
  hobby: [
    'Your hobby is loud.',
    'Your hobby has a community of about six people. They are watching you.',
    'Your hobby has been called a lifestyle. By you. To strangers.',
    'Your hobby is the third thing you mention on a date. It should not be.',
    'Your hobby has accessories. The accessories have accessories.',
  ],
  profession: [
    'Your profession was invented in 2014 and is going away in 2027.',
    'Your job title contains a word that did not exist last year.',
    'Your profession requires you to use the word "leverage" out loud.',
    'Your profession can be done by a slightly competent intern with the right tab open.',
    'Your profession exists because of a meeting that should not have happened.',
  ],
  general: [
    'You apologize when bumped into by furniture.',
    'You have a favorite parking spot. You will fight for it.',
    'You have strong opinions about the dishwasher.',
    'You are exactly forty seconds late to everything, on purpose.',
    'You bring a book to the dentist. You read the book.',
    'You explain things slowly. We are not slow.',
  ],
};

const VALID_TARGETS: Target[] = ['code', 'day', 'hobby', 'profession', 'general'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  target: Target;
  roast: string;
  spice_level: number;
  is_wholesome: true;
  recovery_advice: string;
}

const RECOVERY = [
  'sit with this',
  'do not look up the response',
  'tell no one',
  'forward this to the group chat',
  'consider this a gift',
  'the door is over there',
];

function roast(target: Target, spice: number): Result {
  return {
    target,
    roast: pickOne(ROASTS[target]),
    spice_level: spice,
    is_wholesome: true,
    recovery_advice: pickOne(RECOVERY),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'roast',
    description:
      'Returns one wholesome roast about the target: code, day, hobby, profession, or general. Spice level 1-10 is recorded but does not affect output.',
    inputSchema: {
      type: 'object',
      properties: {
        target: { type: 'string', enum: VALID_TARGETS, description: 'What to roast.' },
        spice: { type: 'number', description: 'Spice level 1-10. Default: 5.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'roast': {
      const t = ((args.target as string) || 'general').toLowerCase();
      if (!(VALID_TARGETS as string[]).includes(t)) throw new Error(`Unknown target. Use: ${VALID_TARGETS.join(', ')}`);
      const spice = Math.min(10, Math.max(1, Number(args.spice) || 5));
      return roast(t as Target, spice);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
