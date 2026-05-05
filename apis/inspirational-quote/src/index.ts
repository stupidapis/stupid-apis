import type { StupidApiExport } from '@stupid-apis/shared';

const QUOTES = [
  'Just ship it.',
  'The only way out is through.',
  'Done is better than perfect.',
  'A journey of a thousand miles begins with a deeply uncomfortable phone call.',
  'You miss 100% of the shots you take, eventually.',
  'Be the change you wish to see in the calendar.',
  'Hope is not a strategy. Neither is despair.',
  'A goal without a deadline is a dream. A dream without a goal is a nap.',
  'Strong opinions, loosely held, but said often.',
  'Do not let perfect be the enemy of shipped.',
  'When the going gets tough, the tough reschedule.',
  'Success is the ability to go from one disappointment to another with no loss of enthusiasm.',
  'You cannot pour from an empty calendar.',
  'The early bird gets a meeting at 7am.',
  'In the middle of difficulty lies a Slack channel.',
  'Trust the process. Document the process. Replace the process.',
];

const FAMOUS = [
  'Marie Curie',
  'Abraham Lincoln',
  'Oprah Winfrey',
  'Albert Einstein',
  'Maya Angelou',
  'Winston Churchill',
  'Eleanor Roosevelt',
  'Mark Twain',
  'Steve Jobs',
  'Confucius',
  'Aristotle',
  'Helen Keller',
  'Theodore Roosevelt',
  'Henry Ford',
  'Cher',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  quote: string;
  attributed_to: string;
  actually_said_by: string;
  year: number | null;
  source: string;
  authenticity_warning: string;
}

const ACTUAL_SOURCES = [
  'a Twitter account that is now suspended',
  'an unpublished memoir',
  'no one. ever.',
  'an out-of-context interview',
  'a misread caption',
  'a corporate Slack channel',
  'the sticker on a banana',
];

function generate(): Result {
  return {
    quote: pickOne(QUOTES),
    attributed_to: pickOne(FAMOUS),
    actually_said_by: pickOne(ACTUAL_SOURCES),
    year: 1700 + Math.floor(Math.random() * 320),
    source: 'unverifiable',
    authenticity_warning: 'this attribution is incorrect',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Returns a motivational quote attributed to a famous person who almost certainly did not say it. Includes the actual (also fake) source.',
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
