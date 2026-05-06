import type { StupidApiExport } from '@stupid-apis/shared';

type Kind = 'job' | 'grant' | 'paper' | 'manuscript' | 'pitch' | 'application';

const OPENINGS = [
  'Thank you for your interest in {kind}.',
  'We appreciate the time you took to submit your {kind}.',
  'On behalf of the committee, we acknowledge receipt of your {kind}.',
  'Thank you for the considerable effort represented by your {kind}.',
];

const REASONS = [
  'we received an unprecedented number of qualified submissions this cycle',
  'this round was unusually competitive',
  'while your submission was reviewed favorably, the committee\'s priorities have shifted',
  'we are unable to accommodate every candidate of merit',
  'a different direction has emerged from our recent strategic discussions',
  'fit with our current portfolio is not as close as we had hoped',
  'the committee was unable to reach the consensus required',
];

const REGRETS = [
  'we regret to inform you',
  'we are unable to extend an offer',
  'we will not be moving forward at this time',
  'we cannot proceed further with your application',
  'we have made the difficult decision not to advance your candidacy',
];

const ENCOURAGEMENTS = [
  'We wish you continued success in your future endeavors.',
  'We encourage you to apply again in a future cycle.',
  'Many strong candidates have gone on to find excellent placements elsewhere.',
  'We have no doubt your work will find its right home.',
  'Please do not interpret this as a comment on the quality of your work.',
];

const CLOSINGS = ['Sincerely,', 'With appreciation,', 'Best regards,', 'Respectfully,', 'Thank you,'];

const SIGNATORIES = [
  'The Selection Committee',
  'The Editorial Board',
  'The Hiring Team',
  'The Review Panel',
  'The Office of the Director',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  greeting: string;
  body: string;
  closing: string;
  signed_by: string;
  vagueness_score: string;
  re_application_invited: boolean;
  next_cycle_date: string | null;
}

function write(kind: Kind, name: string): Result {
  const greeting = name ? `Dear ${name},` : `Dear Applicant,`;
  const opener = pickOne(OPENINGS).replace('{kind}', kind);
  const body = `${opener} After careful consideration, ${pickOne(REGRETS)}. Although ${pickOne(REASONS)}, we hope you will accept our regrets. ${pickOne(ENCOURAGEMENTS)}`;
  return {
    greeting,
    body,
    closing: pickOne(CLOSINGS),
    signed_by: pickOne(SIGNATORIES),
    vagueness_score: `${88 + Math.floor(Math.random() * 12)}/100`,
    re_application_invited: Math.random() < 0.6,
    next_cycle_date: Math.random() < 0.5 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * (180 + Math.floor(Math.random() * 200))).toISOString().slice(0, 10) : null,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'write',
    description:
      'Drafts a polite, vague rejection letter for any kind of submission. Returns greeting, body, closing, signatory, and a vagueness score.',
    inputSchema: {
      type: 'object',
      properties: {
        kind: { type: 'string', enum: ['job', 'grant', 'paper', 'manuscript', 'pitch', 'application'], description: 'What is being rejected.' },
        name: { type: 'string', description: 'Applicant name (optional).' },
      },
      required: ['kind'],
    },
  },
];

const VALID: Kind[] = ['job', 'grant', 'paper', 'manuscript', 'pitch', 'application'];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'write': {
      const k = ((args.kind as string) || 'application').toLowerCase();
      if (!(VALID as string[]).includes(k)) throw new Error(`Unknown kind. Use: ${VALID.join(', ')}`);
      return write(k as Kind, ((args.name as string) || '').trim());
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
