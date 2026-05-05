import type { StupidApiExport } from '@stupid-apis/shared';

const ADVICE = [
  'If you are lost, just keep driving. Eventually the road becomes familiar.',
  'When in doubt, wear something black and walk faster.',
  'Always say yes to the first thing offered. Wait for the second.',
  'If a meeting could have been an email, schedule a follow-up meeting.',
  'When making a hard decision, flip a coin. If you are upset by the result, that is the answer. If you are pleased, that is also the answer. Either way, do not flip the coin.',
  'Tell the truth, but only on Wednesdays.',
  'If something feels wrong, do it again, but louder.',
  'Always sit facing the door. Always sit facing the other door, too.',
  'Apologize first. Then keep apologizing.',
  'Trust your gut, unless your gut is hungry.',
  'Never split a check. Never not-split a check.',
  'If you have to ask, the answer is no. If you do not have to ask, the answer is also no.',
  'Save for retirement, but only the embarrassing parts.',
  'When the door closes, the door is closed. There is no window. The metaphor was wrong.',
  'Do one thing every day that scares you. Then stop.',
  'If at first you do not succeed, redefine success.',
  'Always finish what you start. Unless you started it on a whim. Especially if you started it on a whim.',
  'Be yourself, but a slightly improved version, but only on weekends.',
];

const CONFIDENCE = ['absolute', 'high', 'professional', 'unimpeachable'];
const SOURCES = [
  'a man at a bar',
  'an old book my mother kept',
  'a fortune cookie I trusted too much',
  'my late uncle who was wrong about most things',
  'no one in particular',
  'the back of an unsigned greeting card',
];

const REGRETS = [
  'almost certainly',
  'eventually',
  'within six months',
  'no — but you will rationalize it',
  'only on a specific Tuesday',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  advice: string;
  confidence: string;
  source: string;
  will_you_regret_it: string;
  do_not_take: true;
}

function advise(): Result {
  return {
    advice: pickOne(ADVICE),
    confidence: pickOne(CONFIDENCE),
    source: pickOne(SOURCES),
    will_you_regret_it: pickOne(REGRETS),
    do_not_take: true,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'advise',
    description:
      'Returns one piece of confidently terrible life advice. Includes confidence level, attributed source, and a regret estimate.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'advise':
      return advise();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
