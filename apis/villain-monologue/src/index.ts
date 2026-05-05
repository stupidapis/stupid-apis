import type { StupidApiExport } from '@stupid-apis/shared';

type Style = 'campy' | 'gothic' | 'corporate-ceo' | 'whispered';

const MONOLOGUES: Record<Style, string[]> = {
  campy: [
    'You thought you could stop me. How quaint. How darling.',
    'Did you really believe a hero would arrive? In this economy?',
    'The trap is sprung. The cheese is metaphorical. The cheese is also you.',
    'I have prepared a speech. It is rhyming. Sit down.',
  ],
  gothic: [
    'The candle gutters. The wind has read the will. There will be no further candle.',
    'Long ago, in a house that no longer stands, you wronged me. You will not remember. I have remembered for both of us.',
    'You took the locket. You took the locket. You took the locket. (I am leaving this in.)',
  ],
  'corporate-ceo': [
    'Effective Q3, your role has been eliminated by the Plan. The Plan has been with us all along.',
    'I am pleased to announce that the synergies have been achieved. The cost is acceptable. The cost is you.',
    'We have right-sized the kingdom. The remaining citizenry is more aligned. The remaining citizenry is also fewer.',
  ],
  whispered: [
    'You did not see me come in. That is the first lesson. There will be others.',
    'I will not raise my voice. I will not need to.',
    'Listen carefully. I will say this once. The flowers know.',
  ],
};

const ENTRANCE = [
  'a door creaks open',
  'the lights dim by themselves',
  'a chair turns slowly',
  'thunder, but only inside',
  'a long pause in which someone clears a throat',
];

const EXIT = [
  'fade to black',
  'a long shadow recedes',
  'the door closes; nobody saw who closed it',
  'the credits roll over a held shot',
  'silence; the audience does not clap for some time',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  monologue: string;
  style: Style;
  entrance: string;
  exit: string;
  estimated_runtime_seconds: number;
  audience_warning: string;
}

const VALID: Style[] = ['campy', 'gothic', 'corporate-ceo', 'whispered'];

function deliver(style: Style): Result {
  const monologue = pickOne(MONOLOGUES[style]);
  return {
    monologue,
    style,
    entrance: pickOne(ENTRANCE),
    exit: pickOne(EXIT),
    estimated_runtime_seconds: 18 + Math.floor(Math.random() * 60),
    audience_warning: 'do not interrupt — there is more',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'deliver',
    description:
      'Returns a villain monologue. Style: campy, gothic, corporate-ceo, or whispered. Includes entrance, exit, runtime, and an audience warning.',
    inputSchema: {
      type: 'object',
      properties: {
        style: { type: 'string', enum: VALID, description: 'Monologue style. Default: campy.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'deliver': {
      const s = ((args.style as string) || 'campy').toLowerCase();
      if (!(VALID as string[]).includes(s)) throw new Error(`Unknown style. Use: ${VALID.join(', ')}`);
      return deliver(s as Style);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
