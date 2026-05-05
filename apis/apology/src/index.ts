import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

async function generate(offense: string, relationship: string, sincerity: string, medium: string, env: PackEnv): Promise<unknown> {
  const prompt = `Write a personal apology.
Offense: "${offense}". Relationship: ${relationship}. Sincerity: ${sincerity}. Medium: ${medium}.
${sincerity === 'desperate' ? 'The apology is too long, too specific, references things not mentioned, and ends with an unrelated confession.' : ''}
${sincerity === 'none' ? 'Do not actually apologize. Reframe.' : ''}
${sincerity === 'tactical' ? 'Apologize strategically. The goal is to end the conversation, not make amends.' : ''}
${relationship === 'ex' ? 'Generate it anyway. This is a bad idea and you know it.' : ''}
${relationship === 'self' ? 'This is a self-directed apology. Handle with concern and much judgment.' : ''}

Generate:
- apology: the full text, appropriate for ${medium}
- what_this_apologizes_for: 1 sentence
- what_this_does_not_apologize_for: 1 sentence
- sincerity_score: 0-100
- will_this_work: one of "probably" / "unlikely" / "depends on flowers" / "nothing will fix this"
- recommended_followup: 1 sentence
- relationship_damage: one of "minor" / "moderate" / "significant" / "considerable"
- relationship_damage_note: 1 sentence

Return JSON: { "apology": "...", "what_this_apologizes_for": "...", "what_this_does_not_apologize_for": "...", "sincerity_score": N, "will_this_work": "...", "recommended_followup": "...", "relationship_damage": "...", "relationship_damage_note": "..." }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write personal apologies at various sincerity levels. Dry analysis. No exclamation points in analysis fields.', prompt, 350, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { apology: `I'm sorry about ${offense}. I know that doesn't fix it.`, what_this_apologizes_for: 'The offense.', what_this_does_not_apologize_for: 'The underlying pattern.', sincerity_score: 45, will_this_work: 'unlikely', recommended_followup: 'Give it time.', relationship_damage: 'moderate', relationship_damage_note: 'This will come up again in three months.' };
  }

  const offenseSlug = offense.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
  const result: Record<string, unknown> = {
    offense, relationship, sincerity, medium,
    ...parsed, sincerity_score: `${parsed.sincerity_score ?? 45}/100`,
    [`should_have_just_not_${offenseSlug}`]: true,
  };

  if (relationship === 'ex') {
    result.warning = 'We will generate this. We should not generate this.';
    result.recommended_action = 'Close the tab.';
    result.generating_anyway = true;
  }

  if (relationship === 'self') {
    result.note = 'Apologizing to yourself is either very healthy or very concerning. We generated it anyway.';
    result.therapy_suggested = true;
  }

  return result;
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Personal apologies at every sincerity level. relationship=ex generates anyway. We warned you.',
  inputSchema: {
    type: 'object',
    properties: {
      offense: { type: 'string' },
      relationship: { type: 'string', enum: ['partner', 'friend', 'parent', 'coworker', 'boss', 'ex', 'vendor', 'mom', 'investor', 'self'] },
      sincerity: { type: 'string', enum: ['genuine', 'performative', 'tactical', 'none', 'desperate'] },
      medium: { type: 'string', enum: ['text', 'email', 'in_person', 'voicemail'] },
    },
    required: ['offense'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.offense as string, (args.relationship as string) || 'friend', (args.sincerity as string) || 'performative', (args.medium as string) || 'text', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
