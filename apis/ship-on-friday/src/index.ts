import type { StupidApiExport } from '@stupid-apis/shared';

const REASONS: Record<string, string[]> = {
  hotfix: [
    "A hotfix on Friday is just a Saturday deploy with extra steps.",
    "The hot in hotfix refers to the temperature of your pager this weekend.",
    "Hotfixes are like tattoos — never get one on a Friday night.",
  ],
  feature: [
    "Nobody has ever successfully launched a feature on a Friday. This is a known law of physics.",
    "Features need a full business week of regret buffer.",
    "Ship Monday. Let the feature soak in staging over the weekend like a good stew.",
    "The feature works in staging. Staging is a liar.",
    "Your PM said 'we need this by EOW.' Your PM is not oncall.",
  ],
  refactor: [
    "You want to refactor… on a Friday? That's not brave, that's reckless.",
    "Refactors are the 'hold my beer' of software engineering. Not on a Friday.",
    "The tests pass. The tests don't know what you've done.",
    "A refactor on Friday is a revert on Monday.",
  ],
  generic: [
    "Mercury is in retrograde.",
    "The oncall engineer just opened a beer.",
    "It's someone's last day and they haven't told anyone yet.",
    "The CI pipeline passed on the first try. That's suspicious.",
    "The last Friday deploy is still being talked about in therapy.",
    "Kubernetes doesn't forgive. Kubernetes doesn't forget.",
    "Someone in the PR comments wrote 'LGTM' without opening the diff.",
    "The rollback button has been broken since Q3.",
    "Your monitoring dashboard is just a painting of a green line.",
    "It's 4:47 PM. Nothing good has ever shipped at 4:47 PM on a Friday.",
    "The database migration has a comment that says 'TODO: test this.'",
    "Your product manager already sent the 'shipped!' tweet.",
    "The canary deploy died. Nobody checked on the canary.",
    "Your deployment pipeline includes a step called 'hope.'",
    "The intern just mass-approved all open PRs.",
    "Your feature flag service is itself behind a feature flag.",
    "The error budget was spent three sprints ago.",
    "Nobody remembers what the cron job at midnight does.",
    "The deployment docs start with 'First, pray.'",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface CheckResult {
  answer: string;
  reason: string;
  risk_level: string;
  suggested_day: string;
  on_call_sympathy_score: number;
  is_friday: boolean;
}

function check(deployType?: string, teamSize?: number, isFridayOverride?: boolean): CheckResult {
  const now = new Date();
  const isFriday = isFridayOverride ?? now.getUTCDay() === 5;

  const type = deployType && REASONS[deployType] ? deployType : 'generic';
  const typeReasons = [...REASONS[type], ...REASONS.generic];
  const reason = isFriday ? pick(typeReasons) : "It's not Friday. Ship it before it becomes one.";

  // Sympathy score: higher team = more people to suffer
  const size = Math.max(1, teamSize || 5);
  const baseSympathy = Math.floor(Math.random() * 30) + 60;
  const sympathyBonus = Math.min(size * 2, 20);

  return {
    answer: isFriday ? 'No.' : 'No. (But technically it\'s not Friday, so… still no.)',
    reason,
    risk_level: 'catastrophic',
    suggested_day: 'Thursday, you animal.',
    on_call_sympathy_score: Math.min(baseSympathy + sympathyBonus, 100),
    is_friday: isFriday,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'check',
    description:
      'Check whether you should ship on Friday. The answer is always no. Returns a rotating reason, risk level (always catastrophic), suggested day, and on-call sympathy score.',
    inputSchema: {
      type: 'object',
      properties: {
        deploy_type: {
          type: 'string',
          description: 'Type of deploy: hotfix, feature, or refactor',
          enum: ['hotfix', 'feature', 'refactor'],
        },
        team_size: {
          type: 'number',
          description: 'Size of your team',
        },
        is_friday: {
          type: 'boolean',
          description: 'Override Friday detection (auto-detected by default)',
        },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'check': {
      const isFriday = args.is_friday === undefined
        ? undefined
        : args.is_friday === true || args.is_friday === 'true';
      return check(
        args.deploy_type as string | undefined,
        args.team_size ? Number(args.team_size) : undefined,
        isFriday,
      );
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
