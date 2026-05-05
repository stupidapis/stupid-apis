import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const BUZZWORDS: Record<string, string[]> = {
  tech: [
    'ai', 'machine learning', 'blockchain', 'cloud', 'saas', 'devops', 'agile',
    'scrum', 'sprint', 'microservices', 'kubernetes', 'containerize', 'serverless',
    'edge computing', 'iot', 'web3', 'metaverse', 'digital twin', 'low-code',
    'no-code', 'full-stack', 'tech debt', 'scalable', 'disruptive', 'paradigm shift',
    'ecosystem', 'platform', 'api-first', 'data-driven', 'real-time',
  ],
  finance: [
    'synergy', 'leverage', 'roi', 'ebitda', 'runway', 'burn rate', 'cap table',
    'liquidity event', 'arbitrage', 'hedge', 'portfolio', 'diversify', 'yield',
    'alpha', 'beta', 'derivative', 'securitize', 'amortize', 'due diligence',
    'fiduciary', 'accretive', 'dilutive', 'pro forma', 'fiscal cliff',
  ],
  consulting: [
    'synergy', 'leverage', 'circle back', 'loop in', 'take offline', 'deep dive',
    'low-hanging fruit', 'move the needle', 'boil the ocean', 'bandwidth',
    'deliverable', 'stakeholder', 'alignment', 'cadence', 'north star',
    'best practice', 'value-add', 'thought leader', 'paradigm', 'ideate',
    'operationalize', 'socialize', 'double-click', 'unpack', 'whitespace',
    'net-net', 'at the end of the day', 'going forward', 'table stakes',
  ],
  startup: [
    'disrupt', 'pivot', 'scale', 'product-market fit', 'mvp', 'growth hack',
    'unicorn', 'hockey stick', 'flywheel', 'moat', 'tam', 'sam', 'som',
    'series a', 'seed round', 'pre-seed', 'bootstrapped', 'ramen profitable',
    'iterate', 'ship it', '10x', 'first mover', 'blitzscale', 'network effects',
    'viral loop', 'churn', 'arr', 'mrr', 'cac', 'ltv', 'burn rate',
  ],
};

function getAllBuzzwords(): string[] {
  const all = new Set<string>();
  for (const list of Object.values(BUZZWORDS)) {
    for (const word of list) all.add(word);
  }
  return [...all];
}

function countBuzzwords(content: string, industry: string): { found: string[]; count: number } {
  const lower = content.toLowerCase();
  const dict = industry === 'all' ? getAllBuzzwords() : (BUZZWORDS[industry] ?? getAllBuzzwords());
  const found: string[] = [];

  for (const buzz of dict) {
    const regex = new RegExp(`\\b${buzz.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      for (let i = 0; i < matches.length; i++) found.push(buzz);
    }
  }

  return { found, count: found.length };
}

function getDiagnosis(score: number): string {
  if (score >= 80) return 'Terminal. The content has more buzzwords than meaning. Consider starting over in a different language.';
  if (score >= 60) return 'Concerning. You are fluent in saying nothing. Your colleagues suspect this.';
  if (score >= 40) return 'Moderate. You have been exposed to too many all-hands meetings.';
  if (score >= 20) return 'Mild. A few buzzwords slipped in. It happens. Forgive yourself.';
  return 'Clean. Disturbingly articulate. Are you sure you work in an office?';
}

interface AnalyzeResult {
  density_score: string;
  buzzwords_found: string[];
  worst_offender: string;
  sentence_count: number;
  buzzword_count: number;
  words_with_meaning: number;
  diagnosis: string;
  roast?: string;
}

async function analyze(
  content: string,
  industry: string,
  roast: boolean,
  env: PackEnv,
): Promise<AnalyzeResult> {
  // Phase 1: Deterministic
  const { found, count } = countBuzzwords(content, industry);
  const words = content.split(/\s+/).filter(Boolean).length;
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
  const score = Math.min(Math.round((count / Math.max(words, 1)) * 200), 100);
  const unique = [...new Set(found)];

  // Count occurrences to find worst offender
  const freq: Record<string, number> = {};
  for (const b of found) freq[b] = (freq[b] || 0) + 1;
  const worst = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'none detected';

  const meaningfulWords = Math.max(words - count, 0);
  const label = score >= 80 ? 'Terminal' : score >= 60 ? 'Concerning' : score >= 40 ? 'Moderate' : score >= 20 ? 'Mild' : 'Clean';

  const result: AnalyzeResult = {
    density_score: `${score}/100 — ${label}`,
    buzzwords_found: unique,
    worst_offender: worst,
    sentence_count: sentences,
    buzzword_count: count,
    words_with_meaning: meaningfulWords,
    diagnosis: getDiagnosis(score),
  };

  // Phase 2: Haiku roast (only if requested)
  if (roast) {
    result.roast = await callHaiku(
      'You roast corporate writing. Given text with buzzwords, deliver a 1-2 sentence devastating roast of the writing. Be specific about what you found.',
      `Text: "${content}"\nBuzzwords found: ${unique.join(', ')}\nDensity: ${score}/100`,
      100,
      env,
    );
  }

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'analyze',
    description: 'Analyze buzzword density in text. Counts industry-specific buzzwords, scores density, diagnoses severity. Optional roast mode.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Text to analyze' },
        industry: {
          type: 'string',
          description: 'Industry dictionary to use',
          enum: ['tech', 'finance', 'consulting', 'startup', 'all'],
        },
        roast: { type: 'boolean', description: 'Get a roast of your writing' },
      },
      required: ['content'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'analyze':
      return analyze(
        args.content as string,
        (args.industry as string) || 'all',
        args.roast === true || args.roast === 'true',
        env ?? {},
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
