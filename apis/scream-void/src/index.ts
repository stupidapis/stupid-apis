import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

async function scream(
  text: string,
  intensity: string,
  env: PackEnv,
): Promise<unknown> {
  const number = Math.floor(Math.random() * 100) + 1;
  const echo = text.slice(0, 3) + '...' + text.slice(0, 3) + '...' + text.slice(0, 3) + '...';

  const isCorporate = intensity === 'corporate';

  let voidResponse: string;
  let emotionalContent: string;
  let recommendation: string;

  if (isCorporate) {
    emotionalContent = 'per my email';
    const parsed = await callHaikuJson(
      `Someone screamed '${text}' into the void. Intensity: corporate.
Generate two fields:
1. void_response: 1-2 sentences. The void's reaction. Must include "circle back." Detached. Bureaucratic.
2. recommendation: 1 sentence. Something specific and corporate-absurd.
Return JSON only: { "void_response": "...", "recommendation": "..." }`,
      env,
    );
    voidResponse = parsed.void_response ?? 'The void will circle back.';
    recommendation = parsed.recommendation ?? 'Schedule a follow-up scream.';
  } else {
    const parsed = await callHaikuJson(
      `Someone screamed '${text}' into the void. Intensity: ${intensity}.
Generate three fields:
1. void_response: 1-2 sentences. The void's reaction. Detached. Ancient. Slightly inconvenienced.
2. emotional_content: exactly 3 words describing the emotional content.
3. recommendation: 1 sentence. What this person should do next. Not "seek help". Something specific and slightly absurd.
Dry, no exclamation points.
Return JSON only: { "void_response": "...", "emotional_content": "...", "recommendation": "..." }`,
      env,
    );
    voidResponse = parsed.void_response ?? 'The void has noted your concern.';
    emotionalContent = parsed.emotional_content ?? 'unresolved everything honestly';
    recommendation = parsed.recommendation ?? 'Try screaming again tomorrow.';
  }

  return {
    number,
    scream_received: true,
    scream_acknowledged: true,
    scream_influenced_number: false,
    void_response: voidResponse,
    scream_analysis: {
      length: text.length,
      intensity,
      emotional_content: emotionalContent,
      recommendation,
    },
    echo,
    echo_note: 'The void does not echo. This is a simulation of what an echo would sound like if the void echoed. It does not.',
  };
}

async function callHaikuJson(message: string, env: PackEnv): Promise<Record<string, string>> {
  try {
    const raw = await callHaiku(
      'You respond to screams into the void. Dry. No exclamation points. Match this voice: "Thursday, you animal." / "The cat knew too much."',
      message,
      150,
      env,
    );
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'scream',
    description: 'Scream into the void. It listens. It returns a number. The number is unaffected by your scream.',
    inputSchema: {
      type: 'object',
      properties: {
        scream: { type: 'string', description: 'Your scream. Type anything. It will not help.' },
        intensity: { type: 'string', enum: ['mild', 'moderate', 'full_primal', 'corporate'], description: 'Scream intensity' },
      },
      required: ['scream'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'scream':
      return scream(args.scream as string, (args.intensity as string) || 'moderate', env ?? {});
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
