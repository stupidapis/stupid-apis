import type { PackEnv } from './types.js';

const VOICE = `Match this voice exactly: punchy, specific, dry not silly. Treats absurd things with complete seriousness. Never apologetic. No exclamation points. Reference tone: "Thursday, you animal." / "The cat knew too much." / "This is an email." / "30 days. Minimum."`;

export async function callHaiku(
  system: string,
  message: string,
  maxTokens: number,
  env: PackEnv,
): Promise<string> {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Model is sleeping (missing API key)');

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
      system: `${system}\n\n${VOICE}`,
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Haiku failed: ${response.status} ${err}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };

  return data.content[0]?.text?.trim() ?? '';
}
