import type { StupidApiExport } from '@stupid-apis/shared';

const CAT_ALIVE = [
  "Alive. Plotting your demise.",
  "Alive. Knocking things off the counter.",
  "Alive. Judging you silently.",
  "Alive. Sitting in the box voluntarily now.",
  "Alive. Demanding treats.",
];

const CAT_DEAD = [
  "Dead. Or napping. Impossible to tell with cats.",
  "Dead. The box is suspiciously quiet.",
  "Dead. Schrödinger sends his regards.",
  "Dead. The cat knew too much.",
  "Dead. The universe made its choice.",
];

const CAT_SUPERPOSITION = [
  "Alive AND dead. The cat is vibing in superposition.",
  "Both. The cat refuses to commit.",
  "Simultaneously alive and dead. The cat has transcended binary existence.",
  "Unknowable. The cat is in a quantum mood.",
  "The cat exists in all states. It is everything. It is nothing. It is a cat.",
];

const OBSERVATION_WARNINGS = [
  "By observing, you have collapsed the wave function. There is no going back.",
  "You looked. The universe noticed. It's taking notes.",
  "The act of observation has permanently altered reality. Hope you're happy.",
  "Congratulations — you've destroyed a perfectly good superposition.",
  "You observed it. Now you have to live with the answer.",
];

const SUPERPOSITION_WARNINGS = [
  "The answer exists in superposition. Do not observe it unless you can handle the truth.",
  "Both outcomes are equally real. Your question haunts two timelines.",
  "The wave function holds. Reality awaits your observation.",
  "Neither true nor false. The universe is keeping its options open.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface EvaluateResult {
  question: string;
  state: string;
  answer_true: string;
  answer_false: string;
  collapsed_answer?: string;
  cat_status?: string;
  observation_warning: string;
  interpretation?: string;
}

function evaluate(
  question: string,
  observe: boolean,
  cat: boolean,
  interpret: boolean,
  reopen: boolean,
): EvaluateResult | { error: string; state: string } {
  if (reopen) {
    return {
      error: "ERROR: Cannot reopen a collapsed wave function. The cat's lawyer has been notified.",
      state: 'error',
    };
  }

  const result: EvaluateResult = {
    question,
    state: observe ? 'collapsed' : 'superposition',
    answer_true: `Yes — "${question}" resolves to true in this branch of the multiverse.`,
    answer_false: `No — "${question}" resolves to false in this branch of the multiverse.`,
    observation_warning: observe ? pick(OBSERVATION_WARNINGS) : pick(SUPERPOSITION_WARNINGS),
  };

  if (observe) {
    const collapsed = Math.random() < 0.5;
    result.collapsed_answer = collapsed ? 'true' : 'false';
  }

  if (cat) {
    if (observe) {
      result.cat_status = Math.random() < 0.5 ? pick(CAT_ALIVE) : pick(CAT_DEAD);
    } else {
      result.cat_status = pick(CAT_SUPERPOSITION);
    }
  }

  if (interpret) {
    if (observe) {
      result.interpretation = result.collapsed_answer === 'true'
        ? 'The wave function collapsed favorably. The universe chose this timeline for you. Cherish it — or don\'t. Free will might also be an illusion.'
        : 'The wave function collapsed against you. In another timeline, you got the answer you wanted. This is not that timeline.';
    } else {
      result.interpretation = 'The answer is simultaneously yes and no. This is not a bug — it\'s quantum mechanics. Your question will remain unresolved until observed, at which point you\'ll wish you hadn\'t looked.';
    }
  }

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'evaluate',
    description:
      'Submit a question to Schrödinger\'s Boolean. The answer exists in superposition (both true and false) until observed. Supports cat mode, interpretation, and ill-advised attempts to reopen collapsed wave functions.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'Your question for the quantum boolean',
        },
        observe: {
          type: 'boolean',
          description: 'Collapse the wave function to get a definitive answer',
        },
        cat: {
          type: 'boolean',
          description: 'Include the cat\'s status in the response',
        },
        interpret: {
          type: 'boolean',
          description: 'Include a philosophical interpretation',
        },
        reopen: {
          type: 'boolean',
          description: 'Attempt to reopen a collapsed wave function (will fail)',
        },
      },
      required: ['question'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'evaluate':
      return evaluate(
        args.question as string,
        args.observe === true || args.observe === 'true',
        args.cat === true || args.cat === 'true',
        args.interpret === true || args.interpret === 'true',
        args.reopen === true || args.reopen === 'true',
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
