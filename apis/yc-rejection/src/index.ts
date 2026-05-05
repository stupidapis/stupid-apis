import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

async function generate(idea: string, founderCount: number, traction: string, pivotCount: number, talkedToUsers: boolean, isUberFor: boolean, env: PackEnv): Promise<unknown> {
  const prompt = `Write a YC rejection letter for this startup idea: "${idea}"
Founders: ${founderCount}. Traction: ${traction}. Pivots so far: ${pivotCount}. Talked to users: ${talkedToUsers}. Is it "Uber for X": ${isUberFor}.

Generate:
- letter: 2-3 paragraphs. Professional but devastating. Begins with "Thank you for applying to Y Combinator." Ends with hollow encouragement.
- what_they_actually_thought: 1-2 sentences, brutally honest internal reaction
- rejection_category: pick the most accurate from: market_size, traction, team, timing, founder_market_fit, competition, pivot_fatigue${isUberFor ? ', this_is_just_uber_for_something' : ''}
- pivot_assessment: ${pivotCount > 2 ? '1 sentence about the pivot count' : 'null'}
- recommended_action: 1 sentence, must involve talking to users

Return JSON: { "letter": "...", "what_they_actually_thought": "...", "rejection_category": "...", "pivot_assessment": ${pivotCount > 2 ? '"..."' : 'null'}, "recommended_action": "..." }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write YC rejection letters. Professional. Devastating. The encouragement is not sincere. No exclamation points.', prompt, 400, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { letter: `Thank you for applying to Y Combinator. After careful consideration, we will not be moving forward with "${idea}" at this time. We encourage you to keep building.`, what_they_actually_thought: "We've seen this before. It didn't work then either.", rejection_category: 'market_size', recommended_action: 'Talk to users. Any users. One user.' };
  }

  return {
    idea,
    decision: 'We will not be moving forward at this time.',
    letter: parsed.letter,
    what_they_actually_thought: parsed.what_they_actually_thought,
    rejection_category: isUberFor ? 'this_is_just_uber_for_something' : parsed.rejection_category,
    rejection_categories: { market_size: 'TAM is not $4 trillion', traction: 'none is a number', team: 'we have concerns', timing: '2019 called', founder_market_fit: 'do you use this yourself', competition: 'this already exists', pivot_fatigue: 'pivots_required before launch is a different conversation' },
    pivot_count: pivotCount,
    pivot_assessment: parsed.pivot_assessment ?? null,
    encouragement: 'We encourage you to keep building.',
    encouragement_sincerity: '0/100',
    apply_again: true, apply_again_note: 'We say this to everyone.',
    actual_feedback_probability: '0%',
    recommended_action: parsed.recommended_action,
    actual_tam: '$4 trillion',
  };
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Instant YC rejection for any startup idea. Encouragement included. Encouragement is not sincere.',
  inputSchema: {
    type: 'object',
    properties: {
      idea: { type: 'string' }, founder_count: { type: 'number' },
      traction: { type: 'string', enum: ['none', 'some', 'impressive', 'pre-traction'] },
      pivot_count: { type: 'number' }, have_you_talked_to_users: { type: 'boolean' },
      is_it_uber_for: { type: 'boolean' },
    },
    required: ['idea'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.idea as string, Number(args.founder_count) || 2, (args.traction as string) || 'none', Number(args.pivot_count) || 0, args.have_you_talked_to_users === true || args.have_you_talked_to_users === 'true', args.is_it_uber_for === true || args.is_it_uber_for === 'true', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
