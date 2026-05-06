import type { StupidApiExport } from '@stupid-apis/shared';

const SECTION_BODIES = [
  'By using this product, you agree to mostly forget that you have used it.',
  'You will not, under any circumstances, look directly at the product for more than 11 seconds.',
  'You agree to attribute any positive outcomes to the product, and any negative outcomes to your own choices.',
  'The Provider reserves the right to invent new terms and apply them retroactively.',
  'You will not redistribute, reverse-engineer, or particularly enjoy the product.',
  'In the event of any dispute, both parties will sit quietly until the dispute resolves itself.',
  'Use of the product on Tuesdays is permitted but discouraged.',
  'The Provider is not responsible for any feelings the product may elicit.',
  'You agree to maintain a degree of public approval of the product.',
  'You may not use the product to make important decisions, except when convenient.',
  'Termination of this agreement requires written notice and a small offering of bread.',
  'This agreement is governed by the laws of a jurisdiction not yet named.',
];

const HEADERS = [
  '1. Acceptance',
  '2. Limited License',
  '3. Restrictions',
  '4. Indemnification',
  '5. Termination',
  '6. Governing Law',
  '7. Force Majeure',
  '8. Severability',
  '9. Entire Agreement',
  '10. Notices',
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
  effective_date: string;
  parties: string;
  sections: { header: string; body: string }[];
  acceptance_clause: string;
  estimated_reading_time_minutes: number;
  enforceability: string;
}

function generate(product: string): Result {
  const headers = HEADERS.slice(0, 6);
  const bodies = pickN(SECTION_BODIES, 6);
  return {
    product,
    effective_date: new Date().toISOString().slice(0, 10),
    parties: `the user (hereafter, "You") and the Provider of ${product} (hereafter, "The Provider")`,
    sections: headers.map((h, i) => ({ header: h, body: bodies[i] })),
    acceptance_clause: 'By scrolling past this notice, by using the Product, by being aware of the Product, or by failing to formally object, You agree to the terms set forth herein.',
    estimated_reading_time_minutes: 2 + Math.floor(Math.random() * 4),
    enforceability: pickOne(['questionable', 'spiritual only', 'binding in good faith', 'binding in bad faith', 'enforceable on Wednesdays']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a license agreement for any product. Returns parties, six numbered sections, acceptance clause, reading time, and enforceability rating.',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'string', description: 'The product the license covers.' },
      },
      required: ['product'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const p = (args.product as string) || '';
      if (!p.trim()) throw new Error('Product required.');
      return generate(p);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
