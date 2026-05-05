import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const RATING_TRANSLATIONS: Record<string, string> = {
  rockstar: 'means nothing', solid: 'means mediocre', developing: 'means struggling',
  not_a_culture_fit: "means something HR won't allow us to say",
};

const PIP_PROB = ['elevated', 'high', 'when not if', 'scheduled'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

async function generate(name: string, role: string, rating: string, actual: string | undefined, managerWants: string | undefined, env: PackEnv): Promise<unknown> {
  const prompt = `Write a corporate performance review.
Employee: ${name}. Role: ${role}. Rating: ${rating} (${RATING_TRANSLATIONS[rating] ?? 'unclear'}).
${actual ? `What they actually did: ${actual}` : 'No specifics provided about actual performance.'}
${managerWants ? `What the manager wants to say but HR won't allow: "${managerWants}"` : ''}

The review must communicate nothing clearly. HR approved. Use corporate language that sounds positive but means nothing.

Generate:
- review: 2-3 paragraphs of HR-approved corporate review text
- what_manager_wanted_to_say: ${managerWants ? 'use the provided text' : 'infer what the manager probably wanted to say'}
- what_review_actually_says: 1 sentence honest summary of what the review communicates
- words_with_meaning: integer count of meaningful words
- words_without_meaning: integer count of filler/corporate words
- recommended_action: always involves an alignment conversation

Return JSON: { "review": "...", "what_manager_wanted_to_say": "...", "what_review_actually_says": "...", "words_with_meaning": N, "words_without_meaning": N, "recommended_action": "..." }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write performance reviews that communicate nothing. Dry. Corporate. No exclamation points.', prompt, 400, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { review: `${name} has shown consistent alignment with team objectives and continues to develop in key areas.`, what_manager_wanted_to_say: 'Do better.', what_review_actually_says: 'Nothing.', words_with_meaning: 3, words_without_meaning: 47, recommended_action: 'Schedule an alignment conversation.' };
  }

  return {
    employee: name, role, rating, rating_translation: RATING_TRANSLATIONS[rating] ?? 'unclear',
    review: parsed.review, what_manager_wanted_to_say: parsed.what_manager_wanted_to_say,
    what_review_actually_says: parsed.what_review_actually_says,
    words_with_meaning: parsed.words_with_meaning, words_without_meaning: parsed.words_without_meaning,
    [`will_${name.toLowerCase().replace(/\s+/g, '_')}_know_where_they_stand`]: false,
    [`will_${name.toLowerCase().replace(/\s+/g, '_')}_be_surprised_at_pip`]: true,
    hr_approved: true, recommended_action: parsed.recommended_action,
    followup_pip_probability: pick(PIP_PROB),
  };
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Generate a performance review that communicates nothing clearly. HR approved.',
  inputSchema: {
    type: 'object',
    properties: {
      employee_name: { type: 'string' }, role: { type: 'string' },
      rating: { type: 'string', enum: ['rockstar', 'solid', 'developing', 'not_a_culture_fit'] },
      actual_performance: { type: 'string' }, what_manager_wants_to_say: { type: 'string' },
    },
    required: ['employee_name'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.employee_name as string, (args.role as string) || 'Employee', (args.rating as string) || 'solid', args.actual_performance as string | undefined, args.what_manager_wants_to_say as string | undefined, env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
