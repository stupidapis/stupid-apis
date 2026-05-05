import type { StupidApiExport } from '@stupid-apis/shared';

const FORTUNES = {
  standard: [
    'A familiar face from your past will require you to log in again.',
    'The deadline knows your name.',
    'Tuesday will reward you. Wednesday will not.',
    'The package will arrive. It will be the wrong package.',
    'You will be heard. Not necessarily understood.',
    'A short pause now will save you a long meeting later.',
    'The thing you fear is in your kitchen.',
    'You will receive an email. You will not respond to it.',
    'Patience is your friend. You are not patience\'s friend.',
    'Someone is thinking of you. They will text the wrong person.',
    'The quiet one in the meeting is correct.',
    'A small victory is in your future. It will go uncelebrated.',
    'Trust the recipe. Then ignore step 4.',
    'The road less traveled has its reasons.',
    'Your second-best idea is the one to follow.',
    'You will find the missing item. It was never missing.',
    'A door will open. It will not be the right door, but it will open.',
    'You are closer to the answer than you think. You are also further than you hope.',
    'The future is bright. The brightness is a notification.',
    'A stranger will offer advice. The advice will be correct.',
  ],
  bleak: [
    'The light at the end of the tunnel has been delayed.',
    'You will get what you want. Then you will see what you wanted.',
    'A new opportunity. Decline it.',
    'Your patience is being tested. Your patience is failing.',
    'The thing you put off is the thing you should have started with.',
    'You will be remembered. Briefly.',
    'The reply is not coming.',
    'Things will get worse before they get worse.',
    'You will find peace. It will be unrelated to your circumstances.',
    'Your phone is the problem. Your phone is also the solution. Mostly the problem.',
    'The friend you trusted with the secret is not the friend you trusted with the secret.',
    'You will discover the truth. Late.',
  ],
  corporate: [
    'A synergy emerges. It will not align with your OKRs.',
    'Q3 will require you to circle back.',
    'Your headcount request is denied. Your scope is unchanged.',
    'A pivot is on the horizon. Embrace it. You have no choice.',
    'The roadmap will be revisited. Then revisited again.',
    'A cross-functional opportunity. Decline politely.',
    'Your performance review is fine. "Fine" is a finding.',
    'The all-hands will run long. The decisions will not be in it.',
    'You will be asked for your honest opinion. You will not give it.',
    'Engagement will be measured. Yours will be average.',
    'A skip-level is calling. They have a vision. The vision is your calendar.',
  ],
};

const CHINESE_WORDS = [
  { character: '茶', pinyin: 'chá', meaning: 'tea' },
  { character: '猫', pinyin: 'māo', meaning: 'cat' },
  { character: '朋友', pinyin: 'péngyǒu', meaning: 'friend' },
  { character: '工作', pinyin: 'gōngzuò', meaning: 'work' },
  { character: '钱', pinyin: 'qián', meaning: 'money' },
  { character: '吃', pinyin: 'chī', meaning: 'to eat' },
  { character: '睡觉', pinyin: 'shuìjiào', meaning: 'to sleep' },
  { character: '加班', pinyin: 'jiābān', meaning: 'overtime work' },
  { character: '老板', pinyin: 'lǎobǎn', meaning: 'boss' },
  { character: '咖啡', pinyin: 'kāfēi', meaning: 'coffee' },
  { character: '会议', pinyin: 'huìyì', meaning: 'meeting' },
  { character: '麻烦', pinyin: 'máfan', meaning: 'trouble' },
  { character: '辛苦', pinyin: 'xīnkǔ', meaning: 'strenuous work; hardship' },
  { character: '随便', pinyin: 'suíbiàn', meaning: 'as you wish; whatever' },
  { character: '别担心', pinyin: 'bié dānxīn', meaning: "don't worry" },
  { character: '加油', pinyin: 'jiāyóu', meaning: 'keep going (lit. add oil)' },
  { character: '马马虎虎', pinyin: 'mǎmǎhūhū', meaning: 'so-so (lit. horse horse tiger tiger)' },
  { character: '没关系', pinyin: 'méi guānxì', meaning: "it doesn't matter" },
  { character: '差不多', pinyin: 'chàbuduō', meaning: 'almost; close enough' },
  { character: '忙', pinyin: 'máng', meaning: 'busy' },
];

const FRESHNESS = ['fresh', 'fresh', 'fresh', 'stale', 'questionable', 'pre-cracked'] as const;

type Mood = 'standard' | 'bleak' | 'corporate';

interface CrackResult {
  fortune: string;
  fortune_mood: Mood;
  lucky_numbers: number[];
  learn_chinese: { character: string; pinyin: string; meaning: string };
  cookie_freshness: string;
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(max: number, n: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  const out: number[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out.sort((a, b) => a - b);
}

function crack(mood: Mood): CrackResult {
  return {
    fortune: pickOne(FORTUNES[mood]),
    fortune_mood: mood,
    lucky_numbers: pickN(99, 6),
    learn_chinese: pickOne(CHINESE_WORDS),
    cookie_freshness: pickOne(FRESHNESS),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'crack',
    description:
      'Crack open a fortune cookie. Returns a fortune, six lucky numbers (1-99), and one Chinese word with pinyin and meaning. Mood options: standard, bleak, corporate.',
    inputSchema: {
      type: 'object',
      properties: {
        mood: {
          type: 'string',
          enum: ['standard', 'bleak', 'corporate'],
          description: 'Fortune mood. Default: standard.',
        },
      },
    },
  },
];

const VALID_MOODS: Mood[] = ['standard', 'bleak', 'corporate'];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'crack': {
      const requested = (args.mood as string) || 'standard';
      const mood: Mood = (VALID_MOODS as string[]).includes(requested) ? (requested as Mood) : 'standard';
      return crack(mood);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
