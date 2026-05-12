import type { StupidApiExport } from '@stupid-apis/shared';

const TITLES = [
  'On Recent Matters',
  'Concerning the Subject',
  'Daily Briefing',
  'Statement Regarding the Bulletin',
  'On the Question of the Question',
  'Communique on the Recent Communique',
  'Statement of the Statement',
  'The Daily Word',
  'Concerning Matters of No Concern',
  'On the Schedule',
  'Bulletin Regarding the Bulletin Process',
];

const BODY_SENTENCES = [
  'The Ministry confirms that recent matters have been resolved in the appropriate fashion.',
  'Productivity in the relevant sectors has exceeded all reasonable expectations.',
  'A meeting was held. The meeting was constructive.',
  'The Deputy Director conveys congratulations to those who deserve them.',
  'Foreign press inquiries will be addressed in the customary manner.',
  'Citizens are reminded to comply with the Schedule.',
  'Concerns raised by the Northern Region have been noted and addressed.',
  'Reports of irregularity in the Bureau of Statistics are without foundation.',
  'All scheduled events occurred as scheduled.',
  'The new ration has been increased to a level commensurate with the season.',
  'The Office continues to function as the Office.',
  'Achievements have been achieved. We are not at liberty to specify which.',
  'A delegation visited. The visit was successful.',
  'Numbers are higher this quarter than previously stated.',
  'A clarification will be issued in due course.',
  'The Ministry has received the message and will respond appropriately.',
  'Citizens have expressed their gratitude in the usual fashion.',
  'The bell is rung at the appointed hour.',
  'Provisions are sufficient.',
  'The matter has been settled to the satisfaction of those concerned.',
];

const SIGNATORIES = [
  'Deputy Director, Bureau of Daily Affairs',
  'Acting Minister, Ministry of Information',
  'First Assistant to the Second Secretary',
  'Director of External Communications',
  'Office of the General Spokesperson',
  'Bureau of the Final Word',
  'Department of Ordinary Matters',
  'Section Head, Routine Bulletins',
  'Subdirector of Public Confidence',
  'Acting Liaison to the Acting Liaison',
];

const CLASSIFICATIONS = [
  'Approved for circulation',
  'For internal review',
  'Not for foreign press',
  'Cleared by the Censor',
  'Official: routine',
  'Public, with appropriate restrictions',
  'To be filed but not read',
];

const DISTRIBUTIONS = [
  'all regional offices',
  'press attaches only',
  'by telegram, in triplicate',
  'post by morning post',
  'read aloud at the next meeting',
  'distributed at the gate',
  'kept on file; never to be referenced',
  'shared with allies of the customary sort',
];

const CONDEMNATIONS = [
  'the letter T (pending review)',
  'irregular timekeeping',
  'unauthorized opinion',
  'speculation regarding the schedule',
  'unsolicited commentary',
  'the use of italics',
  'one specific newspaper',
  'persons of insufficient confidence',
  'the previous Tuesday',
  'unverified gestures',
];

const ACHIEVEMENTS = [
  'a milestone reached in the customary corner',
  'targets exceeded by exactly the amount expected',
  'a new prize awarded (recipient: the Ministry)',
  'a delegation was received with full honors',
  'output increased to the figure agreed upon',
  'a new building opened (purpose: pending)',
  'a problem of long standing solved by the appropriate party',
  'a road completed for the second time',
  'a holiday added to the official calendar',
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
  bulletin_number: number;
  title: string;
  body: string;
  signatory: string;
  achievements: string[];
  condemned: string;
  classification: string;
  distribution: string;
  confidence: string;
  next_bulletin: string;
}

function issue(): Result {
  return {
    bulletin_number: 1000 + Math.floor(Math.random() * 9000),
    title: pickOne(TITLES),
    body: pickN(BODY_SENTENCES, 3).join(' '),
    signatory: pickOne(SIGNATORIES),
    achievements: pickN(ACHIEVEMENTS, 2),
    condemned: pickOne(CONDEMNATIONS),
    classification: pickOne(CLASSIFICATIONS),
    distribution: pickOne(DISTRIBUTIONS),
    confidence: 'final',
    next_bulletin: 'tomorrow, at the appointed hour',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'issue',
    description:
      'Issues a numbered bulletin from a generic Ministry of Information. Returns title, body of three sentences, signatory, two achievements, one condemnation, classification, and distribution. Achievements have been achieved.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'issue':
      return issue();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
