import type { StupidApiExport } from '@stupid-apis/shared';

const COMPLIMENTS = [
  'Your commit messages have main-character energy.',
  'You hold the door for people who you can tell are not going to thank you. That is the kind.',
  'Your voicemail greeting is exactly the right length.',
  'You have great posture in elevators.',
  'You laugh on time.',
  'You keep the screws.',
  'You remember the names of pets.',
  'You parallel park without commenting on it.',
  'You read the menu before ordering. We see this.',
  'Your handwriting on cards is legible.',
  'You arrive with the right amount of food.',
  'You answer the question that was asked.',
  'You make eye contact at the appropriate intensity.',
  'You take notes that you actually look at later.',
  'You return things to where you found them.',
  'You tip in cash.',
  'You decline politely. That is harder than it looks.',
  'You wait for people to finish their sentences.',
  'You set up the chairs without being asked.',
  'Your follow-up emails contain only what is needed.',
  'You notice when the candle has burned out.',
  'You apologize without overdoing it.',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SPECIFICITY = ['oddly specific', 'unusually warm', 'observed', 'low-grade affectionate'];

interface Result {
  compliment: string;
  specificity: string;
  is_sincere: true;
  recommended_response: string;
}

const RESPONSES = [
  'thank you, but do not look it up',
  'accept this and move on',
  'sit with this',
  'pass it forward, exactly once',
];

function generate(): Result {
  return {
    compliment: pickOne(COMPLIMENTS),
    specificity: pickOne(SPECIFICITY),
    is_sincere: true,
    recommended_response: pickOne(RESPONSES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Returns a wholesome, oddly specific compliment. The compliment is sincere. The specificity is intentional.',
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
