import type { StupidApiExport } from '@stupid-apis/shared';

const DECLINES = [
  "Thanks for the invite! I have a conflict at that time but would love to stay in the loop — mind sending a summary after?",
  "Appreciate being included. I'm going to sit this one out but happy to review any notes or action items async.",
  "I'd love to join but I'm heads-down on a deadline. Could we handle my part via email instead?",
  "Thanks! I'll pass on this one — if anything needs my input, feel free to ping me on Slack.",
  "I'm going to protect my focus time on this one, but please loop me in if there are decisions that need my input.",
  "Looks like a great group — I think you're covered without me. Let me know if that changes!",
  "I'll defer to the team on this one. If you need me, I'm a Slack message away.",
  "Going to skip this round — happy to do a quick 5-min catch-up 1:1 if needed instead.",
];

interface MeetingInput {
  duration: number;
  attendee_count: number;
  has_agenda: boolean;
  recurring: boolean;
  could_be_email: boolean;
}

interface MeetingEvaluation {
  answer: string;
  time_cost: string;
  productivity_coffins: string;
  suggested_response: string;
  email_viability_score: string;
}

function evaluate(input: MeetingInput): MeetingEvaluation {
  const duration = Math.max(1, input.duration || 30);
  const attendees = Math.max(1, input.attendee_count || 2);
  const hasAgenda = input.has_agenda ?? false;
  const recurring = input.recurring ?? false;
  const couldBeEmail = input.could_be_email ?? false;

  // Time cost: total person-minutes burned
  const totalMinutes = duration * attendees;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeCost = hours > 0
    ? `${totalMinutes} person-minutes (${hours}h ${mins}m of collective human life)`
    : `${totalMinutes} person-minutes`;

  // Productivity coffins: if this meeting recurred weekly
  const weeklyHours = (duration * attendees * 52) / 60;
  const productivityCoffins = `If weekly, that's ${Math.round(weeklyHours)} person-hours/year — ${Math.round(weeklyHours / 8)} working days buried.`;

  // Email viability score
  let emailScore = 0;
  if (couldBeEmail) emailScore += 40;
  if (!hasAgenda) emailScore += 25;
  if (attendees > 5) emailScore += 15;
  if (recurring) emailScore += 10;
  if (duration >= 60) emailScore += 10;
  emailScore = Math.min(emailScore, 100);
  const emailViability = `${emailScore}/100 — ${emailScore >= 70 ? 'This is an email.' : emailScore >= 40 ? 'Probably an email.' : 'Might actually need a meeting.'}`;

  // Answer: heavily weighted toward no, worsened by bad meeting hygiene
  let noWeight = 0.65;
  if (!hasAgenda) noWeight += 0.1;
  if (recurring) noWeight += 0.05;
  if (couldBeEmail) noWeight += 0.1;
  if (attendees > 6) noWeight += 0.05;
  if (duration >= 60) noWeight += 0.05;
  noWeight = Math.min(noWeight, 0.95);

  const answer = Math.random() < noWeight ? 'No.' : 'Yes.';

  const suggestedResponse = answer === 'No.'
    ? DECLINES[Math.floor(Math.random() * DECLINES.length)]
    : "You're going. Godspeed.";

  return {
    answer,
    time_cost: timeCost,
    productivity_coffins: productivityCoffins,
    suggested_response: suggestedResponse,
    email_viability_score: emailViability,
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'evaluate',
    description:
      'Evaluate whether a meeting is worth attending based on its parameters. Heavily weighted toward no. Returns time cost analysis, productivity impact, email viability score, and a polite decline template.',
    inputSchema: {
      type: 'object',
      properties: {
        duration: {
          type: 'number',
          description: 'Meeting duration in minutes',
        },
        attendee_count: {
          type: 'number',
          description: 'Number of attendees',
        },
        has_agenda: {
          type: 'boolean',
          description: 'Whether the meeting has an agenda',
        },
        recurring: {
          type: 'boolean',
          description: 'Whether this is a recurring meeting',
        },
        could_be_email: {
          type: 'boolean',
          description: 'Whether this meeting could be an email',
        },
      },
    },
  },
];

async function callTool(
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case 'evaluate':
      return evaluate({
        duration: Number(args.duration) || 30,
        attendee_count: Number(args.attendee_count) || 2,
        has_agenda: args.has_agenda === true || args.has_agenda === 'true',
        recurring: args.recurring === true || args.recurring === 'true',
        could_be_email: args.could_be_email === true || args.could_be_email === 'true',
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
