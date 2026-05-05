import type { StupidApiExport } from '@stupid-apis/shared';

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;

type Sign = typeof SIGNS[number];

const CELESTIAL = [
  'Mercury enters retrograde in your fourth house',
  'Venus is currently uninvolved',
  'Saturn has expectations of you',
  'a transit through your sign suggests caution',
  'the moon is in a mood you have seen before',
  'Mars is in your DMs',
  'a minor planet you have not heard of is asserting itself',
  'Jupiter wants the best for you, conditionally',
  'the constellations are visible only to people who are not you',
];

const MUNDANE_WARNING = [
  'avoid open-plan offices on Tuesday',
  'do not respond to the second email',
  'a small kitchen incident is in your future',
  'someone will bring up your old haircut',
  'you will lose a sock to forces you cannot name',
  'a meeting will run long',
  'the wifi will betray you exactly once',
  'a grocery list will fail you',
  'you will misread a text message and act on it',
];

const COSMIC_ADVICE = [
  'be water',
  'be rock',
  'speak less; speak slower',
  'wear something forgivable',
  'eat a vegetable',
  'do the small task first',
  'forgive the printer',
  'go to bed',
];

const COLORS = ['burnt sienna', 'a confused green', 'navy', 'unsuspicious red', 'lavender', 'gray, but warm', 'bone'];
const UNLUCKY = ['a mug', 'plastic forks', 'one specific elevator', 'an old hat', 'the third drawer', 'group chats', 'lozenges', 'voicemails'];
const MOOD = [
  'hopeful in a way that will end',
  'flat',
  'mildly metaphysical',
  'stoic',
  'open to suggestion',
  'unreceptive to suggestion',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Reading {
  sign: Sign;
  reading: string;
  lucky_color: string;
  unlucky_object: string;
  emotional_forecast: string;
  cosmic_advice: string;
}

function read(sign: Sign): Reading {
  const reading = `${pickOne(CELESTIAL)}. This is significant for you specifically. ${pickOne(MUNDANE_WARNING)}.`;
  return {
    sign,
    reading,
    lucky_color: pickOne(COLORS),
    unlucky_object: pickOne(UNLUCKY),
    emotional_forecast: pickOne(MOOD),
    cosmic_advice: pickOne(COSMIC_ADVICE),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'read',
    description:
      'Returns a daily horoscope for any sign. Generic mysticism, mundane warnings, and cosmic advice. No accountability.',
    inputSchema: {
      type: 'object',
      properties: {
        sign: { type: 'string', enum: SIGNS, description: 'Your zodiac sign, lowercase.' },
      },
      required: ['sign'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'read': {
      const sign = ((args.sign as string) || '').toLowerCase();
      if (!(SIGNS as readonly string[]).includes(sign)) {
        throw new Error(`Unknown sign. Valid: ${SIGNS.join(', ')}`);
      }
      return read(sign as Sign);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
