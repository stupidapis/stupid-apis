import type { StupidApiExport } from '@stupid-apis/shared';

type Mode = 'truth' | 'dare' | 'either';

const TRUTHS = [
  'What is the most expensive thing you have ever broken?',
  'What is something you have never said aloud and intend to keep that way?',
  'Whose number have you blocked but not deleted?',
  'What was the last lie you told a coworker?',
  'What is the last thing you searched and immediately cleared?',
  'What is a compliment you have given that you did not mean?',
  'What is the longest you have gone without sleeping on purpose?',
  'What is something you do that you would never tell your dentist?',
  'What is the most you have spent on something you never used?',
  'Who do you owe an apology to that you will not give?',
  'What is the worst job you have ever had — and why did you stay?',
  'What is the strangest thing you have eaten alone, in the dark?',
];

const DARES = [
  'Send the next message in your group chat using only haikus until someone notices.',
  'Call a person you have not spoken to in over a year. Just say hi.',
  'Order coffee using a fake but normal-sounding name.',
  'Send a text that says only "thinking of you" to the third contact alphabetically.',
  'Write a one-star review of a product you have never used. Do not post it.',
  'Walk three blocks in the wrong direction on purpose.',
  'Compliment a stranger\'s shoes specifically.',
  'Speak in a slightly British accent for one full conversation.',
  'Eat the next meal in silence, with no devices.',
  'Make a sandwich for someone who did not ask.',
  'Take the stairs even when the elevator is faster.',
  'Wear something inside out for the next hour. Tell no one.',
];

const SPICE_DESCRIPTORS = ['mild', 'medium', 'spicy', 'unwise'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  type: 'truth' | 'dare';
  prompt: string;
  spice_level: string;
  consequence_for_skipping: string;
}

const SKIP_CONSEQUENCES = [
  'you must answer two of the next prompts',
  'you owe the room one true thing of your choosing',
  'forfeit your seat for one round',
  'you must do the dishes for the host',
  'you must volunteer one embarrassment, freely',
];

function pick(mode: Mode): Result {
  const type: 'truth' | 'dare' = mode === 'either' ? (Math.random() < 0.5 ? 'truth' : 'dare') : mode;
  return {
    type,
    prompt: type === 'truth' ? pickOne(TRUTHS) : pickOne(DARES),
    spice_level: pickOne(SPICE_DESCRIPTORS),
    consequence_for_skipping: pickOne(SKIP_CONSEQUENCES),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'pick',
    description:
      'Returns a truth question or a dare. Mode: truth, dare, or either. Includes spice level and the consequence for skipping.',
    inputSchema: {
      type: 'object',
      properties: {
        mode: { type: 'string', enum: ['truth', 'dare', 'either'], description: 'Default: either.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'pick': {
      const m = ((args.mode as string) || 'either').toLowerCase();
      if (!['truth', 'dare', 'either'].includes(m)) throw new Error('Mode must be truth, dare, or either.');
      return pick(m as Mode);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
