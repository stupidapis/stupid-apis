import type { StupidApiExport } from '@stupid-apis/shared';

const STANDARD = {
  positive: [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes — definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
  ],
  noncommittal: [
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
  ],
  negative: [
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
  ],
};

const CYNICAL = {
  positive: [
    'Sure, why not. Nothing matters anyway.',
    'Yes, but you already knew that and just wanted validation.',
    'The universe says yes. The universe is frequently wrong.',
  ],
  noncommittal: [
    'The ball is cloudy, much like your judgment.',
    'Ask again when you can handle the truth.',
    'I could tell you, but you wouldn\'t listen.',
    'The answer exists, but it doesn\'t care about you.',
  ],
  negative: [
    'No. And deep down, you already knew.',
    'Absolutely not. Next question.',
    'The ball laughed. That\'s a no.',
    'Not a chance. The ball has seen your track record.',
    'No. The ball requests you stop asking.',
    'Lol. No.',
    'The odds are against you. As usual.',
  ],
};

const CORPORATE = {
  positive: [
    'Let\'s circle back — actually, yes. Green light per the latest alignment.',
    'Synergies confirmed. Moving forward.',
    'Per our last shake, the answer is affirmative. Let\'s take this offline.',
    'The ball has reviewed the OKRs and sees a path to yes.',
    'Approved pending stakeholder buy-in.',
  ],
  noncommittal: [
    'Let\'s table this and revisit in Q3.',
    'The ball needs to align with cross-functional partners before committing.',
    'Pending further discovery. Let\'s schedule a follow-up.',
    'The ball is taking this under advisement.',
    'We\'re in a holding pattern. The ball will loop back.',
  ],
  negative: [
    'The ball is deprioritizing this initiative at this time.',
    'Not in the current roadmap. Let\'s parking-lot it.',
    'The ball has concerns about the ROI here.',
    'We\'re going to have to right-size expectations on this one.',
    'The ball is sunsetting this ask.',
    'That\'s a strategic no. The ball is optimizing for focus.',
  ],
};

type ResponseSet = { positive: string[]; noncommittal: string[]; negative: string[] };

function pickAnswer(set: ResponseSet, cynical: boolean): { answer: string; sentiment: string } {
  // Cynical: weighted toward negative (5 pos, 4 non, 11 neg)
  // Standard: classic distribution (10 pos, 5 non, 5 neg)
  const pool = cynical
    ? [
        ...set.positive.map((a) => ({ answer: a, sentiment: 'positive' })),
        ...set.noncommittal.map((a) => ({ answer: a, sentiment: 'noncommittal' })),
        ...set.negative.map((a) => ({ answer: a, sentiment: 'negative' })),
        ...set.negative.map((a) => ({ answer: a, sentiment: 'negative' })),
      ]
    : [
        ...set.positive.map((a) => ({ answer: a, sentiment: 'positive' })),
        ...set.positive.map((a) => ({ answer: a, sentiment: 'positive' })),
        ...set.noncommittal.map((a) => ({ answer: a, sentiment: 'noncommittal' })),
        ...set.negative.map((a) => ({ answer: a, sentiment: 'negative' })),
      ];

  return pool[Math.floor(Math.random() * pool.length)];
}

interface AskResult {
  question: string;
  answer: string;
  confidence: string;
  shake_count: number;
}

function ask(question: string, cynical: boolean, corporate: boolean): AskResult {
  const set = corporate ? CORPORATE : cynical ? CYNICAL : STANDARD;
  const { answer } = pickAnswer(set, cynical);

  return {
    question,
    answer,
    confidence: 'certain',
    shake_count: Math.floor(Math.random() * 3) + 1,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'ask',
    description:
      'Ask the Magic 8-Ball a yes-or-no question. Supports cynical mode (weighted toward negative) and corporate mode (all answers in business speak).',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'Your yes-or-no question for the Magic 8-Ball',
        },
        cynical: {
          type: 'boolean',
          description: 'Weighted toward negative responses',
        },
        corporate: {
          type: 'boolean',
          description: 'All answers in business speak',
        },
      },
      required: ['question'],
    },
  },
];

async function callTool(
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case 'ask':
      return ask(
        args.question as string,
        args.cynical === true || args.cynical === 'true',
        args.corporate === true || args.corporate === 'true',
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
