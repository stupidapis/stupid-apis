import type { StupidApiExport } from '@stupid-apis/shared';

type Style = 'cowardly' | 'dramatic' | 'corporate-pr' | 'haiku' | 'honest';

const TEXTS: Record<Style, string[]> = {
  cowardly: [
    'hey so. things are crazy right now and i think we should take a break, just for a bit. i\'ll text you',
    'i think we want different things. i\'m not sure what i want. but i don\'t want this. sorry',
    'this is hard to write. i\'ve been thinking and i think we\'re better as friends. let me know when you want your stuff',
    'i\'m really sorry but i\'m not in a place to be in a relationship right now. it\'s not you. it might be me',
  ],
  dramatic: [
    'I have spent the last seventeen days walking past your apartment. I will not do it for an eighteenth. We are over.',
    'There is a version of me that could keep doing this. I have decided not to be that version.',
    'I lit a candle. The candle has gone out. I am leaving you with the candle.',
    'You once told me a thing I cannot now remember. That, somehow, is the reason.',
  ],
  'corporate-pr': [
    'After a thoughtful review of our partnership, we have made the difficult decision to discontinue this relationship effective immediately. We thank you for your contributions and wish you continued success in your future endeavors.',
    'Following careful consideration of strategic alignment, we are sunsetting this engagement. Our paths will diverge as of today. We remain grateful for the time invested.',
    'We have completed our annual relationship review and have determined that we are unable to continue. This decision is final and not negotiable. Best regards.',
  ],
  haiku: [
    'The leaves know to fall.\nWe were a kind of weather.\nIt is no longer.',
    'I packed your sweater.\nIt is by the front door now.\nI hope it stays warm.',
    'You said you needed\nspace. I have given you that.\nI am taking some.',
    'A long road behind.\nA shorter road just ahead.\nNot one we will share.',
  ],
  honest: [
    'I don\'t want to do this anymore. I should have said it sooner.',
    'We are not making each other better. I think we both know it.',
    'I\'m sorry. This isn\'t working. I have to stop trying to make it work.',
    'I love you. I am leaving anyway.',
  ],
};

const VALID: Style[] = ['cowardly', 'dramatic', 'corporate-pr', 'haiku', 'honest'];

const SEND_NOTES: Record<Style, string> = {
  cowardly: 'do not send. then send anyway.',
  dramatic: 'send at exactly 11:47 pm',
  'corporate-pr': 'attach a forwardable PDF version',
  haiku: 'do not explain the haiku',
  honest: 'send. then put the phone down.',
};

const RESPONSE_FORECASTS = [
  'they will reply within four minutes',
  'they will reply tomorrow morning',
  'they will not reply',
  'they will call. do not answer.',
  'they will reply with one word. it will be the word.',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  style: Style;
  text: string;
  send_note: string;
  response_forecast: string;
  estimated_message_count_after: number;
  do_you_have_to_send_this: 'yes' | 'no';
}

function draft(style: Style): Result {
  return {
    style,
    text: pickOne(TEXTS[style]),
    send_note: SEND_NOTES[style],
    response_forecast: pickOne(RESPONSE_FORECASTS),
    estimated_message_count_after: 0 + Math.floor(Math.random() * 22),
    do_you_have_to_send_this: Math.random() < 0.6 ? 'yes' : 'no',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'draft',
    description:
      'Drafts a breakup text in one of five styles: cowardly, dramatic, corporate-pr, haiku, or honest. Includes a send note and a response forecast.',
    inputSchema: {
      type: 'object',
      properties: {
        style: { type: 'string', enum: VALID, description: 'Default: honest.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'draft': {
      const s = ((args.style as string) || 'honest').toLowerCase();
      if (!(VALID as string[]).includes(s)) throw new Error(`Unknown style. Use: ${VALID.join(', ')}`);
      return draft(s as Style);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
