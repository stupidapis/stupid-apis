import type { StupidApiExport } from '@stupid-apis/shared';

const PASSIVE_AGGRESSIVE_PHRASES = [
  'per my last email',
  'as previously mentioned',
  'as i mentioned',
  'gentle reminder',
  'friendly reminder',
  'just following up',
  'circling back',
  'as discussed',
  'i trust you',
  'going forward',
  'with all due respect',
  'not sure if you saw',
  'as per our conversation',
  'please advise',
  'hope this helps',
  'thanks in advance',
  'let me know if i can clarify',
  'just to be clear',
  'for your reference',
  'correct me if i\'m wrong',
];

const ACTIONS_SEND = [
  "Send it. But screenshot it first for the group chat.",
  "Send it. You've already suffered enough writing it.",
  "Go ahead. But maybe remove the third exclamation mark.",
];

const ACTIONS_NO: Record<string, string[]> = {
  boss: [
    "Save as draft. Sleep on it. Read it tomorrow in a different font.",
    "Delete it and book a 1:1 instead. Tone doesn't travel well upward.",
    "Replace the entire email with 'Sounds good, thanks!' and call it a day.",
  ],
  ex: [
    "Close the laptop. Walk away. Touch grass.",
    "Delete the draft. Block the contact. Adopt a plant.",
    "This email will not bring closure. Nothing will. But especially not this email.",
    "The best version of this email is the one you never send.",
  ],
  investor: [
    "Have someone else proofread this. Someone who likes you.",
    "Remove every adjective. Investors don't trust adjectives.",
    "Save it, wait 24 hours, then delete the parts where you sound desperate.",
  ],
  mom: [
    "She'll read between every line. Remove the subtext or lean into it.",
    "Just call her. This email will generate seventeen follow-up questions.",
    "Add 'love you' at the end. Whatever else is in there, that'll help.",
  ],
  generic: [
    "Save as draft. Revisit in the morning with coffee and perspective.",
    "Read it out loud. If you cringe, don't send it.",
    "Delete the second paragraph. You know which one.",
    "Replace the email with a Slack message. Lower stakes.",
  ],
};

function countOccurrences(text: string, phrases: string[]): number {
  const lower = text.toLowerCase();
  return phrases.reduce((count, phrase) => {
    const regex = new RegExp(phrase, 'gi');
    const matches = lower.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface AnalyzeResult {
  recommendation: string;
  passive_aggression_score: string;
  regret_probability: string;
  suggested_action: string;
  cooling_off_period: string;
}

function analyze(
  content: string,
  recipientType?: string,
  timeSinceWriting?: number,
  drunk?: boolean,
): AnalyzeResult {
  const type = recipientType && ACTIONS_NO[recipientType] ? recipientType : 'generic';
  const minutes = Math.max(0, timeSinceWriting || 0);

  // Passive aggression score: count phrases + caps + exclamation marks
  const paCount = countOccurrences(content, PASSIVE_AGGRESSIVE_PHRASES);
  const capsWords = (content.match(/\b[A-Z]{2,}\b/g) || []).length;
  const exclamations = (content.match(/!/g) || []).length;
  const ellipses = (content.match(/\.\.\./g) || []).length;
  const rawPA = Math.min(paCount * 15 + capsWords * 5 + exclamations * 3 + ellipses * 10, 100);
  const paScore = `${rawPA}/100${rawPA >= 70 ? ' — this email is a weapon' : rawPA >= 40 ? ' — detectable levels of resentment' : ' — surprisingly civil'}`;

  // Regret probability: base 60%, modified by inputs
  let regret = 60;
  if (drunk) regret += 30;
  if (type === 'ex') regret += 25;
  if (type === 'boss') regret += 10;
  if (minutes > 60) regret += 10;
  if (minutes > 120) regret += 10;
  if (rawPA >= 70) regret += 15;
  if (content.length > 500) regret += 5;
  regret = Math.min(regret, 99);
  const regretStr = `${regret}%${regret >= 90 ? ' — you will absolutely regret this' : regret >= 70 ? ' — high probability of 3am cringe' : ''}`;

  // Recommendation: heavily weighted toward no
  let noWeight = 0.70;
  if (drunk) noWeight += 0.20;
  if (type === 'ex') noWeight += 0.15;
  if (rawPA >= 50) noWeight += 0.05;
  if (minutes < 10) noWeight += 0.05;
  noWeight = Math.min(noWeight, 0.95);
  const shouldSend = Math.random() >= noWeight;

  const recommendation = shouldSend ? 'Send it.' : "Don't send it.";
  const suggestedAction = shouldSend
    ? pick(ACTIONS_SEND)
    : pick(ACTIONS_NO[type]);

  // Cooling off period
  let coolingMinutes = 30;
  if (drunk) coolingMinutes = 480;
  if (type === 'ex') coolingMinutes = 43200; // 30 days
  if (rawPA >= 70) coolingMinutes = Math.max(coolingMinutes, 120);
  if (minutes > coolingMinutes) coolingMinutes = 0;

  let coolingStr: string;
  if (coolingMinutes === 0) {
    coolingStr = "You've waited long enough. The statute of limitations on bad emails has passed.";
  } else if (coolingMinutes >= 43200) {
    coolingStr = `${Math.round(coolingMinutes / 1440)} days. Minimum.`;
  } else if (coolingMinutes >= 60) {
    coolingStr = `${Math.round(coolingMinutes / 60)} hours`;
  } else {
    coolingStr = `${coolingMinutes} minutes`;
  }

  return {
    recommendation,
    passive_aggression_score: paScore,
    regret_probability: regretStr,
    suggested_action: suggestedAction,
    cooling_off_period: coolingStr,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'analyze',
    description:
      'Analyze whether you should send that email. Evaluates passive aggression, regret probability, and provides a recommendation (heavily weighted toward no).',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The email content you\'re thinking of sending',
        },
        recipient_type: {
          type: 'string',
          description: 'Who you\'re sending it to',
          enum: ['boss', 'ex', 'investor', 'mom'],
        },
        time_since_writing: {
          type: 'number',
          description: 'Minutes since you wrote the email — longer = more likely no',
        },
        drunk: {
          type: 'boolean',
          description: 'Are you drunk?',
        },
      },
      required: ['content'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'analyze':
      return analyze(
        args.content as string,
        args.recipient_type as string | undefined,
        args.time_since_writing ? Number(args.time_since_writing) : undefined,
        args.drunk === true || args.drunk === 'true',
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
