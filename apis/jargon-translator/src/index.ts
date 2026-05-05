import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const SYSTEM_PROMPTS: Record<string, Record<string, string>> = {
  corporate_to_english: {
    passive_aggressive: 'Translate corporate jargon into plain English. Reveal what the person actually means. Be devastatingly accurate. 1-3 sentences.',
    enthusiastic: 'Translate corporate jargon into plain English, but make it sound like exciting gossip. Like a friend decoding a work email over drinks. 1-3 sentences.',
    defeated: 'Translate corporate jargon into plain English with the exhaustion of someone who has been in too many meetings. The translation should sound tired but accurate. 1-3 sentences.',
  },
  english_to_corporate: {
    passive_aggressive: 'Translate plain English into corporate jargon. Make it sound professional on the surface but subtly devastating underneath. The kind of email that makes someone stare at their screen for ten minutes. 1-3 sentences.',
    enthusiastic: 'Translate plain English into absurdly enthusiastic corporate speak. Weaponize positivity. Every sentence should sound like a LinkedIn post. 1-3 sentences.',
    defeated: 'Translate plain English into corporate speak that radiates quiet resignation. The words are professional but the soul behind them has left the building. 1-3 sentences.',
  },
};

interface TranslateResult {
  original: string;
  translation: string;
  direction: string;
  formality: string;
  confidence: string;
  warning?: string;
}

async function translate(
  content: string,
  direction: string,
  formality: string,
  env: PackEnv,
): Promise<TranslateResult> {
  const dir = SYSTEM_PROMPTS[direction] ? direction : 'corporate_to_english';
  const form = SYSTEM_PROMPTS[dir][formality] ? formality : 'passive_aggressive';

  const translation = await callHaiku(
    SYSTEM_PROMPTS[dir][form],
    content,
    150,
    env,
  );

  const result: TranslateResult = {
    original: content,
    translation,
    direction: dir,
    formality: form,
    confidence: 'unsettlingly high',
  };

  if (dir === 'english_to_corporate') {
    result.warning = 'We are not responsible for relationships damaged by sending this.';
  }

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'translate',
    description: 'Translate between corporate jargon and plain English. Supports bidirectional translation with formality modes: passive_aggressive, enthusiastic, or defeated.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Text to translate' },
        direction: {
          type: 'string',
          description: 'Translation direction',
          enum: ['corporate_to_english', 'english_to_corporate'],
        },
        formality: {
          type: 'string',
          description: 'Tone of the translation',
          enum: ['passive_aggressive', 'enthusiastic', 'defeated'],
        },
      },
      required: ['content', 'direction'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'translate':
      return translate(
        args.content as string,
        args.direction as string,
        (args.formality as string) || 'passive_aggressive',
        env ?? {},
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
