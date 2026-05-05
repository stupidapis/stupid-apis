import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

async function generate(achievement: string, spin: string, includeLesson: boolean, env: PackEnv): Promise<unknown> {
  const spins = spin === 'all_three' ? ['grateful', 'vulnerable', 'inspirational'] : spin.split(',').map((s) => s.trim());

  try {
    const prompt = `Write a LinkedIn humble brag post about this achievement: "${achievement}"
Spin: ${spins.join(', ')}.
${includeLesson ? 'Include a universal lesson for strangers at the end.' : ''}
Must mention someone named Dave who was a mentor.
Must include a sad backstory that is completely unrelated to the achievement.
2-3 paragraphs. Line breaks between paragraphs.

Also generate:
- actual_achievement: one blunt sentence about what actually happened
- dave_role: Dave's specific mentor role (1 sentence)
- lesson_for_strangers: the universal lesson (1 sentence, if requested)
- personality_actually_conveyed: what personality the post actually reveals (1 sentence, brutal)

Return JSON: { "post": "...", "actual_achievement": "...", "dave_role": "...", "lesson_for_strangers": "...", "personality_actually_conveyed": "..." }`;

    const raw = await callHaiku(
      'You write LinkedIn posts. Grateful. Vulnerable. Inspirational. All simultaneously. No exclamation points in the analysis fields. The post itself can have LinkedIn energy.',
      prompt, 400, env,
    );
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());

    return {
      achievement,
      post: parsed.post,
      spin_detected: spins,
      actual_achievement: parsed.actual_achievement,
      dave_mentioned: true,
      dave_role: parsed.dave_role,
      sad_backstory_relevance: 'none',
      lesson_for_strangers: parsed.lesson_for_strangers ?? null,
      engagement_bait_score: '94/100',
      comments_this_will_generate: ['So deserved! 🙌', 'This. 💯', 'Congratulations! Coffee soon?'],
      humble_ratio: '3% humble, 97% brag',
      personality_actually_conveyed: parsed.personality_actually_conveyed,
    };
  } catch {
    return {
      achievement, post: `I wasn't going to post this, but Dave said I should. ${achievement}. I'm still processing.`,
      spin_detected: spins, actual_achievement: achievement, dave_mentioned: true,
      dave_role: 'Dave believed in me before I believed in myself.',
      sad_backstory_relevance: 'none', lesson_for_strangers: 'Never give up. Unless you should.',
      engagement_bait_score: '94/100',
      comments_this_will_generate: ['So deserved! 🙌', 'This. 💯', 'Congratulations! Coffee soon?'],
      humble_ratio: '3% humble, 97% brag',
    };
  }
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Transform any achievement into a LinkedIn post. Vulnerability included. Dave will be mentioned.',
  inputSchema: {
    type: 'object',
    properties: {
      achievement: { type: 'string', description: 'Your achievement' },
      spin: { type: 'string', enum: ['grateful', 'vulnerable', 'inspirational', 'all_three'] },
      include_lesson: { type: 'boolean', description: 'Add a universal lesson for strangers' },
    },
    required: ['achievement'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.achievement as string, (args.spin as string) || 'all_three', args.include_lesson !== false && args.include_lesson !== 'false', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
