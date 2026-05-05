import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const GERALD_STATEMENTS = [
  'I would have preferred something lower. But fine.',
  'This seems high. I have reservations.',
  'Acceptable, though I would have gone with 3.',
  'I am not comfortable, but I will not block.',
  'The risk profile concerns me.',
];

const DIANE_DISSENTS = [
  'I dissent. The reasoning is sound but I have concerns.',
  'I dissent. Not because the number is wrong, but because the process was rushed.',
  'I dissent. I will submit a written minority opinion by end of day.',
  'I dissent. For the record.',
  'I dissent. The committee will regret this.',
  'I dissent. I have always dissented. I will continue to dissent.',
  'I dissent. My reasons are on file.',
  'I dissent. The number is fine. The principle is not.',
];

const ALGORITHM_STATEMENTS = [
  'Output: {n}. No further comment.',
  'Calculated. Returned. Done.',
  '{n} is the output. Confidence: 1.0.',
  'Processing complete. Result: {n}.',
];

const HEISENBERG_STATEMENTS = [
  'I had a different number before you looked at this.',
  'My number changed when you observed it. As expected.',
  'The number was {n} until measured. Now it is {n}. Or is it.',
  'I am uncertain about {n}, which is appropriate.',
];

const CONSENSUS_STATEMENTS = [
  'The committee has spoken. I have always believed this.',
  'I agree with the majority. I have always agreed with the majority.',
  '{n} was my first choice. It was always my first choice.',
  'The consensus is clear. I am the consensus.',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmt(template: string, n: number): string {
  return template.replace(/\{n\}/g, String(n));
}

async function convene(
  question: string | undefined,
  urgency: string,
  env: PackEnv,
): Promise<unknown> {
  const isEmergency = urgency === 'emergency';

  // Gerald: cautious, low numbers (higher if panicked)
  const geraldNum = isEmergency
    ? Math.floor(Math.random() * 5) + 6
    : Math.floor(Math.random() * 4) + 1;

  // Others generate independently
  const dianeNum = Math.floor(Math.random() * 10) + 1;
  const algoNum = Math.floor(Math.random() * 10) + 1;
  const heisenbergNum = Math.floor(Math.random() * 10) + 1;

  // Majority vote: find the mode, or median if no mode
  const votes = [geraldNum, dianeNum, algoNum, heisenbergNum];
  const freq: Record<number, number> = {};
  for (const v of votes) freq[v] = (freq[v] || 0) + 1;
  const sorted = votes.sort((a, b) => a - b);
  const finalNum = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]
    ? Number(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0])
    : sorted[Math.floor(sorted.length / 2)];

  // Consensus Engine always matches majority
  const consensusNum = finalNum;

  const committee = [
    {
      member: 'Gerald',
      number: geraldNum,
      vote: 'approved',
      statement: isEmergency ? 'I am panicking but I vote yes.' : pick(GERALD_STATEMENTS),
    },
    {
      member: 'Diane',
      number: dianeNum,
      vote: 'dissent',
      statement: pick(DIANE_DISSENTS),
    },
    {
      member: 'The Algorithm',
      number: algoNum,
      vote: 'approved',
      statement: fmt(pick(ALGORITHM_STATEMENTS), algoNum),
    },
    {
      member: 'Professor Heisenberg',
      number: heisenbergNum,
      vote: 'approved',
      statement: isEmergency
        ? `My number changed twice during this emergency. It was ${heisenbergNum + 2}, then ${heisenbergNum - 1}, now ${heisenbergNum}. I think.`
        : fmt(pick(HEISENBERG_STATEMENTS), heisenbergNum),
    },
    {
      member: 'Consensus Engine 3000',
      number: consensusNum,
      vote: 'approved',
      statement: fmt(pick(CONSENSUS_STATEMENTS), consensusNum),
    },
  ];

  const deliberationTime = isEmergency
    ? '0.0001 seconds'
    : urgency === 'urgent'
      ? '0.001 seconds — faster than your last standup'
      : '0.003 seconds — faster than your last standup';

  // Haiku for meeting minutes
  let minutes: string;
  try {
    const raw = await callHaiku(
      'You write meeting minutes. Formal. Bureaucratic. Faintly absurd. No exclamation points. Match this voice: "Thursday, you animal."',
      `A committee of 5 has reached decision ${finalNum} on the question: '${question || 'unspecified'}'. One member dissented (Diane. Always Diane.). Write meeting minutes in 2 sentences. Return JSON only: { "minutes": "..." }`,
      100,
      env,
    );
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned) as { minutes: string };
    minutes = parsed.minutes;
  } catch {
    minutes = `The committee convened and reached a decision of ${finalNum} by majority vote. Diane dissented. The minutes reflect this. The minutes always reflect this.`;
  }

  return {
    question: question || 'No question submitted. The committee decided anyway.',
    final_number: finalNum,
    vote_result: 'majority',
    deliberation_time: deliberationTime,
    committee,
    minutes,
    next_meeting: 'When necessary. Hopefully never.',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'convene',
    description: 'Convenes five random number generators. Each argues for their number. Democracy determines the result. One member always dissents.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'The question before the committee. Optional.' },
        urgency: { type: 'string', enum: ['routine', 'urgent', 'emergency'], description: 'Meeting urgency' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'convene':
      return convene(args.question as string | undefined, (args.urgency as string) || 'routine', env ?? {});
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
