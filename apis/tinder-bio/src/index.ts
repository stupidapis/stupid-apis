import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const UNIVERSAL_SECRETS = [
  'Has not read the last three books mentioned in previous bios',
  "The dog is an ex's dog technically",
  'Has a type. You are the type.',
  "Still checks their ex's Instagram. Not daily. Weekly.",
  "The 'adventurous' means one trip to Costa Rica in 2019",
  'Needs more reassurance than the bio suggests',
  "The 'no drama' is load bearing",
  'Deleted and redownloaded this app four times this year',
  'The candid photo was the 47th attempt',
  "Will google you before responding. Has already googled you.",
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

async function generate(args: Record<string, unknown>, env: PackEnv): Promise<unknown> {
  const age = args.age ? Number(args.age) : undefined;
  const profession = args.profession as string | undefined;
  const personality = args.personality ? String(args.personality).split(',').map((s) => s.trim()) : [];
  const situation = args.situation as string | undefined;
  const dealbreaker = args.dealbreaker as string | undefined;
  const lookingFor = args.looking_for as string | undefined;
  const energy = (args.energy as string) || 'low_effort';

  const prompt = `Write a dating app bio.
${age ? `Age: ${age}.` : ''} ${profession ? `Profession: ${profession}.` : ''} ${personality.length ? `Personality: ${personality.join(', ')}.` : ''}
${situation ? `Situation: ${situation}.` : ''} ${dealbreaker ? `Dealbreaker to embed awkwardly: ${dealbreaker}.` : ''}
${lookingFor ? `Looking for: ${lookingFor}.` : ''} Energy: ${energy}.
${energy === 'corporate' ? 'Bio should sound like a LinkedIn profile.' : ''}
${energy === 'unhinged_honesty' ? 'Say exactly what the person means. No filter.' : ''}
${energy === 'post_breakup' ? 'Written in a vulnerable state. Slightly too honest.' : ''}

Generate:
- bio: the actual dating bio text (3-5 lines)
- red_flags: array of 2-3 red flags embedded in the bio
- green_flags: array of 1-2 green flags
- cliches_detected: array of any dating cliches used
- looking_for_translation: what they're actually looking for (1 sentence)
- personality_actually_conveyed: what personality the bio actually reveals (1 sentence)
- suggested_opener_for_match: a good opening message for someone who reads this bio
- things_i_dont_want_you_to_know: 3 specific items inferred from the inputs
- contradiction_detected: bool, if personality traits conflict
- contradiction_note: if detected, what specifically contradicts

Return JSON: { "bio": "...", "red_flags": [...], "green_flags": [...], "cliches_detected": [...], "looking_for_translation": "...", "personality_actually_conveyed": "...", "suggested_opener_for_match": "...", "things_i_dont_want_you_to_know": [...], "contradiction_detected": bool, "contradiction_note": "..." }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write dating app bios and analyze them. Dry. Specific. No exclamation points in analysis.', prompt, 500, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = {
      bio: profession ? `${profession} by day. Questionable decisions by night.` : 'Here against my better judgment.',
      red_flags: ['The bio exists'], green_flags: ['Self-aware enough to use this API'],
      cliches_detected: [], looking_for_translation: 'Validation.',
      personality_actually_conveyed: 'Avoidant but trying.',
      suggested_opener_for_match: 'Your bio made me concerned. Coffee?',
      things_i_dont_want_you_to_know: pickN(UNIVERSAL_SECRETS, 3),
      contradiction_detected: false, contradiction_note: null,
    };
  }

  // Ensure exactly 3 secrets
  const secrets = Array.isArray(parsed.things_i_dont_want_you_to_know) && (parsed.things_i_dont_want_you_to_know as string[]).length === 3
    ? parsed.things_i_dont_want_you_to_know
    : pickN(UNIVERSAL_SECRETS, 3);

  const result: Record<string, unknown> = {
    bio: parsed.bio, energy,
    personality_traits_embedded: personality,
    contradiction_detected: parsed.contradiction_detected ?? false,
    contradiction_note: parsed.contradiction_note ?? null,
    situation: situation ?? null,
    situation_note: situation === 'doing_this_for_a_friend' ? 'This is never true.' : null,
    red_flags_embedded: Array.isArray(parsed.red_flags) ? (parsed.red_flags as unknown[]).length : 0,
    red_flags: parsed.red_flags,
    green_flags_embedded: Array.isArray(parsed.green_flags) ? (parsed.green_flags as unknown[]).length : 0,
    green_flags: parsed.green_flags,
    cliches_detected: parsed.cliches_detected,
    dealbreaker_revealed_awkwardly: !!dealbreaker,
    looking_for: lookingFor ?? null,
    looking_for_translation: parsed.looking_for_translation,
    personality_actually_conveyed: parsed.personality_actually_conveyed,
    swipe_right_probability: `${Math.floor(Math.random() * 40) + 30}/100`,
    things_i_dont_want_you_to_know: secrets,
    suggested_opener_for_match: parsed.suggested_opener_for_match,
  };

  if (situation === 'doing_this_for_a_friend') {
    result.note = 'This is never true.';
    result.generating_anyway = true;
  }
  if (energy === 'corporate') result.linkedin_overlap = '94%';
  if (energy === 'post_breakup') {
    result.warning = 'This bio was generated in a vulnerable state. Consider waiting.';
    result.generating_anyway = true;
  }
  if (lookingFor === 'lying_about_this') {
    result.claims_to_want = parsed.looking_for_translation ?? 'Something casual';
    result.signals_actually_wanting = 'The opposite of what they claimed';
    result.contradiction_score = `${Math.floor(Math.random() * 20) + 75}/100`;
  }

  return result;
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Generate a dating profile bio. Red flags embedded at no extra charge.',
  inputSchema: {
    type: 'object',
    properties: {
      age: { type: 'number' }, profession: { type: 'string' },
      personality: { type: 'string', description: 'Comma-separated: adventurous, homebody, foodie, gym_rat, intellectual, creative, outdoorsy, gamer, spiritual, workaholic, recently_divorced, dog_person, cat_person, doesnt_know_how_to_describe_self' },
      situation: { type: 'string', enum: ['new_to_app', 'returned_after_break', 'just_got_out_of_something', 'never_done_this_before', 'doing_this_for_a_friend'] },
      gender: { type: 'string' }, dealbreaker: { type: 'string' },
      looking_for: { type: 'string', enum: ['friendship', 'relationship', 'not_sure', 'lying_about_this'] },
      energy: { type: 'string', enum: ['low_effort', 'trying_too_hard', 'unhinged_honesty', 'corporate', 'post_breakup'] },
    },
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) { case 'generate': return generate(args, env ?? {}); default: throw new Error(`Unknown tool: ${name}`); }
}

export default { tools, callTool } satisfies StupidApiExport;
