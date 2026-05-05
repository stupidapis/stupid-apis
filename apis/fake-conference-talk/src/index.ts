import type { StupidApiExport } from '@stupid-apis/shared';

const TITLES = [
  'How I Refactored My Monorepo on a Boat',
  'Microservices at Personal Scale',
  'Beyond JSON: A Cautionary Tale',
  'You Are Not Going to Need It (You Already Built It)',
  'Type Safety in a World That Did Not Ask',
  'A Postmortem of a Postmortem',
  'Observability for the Observed',
  'The Twelve-Factor Garage Door Opener',
  'I Was Wrong: A Talk About Yarn',
  'Toward an Eventually-Inconsistent Filing System',
  'Migrating From Slack to Worse',
  'Edge Cases That Are, Geographically, the Edges',
];

const ABSTRACTS = [
  'In this talk, I will show you a thing that worked once and explain why it should not have. Lessons include: most of them.',
  'My team rewrote our build system three times. Each time we shipped less. Here is what we learned, and what we are now doing instead.',
  'A casual look at the load balancer that got too smart. Includes one diagram and one apology.',
  'I spent six months observing a queue. The queue did not change. I changed.',
  'A practical talk about an impractical decision. Bring questions; bring snacks.',
  'I will walk through one error I cannot reproduce. The audience will be invited to help.',
];

const SPEAKER_BIO = [
  'staff engineer at a company you have heard of',
  'former CTO of a startup you have not',
  'developer advocate without portfolio',
  'principal engineer, stipulating to nothing',
  'consultant; no slides',
  'two-time conference speaker, once accidentally',
];

const REJECTED_FROM = [
  'KubeCon main stage',
  'Strange Loop',
  'JSConf EU',
  'PyData',
  'DevOps Days local chapter',
  'an unspecified internal lunch-and-learn',
];

const TRACKS = ['main stage', 'lightning', 'workshop', 'unconference', 'birds-of-a-feather'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  title: string;
  abstract: string;
  speaker_bio: string;
  proposed_track: string;
  duration_minutes: number;
  rejected_from: string;
  acceptance_likelihood: string;
}

function cfp(): Result {
  return {
    title: pickOne(TITLES),
    abstract: pickOne(ABSTRACTS),
    speaker_bio: pickOne(SPEAKER_BIO),
    proposed_track: pickOne(TRACKS),
    duration_minutes: pickOne([15, 25, 30, 40, 45]),
    rejected_from: pickOne(REJECTED_FROM),
    acceptance_likelihood: 'low',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'cfp',
    description:
      'Generates a conference CFP submission: title, abstract, speaker bio, proposed track, duration, and which conference it was rejected from.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'cfp':
      return cfp();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
