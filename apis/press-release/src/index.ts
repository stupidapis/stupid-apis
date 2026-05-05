import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

async function generate(announcement: string, company: string, tone: string, location: string, env: PackEnv): Promise<unknown> {
  const prompt = `Write a press release for: "${announcement}" by "${company}".
Location dateline: ${location}. Tone: ${tone}.
${tone === 'pivoting' ? 'Frame this minor thing as a complete strategic reinvention. Include: "We are not the same company we were [timeframe] ago."' : ''}

The press release must include ALL of these sections:
1. ALL CAPS headline
2. Subheadline
3. Dateline (${location} — date)
4. 2-3 body paragraphs
5. Executive quote (from "a spokesperson")
6. About section: "${company} is a company. It does things."
7. Press contact: "media@${company.toLowerCase().replace(/\s+/g, '')}.com — Nobody will call this number."

Also generate:
- original_thing: what existed before this announcement (1 sentence)
- new_thing: what's actually new (1 sentence)
- new_thing_note: how minor the actual difference is (1 sentence)

Return JSON: { "press_release": "...", "original_thing": "...", "new_thing": "...", "new_thing_note": "..." }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write press releases. They are always more important than the thing they announce. No exclamation points.', prompt, 500, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { press_release: `FOR IMMEDIATE RELEASE\n\n${company.toUpperCase()} ANNOUNCES ${announcement.toUpperCase()}\n\n${location} — ${company} today announced ${announcement}. A spokesperson said nothing of value.`, original_thing: 'Something that worked fine.', new_thing: 'A slightly different version.', new_thing_note: 'The difference is cosmetic.' };
  }

  return {
    announcement, company,
    press_release: parsed.press_release, tone,
    actual_news_value: 'none',
    quote_said_by: 'a spokesperson', quote_means: 'nothing',
    workshops_this_required: Math.floor(Math.random() * 5) + 2,
    months_in_planning: Math.floor(Math.random() * 6) + 3,
    stakeholders_aligned: Math.floor(Math.random() * 29) + 12,
    decisions_made_by_committee: true,
    original_thing: parsed.original_thing, new_thing: parsed.new_thing,
    new_thing_note: parsed.new_thing_note,
    press_pickup_probability: '0%',
    about_section: `${company} is a company. It does things.`,
    contact_note: 'Nobody will call this number.',
  };
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Transform any announcement into a press release of considerable importance. No announcement too small. No claim too large.',
  inputSchema: {
    type: 'object',
    properties: {
      announcement: { type: 'string' }, company: { type: 'string' },
      tone: { type: 'string', enum: ['visionary', 'disrupting', 'humbled', 'transparent', 'pivoting'] },
      location: { type: 'string' },
    },
    required: ['announcement'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.announcement as string, (args.company as string) || 'The Company', (args.tone as string) || 'visionary', (args.location as string) || 'SAN FRANCISCO, CA', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
