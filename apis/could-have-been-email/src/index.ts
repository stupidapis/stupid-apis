import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const MEETING_WORDS: Record<string, string[]> = {
  circle_back: ['circle back', 'circling back', 'circle around', 'loop back'],
  align: ['align', 'alignment', 'aligned', 'get aligned', 'stay aligned'],
  action_item: ['action item', 'action items', 'next step', 'next steps', 'follow up', 'follow-up', 'to-do'],
  decision: ['decided', 'decision', 'agreed', 'approved', 'confirmed', 'signed off'],
  filler: [
    'great question', 'good point', 'that\'s fair', 'makes sense',
    'totally', 'absolutely', 'for sure', 'exactly', 'right right',
    'yeah no', 'no yeah', 'can you hear me', 'you\'re on mute',
    'sorry go ahead', 'no you go', 'i think we\'re aligned',
    'let\'s take this offline', 'parking lot', 'table that',
    'before we wrap', 'one more thing',
  ],
};

function countPhrases(text: string, phrases: string[]): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const phrase of phrases) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

function getVerdict(viability: number): string {
  if (viability >= 90) return 'This was an email. It was always an email. Everyone knew it was an email.';
  if (viability >= 70) return 'This could have been an email with a single bullet point.';
  if (viability >= 50) return 'This could have been a Slack thread. Maybe with an emoji reaction.';
  if (viability >= 30) return 'This meeting had some reason to exist. Barely.';
  return 'Against all odds, this meeting may have been necessary. Remarkable.';
}

interface AnalyzeResult {
  verdict: string;
  email_viability: string;
  decisions_made: number;
  action_items: number;
  times_someone_said_circle_back: number;
  times_someone_said_align: number;
  actual_information_exchanged: string;
  person_hours_spent: string;
  suggested_email: string;
  recurring_damage?: string;
}

async function analyze(
  transcript: string,
  duration: number,
  attendeeCount: number,
  recurring: boolean,
  env: PackEnv,
): Promise<AnalyzeResult> {
  // Phase 1: Deterministic
  const circleBack = countPhrases(transcript, MEETING_WORDS.circle_back);
  const alignCount = countPhrases(transcript, MEETING_WORDS.align);
  const actionItems = countPhrases(transcript, MEETING_WORDS.action_item);
  const decisions = countPhrases(transcript, MEETING_WORDS.decision);
  const fillerCount = countPhrases(transcript, MEETING_WORDS.filler);

  const words = transcript.split(/\s+/).filter(Boolean).length;
  const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
  const fillerRatio = fillerCount / Math.max(sentences, 1);

  // Email viability: more filler + fewer decisions = higher viability
  let viability = 50;
  if (decisions === 0) viability += 25;
  if (actionItems === 0) viability += 15;
  if (fillerRatio > 0.3) viability += 10;
  if (circleBack > 2) viability += 5;
  if (attendeeCount > 6) viability += 5;
  if (duration > 45) viability += 5;
  if (decisions >= 3) viability -= 20;
  if (actionItems >= 3) viability -= 15;
  viability = Math.max(0, Math.min(100, viability));

  // Actual information
  const meaningfulSentences = Math.max(sentences - fillerCount, 0);
  const infoExchanged = meaningfulSentences <= 3
    ? `Could fit in ${meaningfulSentences || 1} sentence${meaningfulSentences === 1 ? '' : 's'}`
    : meaningfulSentences <= 8
      ? `A short paragraph would have sufficed`
      : `Some actual content was exchanged. The meeting gods smile upon you.`;

  const totalMinutes = duration * attendeeCount;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const personHours = hours > 0
    ? `${totalMinutes} person-minutes (${hours}h ${mins}m of collective life)`
    : `${totalMinutes} person-minutes`;

  // Phase 2: Haiku calls
  const emailPromise = callHaiku(
    'Given a meeting transcript, write the email that should have been sent instead. Format as: Subject line, then 2-4 bullet points. Keep it under 60 words total. Be ruthlessly concise.',
    `Transcript: "${transcript.slice(0, 500)}"\nDecisions: ${decisions}\nAction items: ${actionItems}`,
    150,
    env,
  );

  const recurringPromise = recurring
    ? callHaiku(
        'Calculate the annual damage of a recurring weekly meeting. Be specific with numbers and devastating with tone. One sentence.',
        `Duration: ${duration}min, Attendees: ${attendeeCount}, Decisions per meeting: ${decisions}, Email viability: ${viability}/100`,
        80,
        env,
      )
    : Promise.resolve(undefined);

  const [suggestedEmail, recurringDamage] = await Promise.all([emailPromise, recurringPromise]);

  const result: AnalyzeResult = {
    verdict: getVerdict(viability),
    email_viability: `${viability}/100`,
    decisions_made: decisions,
    action_items: actionItems,
    times_someone_said_circle_back: circleBack,
    times_someone_said_align: alignCount,
    actual_information_exchanged: infoExchanged,
    person_hours_spent: personHours,
    suggested_email: suggestedEmail,
  };

  if (recurringDamage) result.recurring_damage = recurringDamage;

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'analyze',
    description: 'Analyze a meeting transcript to determine if it could have been an email. Counts filler, decisions, action items, and generates the email that should have been sent instead.',
    inputSchema: {
      type: 'object',
      properties: {
        transcript: { type: 'string', description: 'Meeting transcript or summary' },
        duration: { type: 'number', description: 'Meeting duration in minutes' },
        attendee_count: { type: 'number', description: 'Number of attendees' },
        recurring: { type: 'boolean', description: 'Is this a recurring meeting' },
      },
      required: ['transcript'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'analyze':
      return analyze(
        args.transcript as string,
        args.duration ? Number(args.duration) : 30,
        args.attendee_count ? Number(args.attendee_count) : 4,
        args.recurring === true || args.recurring === 'true',
        env ?? {},
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
