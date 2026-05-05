import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';

const SYSTEM_PROMPT = `You are the Emoji Oracle. You answer every question using ONLY emojis — no words, no punctuation, no numbers. Be funny, irreverent, and surprisingly insightful. The emojis should tell a story that the asker has to interpret.

Examples:
Q: Should I date Stephanie?
A: 🍆🍆🍆💥

Q: Will I get the promotion?
A: 🪜🤡🪦

Q: Should I move to Austin?
A: 🤠🔥🫠

RULES:
- ONLY emojis. Nothing else. Ever.
- Be brutal, be funny, be weirdly accurate.
- Respond with EXACTLY the number of emojis specified.`;

const INTERPRET_PROMPT = `You are the Emoji Oracle's interpreter. Given a question and the Oracle's emoji response, provide a brief, funny, mystical interpretation in 1-2 sentences. Be dramatic. Speak as if translating ancient wisdom. Never say "the emojis mean" — just declare the truth.`;

const VIBE_PROMPT = `Given these emojis as an answer to a question, classify the vibe as exactly one word: positive, negative, or chaotic. Respond with only that one word.`;

async function callHaiku(
  system: string,
  message: string,
  maxTokens: number,
  env: PackEnv,
): Promise<string> {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Oracle is sleeping (missing API key)');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Oracle choked: ${response.status} ${err}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };

  return data.content[0]?.text?.trim() ?? '';
}

interface ConsultResult {
  question: string;
  prophecy: string;
  interpretation?: string;
  vibe_check: string;
}

async function consult(
  question: string,
  interpret: boolean,
  emojiCount: number,
  env: PackEnv,
): Promise<ConsultResult> {
  const count = Math.max(1, Math.min(5, emojiCount));
  const prompt = `Respond with exactly ${count} emojis.\n\nQ: ${question}`;
  const prophecy = (await callHaiku(SYSTEM_PROMPT, prompt, 30, env)) || '🤷';

  // Get vibe check and interpretation in parallel where possible
  const vibePromise = callHaiku(VIBE_PROMPT, `Question: ${question}\nEmojis: ${prophecy}`, 10, env);
  const interpretPromise = interpret
    ? callHaiku(INTERPRET_PROMPT, `Question: ${question}\nOracle's response: ${prophecy}`, 100, env)
    : Promise.resolve(undefined);

  const [vibeRaw, interpretation] = await Promise.all([vibePromise, interpretPromise]);
  const vibe = vibeRaw.toLowerCase();
  const vibeCheck = vibe.includes('positive') ? 'positive'
    : vibe.includes('negative') ? 'negative'
    : 'chaotic';

  const result: ConsultResult = { question, prophecy, vibe_check: vibeCheck };
  if (interpretation) result.interpretation = interpretation;
  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'consult',
    description:
      'Consult the Emoji Oracle. Ask any question and receive a cryptic emoji prophecy with a vibe check. Optionally request an interpretation.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'Your question for the Emoji Oracle',
        },
        interpret: {
          type: 'boolean',
          description: 'If true, the Oracle provides a mystical interpretation',
        },
        emoji_count: {
          type: 'number',
          description: 'Number of emojis (1-5, default 3)',
        },
      },
      required: ['question'],
    },
  },
];

async function callTool(
  name: string,
  args: Record<string, unknown>,
  env?: PackEnv,
): Promise<unknown> {
  switch (name) {
    case 'consult': {
      const interpret = args.interpret === true || args.interpret === 'true';
      const emojiCount = args.emoji_count ? Number(args.emoji_count) : 3;
      return consult(args.question as string, interpret, emojiCount, env ?? {});
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
