import type { StupidApiExport } from '@stupid-apis/shared';

const TITLES = [
  'Director of Strategic Vibes',
  'Senior Manager, Adjacent Initiatives',
  'Head of Eventualities',
  'Principal Coordinator, Outcomes',
  'Lead, Cross-Functional Optics',
  'VP of Quiet Wins',
  'Staff Generalist',
  'Director, Reasonable Decisions',
  'Senior Operator, Mostly Email',
  'Principal Architect, Vibes Layer',
];

const BULLETS = [
  'Own outcomes from a respectful distance',
  'Partner with stakeholders, broadly defined',
  'Drive alignment on questions that may not require alignment',
  'Hold the room when the room is uncertain',
  'Translate ambiguous goals into other ambiguous goals',
  'Maintain the calendar, in spirit',
  'Take meetings with discretion',
  'Author docs that nobody reads but everyone references',
  'Steward initiatives across teams that do not exist',
  'Be the named person for a thing that has no name',
];

const REQUIREMENTS = [
  '7+ years of broad experience',
  '4+ years of deep experience',
  'Bachelor\'s degree or equivalent willingness',
  'Strong written communication; spoken communication acceptable',
  'Familiarity with at least three frameworks, none deeply',
  'Comfort presenting to senior leadership and the cleaning staff',
  'Demonstrated ability to wait',
  'Track record of being hired before',
];

const PERKS = [
  'Unlimited PTO (capped at 14 days, in practice)',
  'Health, dental, vision (vision after 90 days)',
  '401(k) with match up to 1.4%',
  'Hybrid work; in-office Tuesday/Wednesday/Thursday',
  'Free coffee (regular only)',
  'Dog-friendly office (one dog, named)',
  'Annual stipend for "professional development"',
  'Monthly all-hands followed by no follow-up',
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
  team: string;
  reports_to: string;
  location: string;
  salary_band: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  posting_age_days: number;
  applicant_count: string;
}

function listing(): Result {
  return {
    title: pickOne(TITLES),
    team: pickOne(['Strategy', 'Operations', 'Platform', 'GTM', 'Product', 'Special Projects']),
    reports_to: pickOne(['the SVP of Strategy', 'the COO, dotted line to Engineering', 'the Office of the CEO', 'a director who has not yet been hired']),
    location: pickOne(['Remote (US)', 'New York, NY (hybrid)', 'San Francisco, CA (hybrid)', 'Austin, TX (in-person preferred)', 'Anywhere within 4 time zones']),
    salary_band: `$${100 + Math.floor(Math.random() * 200)}K – $${200 + Math.floor(Math.random() * 200)}K, depending`,
    responsibilities: pickN(BULLETS, 5),
    requirements: pickN(REQUIREMENTS, 4),
    perks: pickN(PERKS, 4),
    posting_age_days: 30 + Math.floor(Math.random() * 280),
    applicant_count: pickOne(['200+ applicants', 'over 200 applicants', '500+ applicants', '8 applicants', 'a high volume of applicants']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'listing',
    description:
      'Generates a corporate job listing. Returns title, team, reports-to, location, salary band, responsibilities, requirements, perks, posting age, and applicant count.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'listing':
      return listing();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
