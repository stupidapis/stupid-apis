import type { StupidApiExport } from '@stupid-apis/shared';

const QUESTIONS: [string, string][] = [
  ['always speak in rhyme', 'always answer in haiku'],
  ['have your inbox read aloud at your funeral', 'have your search history read aloud at your wedding'],
  ['know when you will die', 'know how you will die'],
  ['have one extra finger on each hand', 'have one fewer'],
  ['be unable to use sarcasm', 'be unable to detect sarcasm'],
  ['only speak in commits', 'only speak in stand-up updates'],
  ['always be slightly cold', 'always be slightly damp'],
  ['have a button that gives you $10 but slightly inconveniences a stranger', 'just not have the button'],
  ['be famous for the wrong reason', 'be infamous for the right reason'],
  ['have to read every Terms of Service in full', 'have to write them'],
  ['live one good year then forget it', 'live ten ok years and remember everything'],
  ['have a perfect memory only for embarrassments', 'have no memory of embarrassments and many enemies'],
  ['be invisible to one specific person', 'be visible to all of them, all the time'],
  ['win every argument and lose every friend', 'lose every argument and keep every friend'],
  ['have to narrate your own actions for one day', 'have everyone else narrate yours for a week'],
];

const VERDICT_PHRASES = [
  'is statistically worse',
  'has the lower long-term survival rate',
  'is the option chosen by people you do not respect',
  'is the answer most likely to come up in therapy',
  'has been quietly removed from the official list',
  'leads to bad outcomes within six months',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  option_a: string;
  option_b: string;
  worse: 'a' | 'b';
  why: string;
  most_people_pick: string;
}

function ask(): Result {
  const [a, b] = pickOne(QUESTIONS);
  const worse: 'a' | 'b' = Math.random() < 0.5 ? 'a' : 'b';
  return {
    option_a: a,
    option_b: b,
    worse,
    why: `option ${worse} ${pickOne(VERDICT_PHRASES)}`,
    most_people_pick: 'the second option, statistically. they should not.',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'ask',
    description:
      'Returns a "would you rather" question with two cursed options and a verdict on which is statistically worse.',
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
