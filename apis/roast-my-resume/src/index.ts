import type { StupidApiExport } from '@stupid-apis/shared';

const FORMAT_NOTES = [
  'this bullet has more verbs than achievements',
  'the ratio of "leveraged" to specifics is concerning',
  'there is a number, but it is doing a lot of work alone',
  'this is two bullets pretending to be one',
  'this is one bullet pretending to be two',
  'the action does not match the result; the result is in a different key',
  'starts strong; ends apologetic',
];

const SPECIFIC_REWORDS = [
  'Try the version where you say what you did, in that order',
  'Replace at least one buzzword with a verb someone uses out loud',
  'Cut the adjective. Cut the second adjective. Now it is a sentence.',
  'Lead with the result. Bury the framework.',
  'Quantify or remove. Pick one.',
  'Strike "owned" if you did not, in fact, own anything',
];

const VERDICTS = [
  'workable',
  'workable, with shame',
  'salvageable',
  'salvageable on the second pass',
  'this is the second pass',
  'reroute around this bullet',
];

const APPLAUSE = [
  'the verbs are doing the bare minimum',
  'this would be fine in a smaller font',
  'a recruiter will read this on autopilot. it will land.',
  'has the structure of a real bullet, the energy of a placeholder',
  'a perfectly average sentence',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  bullet: string;
  formatting_observation: string;
  recommended_rewrite_strategy: string;
  verdict: string;
  reception_estimate: string;
  remaining_questions: string[];
}

const QUESTIONS = [
  'what was the team size',
  'what was the time horizon',
  'what was the metric, exactly',
  'what was the alternative you ruled out',
  'how did this end',
  'who was upset',
];

function pickN<T>(arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

function roast(bullet: string): Result {
  return {
    bullet,
    formatting_observation: pickOne(FORMAT_NOTES),
    recommended_rewrite_strategy: pickOne(SPECIFIC_REWORDS),
    verdict: pickOne(VERDICTS),
    reception_estimate: pickOne(APPLAUSE),
    remaining_questions: pickN(QUESTIONS, 2),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'roast',
    description:
      'Roasts one resume bullet. Returns a formatting observation, a rewrite strategy, a verdict, a reception estimate, and remaining questions.',
    inputSchema: {
      type: 'object',
      properties: {
        bullet: { type: 'string', description: 'A single resume bullet to be roasted.' },
      },
      required: ['bullet'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'roast': {
      const b = (args.bullet as string) || '';
      if (!b.trim()) throw new Error('Bullet required.');
      return roast(b);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
