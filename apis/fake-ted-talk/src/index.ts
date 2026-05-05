import type { StupidApiExport } from '@stupid-apis/shared';

const TITLE_HOOKS = [
  'How My Houseplant Taught Me Leadership',
  'The Quiet Power of Showing Up Slightly Late',
  'Why I Stopped Going to Meetings (And You Can Too)',
  'The Three-Minute Decision Framework I Learned from a Toddler',
  'What My Grandmother\'s Filing Cabinet Knew About Product Strategy',
  'I Read the Same Book Forty Times. Here\'s What I Learned.',
  'The Counterintuitive Truth About Listening to Your Coworkers',
  'How Walking Backward Changed My Approach to Email',
  'The Secret of People Who Always Have a Pen',
  'Why I Replaced All My To-Do Lists with One Vague Feeling',
];

const BULLETS = [
  'I tried it for thirty days',
  'I almost gave up on day twelve',
  'My team thought I had lost it',
  'The numbers were not what I expected',
  'A small moment changed everything',
  'I learned to embrace what I could not control',
  'The data surprised even me',
  'My CFO eventually came around',
  'I now do this every morning',
  'It is not for everyone, but it was for me',
];

const APPLAUSE_LINES = [
  '"…and that is when I knew the houseplant had been right all along."',
  '"…sometimes the bravest thing you can do is reply on Tuesday."',
  '"…and the rest, as my mother would say, is mostly admin."',
  '"…the meeting that should not have happened became the meeting that I am still having, internally, today."',
  '"…I did not have the answer, but I had the will to be still."',
];

const AUDIENCE_REACTIONS = [
  'standing ovation, mostly the front row',
  'one person crying, three on phones',
  'polite, uneven',
  'thunderous; transcript later disputed',
  'split — the second half stood',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

interface Result {
  title: string;
  outline: string[];
  applause_line: string;
  audience_reaction: string;
  duration_minutes: number;
  views_estimate: string;
}

function generate(): Result {
  return {
    title: pickOne(TITLE_HOOKS),
    outline: pickN(BULLETS, 3),
    applause_line: pickOne(APPLAUSE_LINES),
    audience_reaction: pickOne(AUDIENCE_REACTIONS),
    duration_minutes: 9 + Math.floor(Math.random() * 12),
    views_estimate: `${(40 + Math.floor(Math.random() * 800)).toLocaleString()}K`,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a TED talk: title, three-bullet outline, applause line, and audience reaction. Returns one talk that should not exist but does.',
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
