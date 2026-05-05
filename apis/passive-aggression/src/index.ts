import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const PA_PHRASES: Array<{ phrase: string; weight: number }> = [
  { phrase: 'per my last email', weight: 15 },
  { phrase: 'as previously mentioned', weight: 12 },
  { phrase: 'as i mentioned', weight: 10 },
  { phrase: 'gentle reminder', weight: 14 },
  { phrase: 'friendly reminder', weight: 13 },
  { phrase: 'just following up', weight: 8 },
  { phrase: 'circling back', weight: 9 },
  { phrase: 'as discussed', weight: 7 },
  { phrase: 'going forward', weight: 6 },
  { phrase: 'with all due respect', weight: 16 },
  { phrase: 'not sure if you saw', weight: 11 },
  { phrase: 'please advise', weight: 8 },
  { phrase: 'hope this helps', weight: 5 },
  { phrase: 'thanks in advance', weight: 7 },
  { phrase: 'just to be clear', weight: 10 },
  { phrase: 'correct me if i\'m wrong', weight: 12 },
  { phrase: 'i trust you', weight: 9 },
  { phrase: 'no worries', weight: 4 },
  { phrase: 'totally fine', weight: 6 },
  { phrase: 'i\'m sure you\'re busy', weight: 11 },
  { phrase: 'when you get a chance', weight: 7 },
  { phrase: 'just wanted to make sure', weight: 8 },
  { phrase: 'as per our conversation', weight: 10 },
  { phrase: 'for your reference', weight: 6 },
  { phrase: 'i was under the impression', weight: 13 },
  { phrase: 'moving forward', weight: 5 },
  { phrase: 'duly noted', weight: 14 },
  { phrase: 'noted', weight: 8 },
  { phrase: 'interesting', weight: 6 },
  { phrase: 'good for you', weight: 12 },
];

function getLevel(score: number): string {
  if (score >= 85) return 'Nuclear';
  if (score >= 65) return 'Weapons Grade';
  if (score >= 40) return 'Moderate';
  return 'Mild';
}

interface DetectResult {
  score: string;
  level: string;
  phrases_detected: string[];
  translation: string;
  recommended_response: string;
  cooling_off_suggested: boolean;
}

async function detect(
  content: string,
  context: string,
  relationship: string,
  env: PackEnv,
): Promise<DetectResult> {
  // Phase 1: Deterministic
  const lower = content.toLowerCase();
  const detected: string[] = [];
  let rawScore = 0;

  for (const { phrase, weight } of PA_PHRASES) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(regex);
    if (matches) {
      detected.push(phrase);
      rawScore += weight * matches.length;
    }
  }

  // Bonus signals
  const ellipses = (content.match(/\.\.\./g) || []).length;
  const allCaps = (content.match(/\b[A-Z]{3,}\b/g) || []).length;
  const smileyAfterBad = (content.match(/(?:no|wrong|incorrect|issue|problem|concern)[^.]*[:;]-?\)/gi) || []).length;
  rawScore += ellipses * 5 + allCaps * 4 + smileyAfterBad * 10;

  const score = Math.min(rawScore, 100);
  const level = getLevel(score);
  const coolOff = score >= 65;

  // Phase 2: Haiku for translation and recommended_response
  const contextStr = `Context: ${context} from ${relationship}${relationship === 'self' ? ' (self-directed — handle with concern and much judgment)' : ''}`;

  const [translation, recommended] = await Promise.all([
    callHaiku(
      'You translate passive-aggressive messages into what the person actually means. Be direct and funny. 1-2 sentences. No quotes around the translation.',
      `${contextStr}\nMessage: "${content}"\nPassive-aggressive phrases found: ${detected.join(', ') || 'none explicit, but the vibe is unmistakable'}`,
      80,
      env,
    ),
    callHaiku(
      'You write recommended responses to passive-aggressive messages. The response should be professional but subtly devastating. 1-2 sentences. Write the actual response text, ready to send.',
      `${contextStr}\nMessage: "${content}"\nAggression level: ${level}`,
      80,
      env,
    ),
  ]);

  return {
    score: `${score}/100`,
    level,
    phrases_detected: detected,
    translation,
    recommended_response: recommended,
    cooling_off_suggested: coolOff,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'detect',
    description: 'Detect passive aggression in text. Scores severity, identifies phrases, translates to plain English, suggests a response.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Text to analyze' },
        context: {
          type: 'string',
          description: 'Communication channel',
          enum: ['email', 'slack', 'text', 'review'],
        },
        relationship: {
          type: 'string',
          description: 'Your relationship to the sender',
          enum: ['boss', 'coworker', 'ex', 'vendor', 'mom', 'investor', 'self'],
        },
      },
      required: ['content'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'detect':
      return detect(
        args.content as string,
        (args.context as string) || 'email',
        (args.relationship as string) || 'coworker',
        env ?? {},
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
