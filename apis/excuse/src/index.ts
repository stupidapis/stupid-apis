import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const SHOULD_HAVE: Record<string, string> = {
  late: 'should_have_just_left_earlier',
  missed_deadline: 'should_have_just_started_earlier',
  ghosted: 'should_have_just_responded',
};

async function generate(situation: string, audience: string, quality: string, timesUsed: number, env: PackEnv): Promise<unknown> {
  const isGhosted = situation === 'ghosted';

  const prompt = isGhosted
    ? `Someone ghosted their ${audience} and needs an excuse to come back.
The excuse MUST begin with: "Hey! So sorry, life has been absolutely insane lately. How are you?"
Excuse quality: ${quality}. ${quality === 'medical' ? 'Use a medical excuse. This is ethically questionable.' : ''}

Generate: excuse, what_actually_happened (blunt truth), recommended_delivery (how to deliver it), audience_suspicion_level (low/moderate/high/certain).
Return JSON: { "excuse": "...", "what_actually_happened": "...", "recommended_delivery": "...", "audience_suspicion_level": "..." }`
    : `Someone is ${situation} and needs an excuse for their ${audience}.
Excuse quality: ${quality}. ${quality === 'airtight' ? 'Make it bulletproof.' : quality === 'medical' ? 'Medical excuse. Ethically questionable.' : quality === 'implausible' ? 'Make it obviously fake but committed.' : 'Make it believable.'}

Generate: excuse (2-3 sentences), what_actually_happened (blunt truth), recommended_delivery (how to sell it), audience_suspicion_level (low/moderate/high/certain), followup_excuse_needed (bool), followup_excuse_needed_note (if true, what they'll ask next).
Return JSON: { "excuse": "...", "what_actually_happened": "...", "recommended_delivery": "...", "audience_suspicion_level": "...", "followup_excuse_needed": bool, "followup_excuse_needed_note": "..." }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku(
      'You generate excuses. Dry. Specific. No exclamation points in analysis. The excuse itself can have appropriate energy.',
      prompt, 200, env,
    );
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { excuse: 'Something came up. I am so sorry.', what_actually_happened: 'Nothing came up.', recommended_delivery: 'Text. Do not call.', audience_suspicion_level: 'high' };
  }

  let timesWarning: string | null = null;
  if (timesUsed >= 3) timesWarning = 'This excuse is retired. It has served you well. Let it go.';
  else if (timesUsed >= 1) timesWarning = 'Diminishing returns detected. Consider rotating.';

  const believability: Record<string, number> = { implausible: 15 + Math.floor(Math.random() * 15), plausible: 50 + Math.floor(Math.random() * 20), airtight: 80 + Math.floor(Math.random() * 15), medical: 70 + Math.floor(Math.random() * 20) };

  const result: Record<string, unknown> = {
    situation, audience, excuse: parsed.excuse, excuse_quality: quality,
    believability_score: `${believability[quality] ?? 50}/100`,
    times_used_before: timesUsed, times_used_warning: timesWarning,
    what_actually_happened: parsed.what_actually_happened,
    audience_suspicion_level: parsed.audience_suspicion_level,
    recommended_delivery: parsed.recommended_delivery,
    followup_excuse_needed: parsed.followup_excuse_needed ?? false,
    followup_excuse_needed_note: parsed.followup_excuse_needed_note ?? null,
    [SHOULD_HAVE[situation] ?? 'should_have_just_not']: true,
  };

  if (isGhosted) {
    result.days_since_contact = "unknown — you know how long it's been";
    result.insanity_of_life_verified = false;
    result.they_know = true;
    result.recommended_action = "Send it. Don't explain further. The explanation makes it worse.";
  }

  if (quality === 'medical') {
    result.warning = 'We generated this. We accept no responsibility for its use.';
    result.ethical_score = 'low';
  }

  return result;
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Generate an excuse for being late, missing a deadline, or ghosting someone.',
  inputSchema: {
    type: 'object',
    properties: {
      situation: { type: 'string', enum: ['late', 'missed_deadline', 'ghosted'] },
      audience: { type: 'string', enum: ['boss', 'friend', 'date', 'recruiter', 'professor', 'client'] },
      excuse_quality: { type: 'string', enum: ['implausible', 'plausible', 'airtight', 'medical'] },
      times_used_before: { type: 'number', description: 'How many times you have used this excuse before' },
    },
    required: ['situation'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(
        (args.situation as string) || 'late', (args.audience as string) || 'boss',
        (args.excuse_quality as string) || 'plausible', Number(args.times_used_before) || 0, env ?? {},
      );
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
