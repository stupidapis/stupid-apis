import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const SINCERITY_RULES: Record<string, { legal_exposure_reduced: boolean; what_this_admits: string }> = {
  genuine: { legal_exposure_reduced: false, what_this_admits: "everything, which is why legal didn't approve this" },
  performative: { legal_exposure_reduced: true, what_this_admits: 'the existence of the situation' },
  legal: { legal_exposure_reduced: true, what_this_admits: 'nothing. Legally, nothing.' },
  pr: { legal_exposure_reduced: true, what_this_admits: 'our commitment to doing better' },
  none: { legal_exposure_reduced: true, what_this_admits: 'nothing — reframes as growth opportunity' },
};

const FOLLOWUPS = ['high', 'elevated', 'when not if', 'already happening'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

async function generate(offense: string, company: string, audience: string, sincerity: string, medium: string, env: PackEnv): Promise<unknown> {
  const rules = SINCERITY_RULES[sincerity] ?? SINCERITY_RULES.performative;
  const isTweet = medium === 'tweet';

  const prompt = `Generate a corporate apology.
Company: "${company}". Offense: "${offense}". Audience: ${audience}. Sincerity: ${sincerity}. Medium: ${medium}.
${isTweet ? 'CRITICAL: Apology must be EXACTLY 280 characters or fewer. Must start with "We hear you." Must end with a hashtag. The hashtag must be wrong/tone-deaf.' : ''}
${sincerity === 'none' ? 'Do NOT actually apologize. Reframe the offense as a growth opportunity.' : ''}
${sincerity === 'legal' ? 'Admit nothing. Use passive voice. Reference ongoing processes.' : ''}
${sincerity === 'genuine' ? 'Actually apologize. Be specific. Legal will hate this.' : ''}

Generate:
- apology: the full apology text
- what_actually_happened: 1 blunt sentence about what really happened
- sincerity_score: number 0-100 (${sincerity === 'none' ? '0' : sincerity === 'genuine' ? '75-90' : sincerity === 'legal' ? '5-15' : '10-30'})
- recommended_response: 1 sentence, what the audience should say back
${audience === 'regulator' ? '- legal_disclaimers: array of 3 strings. Formal disclaimers. Third one disclaims the first two.' : ''}

Return JSON: { "apology": "...", "what_actually_happened": "...", "sincerity_score": N, "recommended_response": "..."${audience === 'regulator' ? ', "legal_disclaimers": [...]' : ''} }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write corporate apologies. Dry. No exclamation points in analysis.', prompt, 400, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { apology: `${company} acknowledges the situation regarding ${offense}. We are committed to doing better.`, what_actually_happened: offense, sincerity_score: 12, recommended_response: 'Do not accept this apology.' };
  }

  const result: Record<string, unknown> = {
    apology: parsed.apology, medium, audience, sincerity,
    what_actually_happened: parsed.what_actually_happened,
    what_this_admits: rules.what_this_admits,
    sincerity_score: `${parsed.sincerity_score ?? 12}/100${sincerity === 'none' ? ' — not a rounding error' : ''}`,
    legal_exposure_reduced: rules.legal_exposure_reduced,
    recommended_response: parsed.recommended_response,
    follow_up_incident_probability: pick(FOLLOWUPS),
  };

  if (audience === 'regulator' && parsed.legal_disclaimers) {
    result.legal_disclaimers = parsed.legal_disclaimers;
  }

  return result;
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Generate a corporate apology for any offense, at any sincerity level. Default sincerity: performative.',
  inputSchema: {
    type: 'object',
    properties: {
      offense: { type: 'string', description: 'What happened' },
      company: { type: 'string', description: 'Company name' },
      audience: { type: 'string', enum: ['public', 'employee', 'investor', 'regulator'] },
      sincerity: { type: 'string', enum: ['genuine', 'performative', 'legal', 'pr', 'none'] },
      medium: { type: 'string', enum: ['statement', 'email', 'tweet', 'press_release'] },
    },
    required: ['offense'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.offense as string, (args.company as string) || 'The Company', (args.audience as string) || 'public', (args.sincerity as string) || 'performative', (args.medium as string) || 'statement', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
