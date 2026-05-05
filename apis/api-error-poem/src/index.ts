import type { StupidApiExport } from '@stupid-apis/shared';

interface Poem {
  name: string;
  haiku: string[];
}

const POEMS: Record<number, Poem> = {
  200: { name: 'OK', haiku: ['Everything works fine', 'A small green dot has appeared', 'Brief, unfamiliar'] },
  201: { name: 'Created', haiku: ['A new thing exists', 'It did not exist before', 'Now it has a row'] },
  204: { name: 'No Content', haiku: ['Nothing came back here', 'But the request was successful', 'Trust the empty page'] },
  301: { name: 'Moved Permanently', haiku: ['The page is elsewhere', 'It will not return again', 'Update your bookmark'] },
  302: { name: 'Found', haiku: ['The page is over there', 'Or it was a moment ago', 'Try the new address'] },
  304: { name: 'Not Modified', haiku: ['Nothing has changed here', 'Use what you already have', 'You wasted the trip'] },
  400: { name: 'Bad Request', haiku: ['You sent us garbage', 'We cannot guess what you meant', 'Try saying it right'] },
  401: { name: 'Unauthorized', haiku: ['Who do you think you are', 'You will need to log in first', 'And then ask again'] },
  403: { name: 'Forbidden', haiku: ['You do not have rights', 'And you will not get them now', 'Talk to your manager'] },
  404: { name: 'Not Found', haiku: ['The page is not here', 'It was never here at all', 'You imagined it'] },
  408: { name: 'Request Timeout', haiku: ['You took far too long', 'The server has moved on with', 'Its life. So should you.'] },
  409: { name: 'Conflict', haiku: ['Two truths cannot be', 'And yet here we are anyway', 'Resolve and resubmit'] },
  410: { name: 'Gone', haiku: ['It was here before', 'But the resource has retired', 'No forwarding note'] },
  418: { name: 'I\'m a teapot', haiku: ['I am a teapot', 'I cannot brew the coffee', 'You should have brought tea'] },
  422: { name: 'Unprocessable', haiku: ['The shape is correct', 'But the meaning will not work', 'The data is wrong'] },
  429: { name: 'Too Many Requests', haiku: ['You are calling too much', 'The server has begun to', 'Resent your tone here'] },
  500: { name: 'Internal Server Error', haiku: ['Something has gone wrong', 'We do not know what it was', 'Neither do the logs'] },
  502: { name: 'Bad Gateway', haiku: ['The middleman lied', 'Or the upstream did not speak', 'Either way: not us'] },
  503: { name: 'Service Unavailable', haiku: ['The service is down', 'It will return some Tuesday', 'Probably this one'] },
  504: { name: 'Gateway Timeout', haiku: ['The gateway waited', 'Nothing arrived from upstream', 'Both have given up'] },
  511: { name: 'Network Auth Required', haiku: ['Sign in to the wifi', 'A captive portal awaits', 'Nothing is private'] },
};

const FALLBACK_TEMPLATES = [
  ['An unusual code', 'Has reached you on this fine day', 'It means what it means'],
  ['The number is rare', 'Few have encountered this code', 'Wear it like a badge'],
  ['This code is real, yes', 'It exists in the standard', 'It is not common'],
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  status_code: number;
  status_name: string;
  haiku: string[];
  syllable_count: number[];
  meter_warning: string | null;
}

function poem(code: number): Result {
  const known = POEMS[code];
  const lines = known ? known.haiku : pickOne(FALLBACK_TEMPLATES);
  const name = known ? known.name : `Status ${code}`;
  return {
    status_code: code,
    status_name: name,
    haiku: lines,
    syllable_count: [5, 7, 5],
    meter_warning: known ? null : 'fallback poem; meter approximate',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'poem',
    description:
      'Returns a haiku for any HTTP status code. Twenty-one codes have hand-tuned poems. Others get a fallback.',
    inputSchema: {
      type: 'object',
      properties: {
        status_code: { type: 'number', description: 'HTTP status code, e.g. 404' },
      },
      required: ['status_code'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'poem': {
      const code = Number(args.status_code);
      if (!Number.isFinite(code) || code < 100 || code > 599) throw new Error('Provide a valid HTTP status code (100-599).');
      return poem(Math.floor(code));
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
