import type { StupidApiExport } from '@stupid-apis/shared';

const STEPS = [
  'Lay out all parts on a flat surface. Count them. Count them again.',
  'Insert tab A into tab D. Tab D was discontinued in 2014; proceed.',
  'Hand-tighten the larger of the two screws. Do not specify which.',
  'Apply a small amount of glue. The glue is sold separately.',
  'If parts do not align, do not force them. Force them anyway.',
  'Allow 24 hours to cure. The instructions do not specify what is curing.',
  'Read step 7 before completing step 4.',
  'Steps 8 through 11 have been removed. Continue at step 12.',
  'Insert the longer rod into the hole that looks correct.',
  'You will need a Phillips screwdriver, an Allen key, and one specific friend.',
  'Tighten until you hear a sound. Stop one quarter-turn before that sound.',
  'Repeat step 3 in reverse. The reverse of step 3 is also step 3.',
  'Discard packaging. Do not discard the small bag of extra parts. They are not extra.',
  'The diagram on page 4 is correct. The diagram on page 4 has been removed.',
  'If the unit does not power on, the unit is not the problem.',
  'Wait for the LED to flash green twice. Then once. Then never again.',
];

const WARNINGS = [
  'Do not attempt this assembly during a thunderstorm.',
  'Children should not be present, but you may show them later.',
  'This product was not tested by anyone you would trust.',
  'Risk of mild surprise.',
  'Inhalation of packaging is unwise.',
  'For indoor use, except where otherwise believed.',
];

const TOOLS = [
  'a #2 Phillips screwdriver',
  'a 4mm Allen key',
  'a steady hand',
  'a small flashlight',
  'one specific friend (named in the documentation)',
  'an old credit card',
  'a willingness to compromise',
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
  product: string;
  estimated_assembly_time: string;
  required_tools: string[];
  steps: { number: number; instruction: string }[];
  warnings: string[];
  parts_count: number;
  page_count: number;
  language: string;
  customer_support: string;
}

function write(product: string): Result {
  const stepCount = 5 + Math.floor(Math.random() * 4);
  const stepText = pickN(STEPS, stepCount);
  return {
    product,
    estimated_assembly_time: `${20 + Math.floor(Math.random() * 220)} minutes (per the manufacturer; please double)`,
    required_tools: pickN(TOOLS, 3),
    steps: stepText.map((s, i) => ({ number: i + 1, instruction: s })),
    warnings: pickN(WARNINGS, 2),
    parts_count: 8 + Math.floor(Math.random() * 60),
    page_count: 1,
    language: 'English / Mostly English / Diagrams',
    customer_support: 'available between 9am and 9:14am, Tuesdays only',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'write',
    description:
      'Generates assembly instructions for any product. Steps contradict themselves. Tools include "one specific friend." Includes warnings, parts count, and customer support hours.',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'string', description: 'The product being assembled.' },
      },
      required: ['product'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'write': {
      const p = (args.product as string) || '';
      if (!p.trim()) throw new Error('Product required.');
      return write(p);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
