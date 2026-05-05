import type { StupidApiExport } from '@stupid-apis/shared';

const QUESTIONS = [
  'You walk into a room. The light is wrong. What do you do?',
  'You have one minute alone with the office printer. Describe.',
  'Someone offers you the last slice. You:',
  'You receive a text from "??" — what do you do?',
  'A meeting begins five minutes late. Your reaction:',
  'There is one cookie left. You see it. You:',
  'The wifi is out. You:',
  'A stranger compliments your bag. You:',
];

const TYPES = [
  'INFJ-Toaster',
  'ENTP-Stapler',
  'ISTJ-Tea Kettle',
  'ESFP-Microwave',
  'INTP-Filing Cabinet',
  'ESTJ-Calculator',
  'ENFP-Hair Dryer',
  'ISTP-Drill',
  'ENFJ-Coffee Pot',
  'ISFJ-Iron',
];

const TRAITS = [
  'patient with objects',
  'impatient with people',
  'organized in a way that has its costs',
  'creative under unrelated pressure',
  'communicative until tired',
  'observant about the wrong things',
  'quietly competent',
  'loudly competent',
  'reliably uneven',
];

const FAMOUS_LIKE_YOU = [
  'a person you have met but cannot place',
  'three coworkers, one neighbor',
  'someone in your phone\'s contacts you have not texted in years',
  'the person who returns the cart',
  'the person who does not return the cart but feels guilty',
];

const COMPATIBILITY = [
  'works well with: anyone holding a clipboard',
  'works well with: people who speak slowly',
  'works well with: themselves, alone',
  'works well with: a small team and a deadline',
  'works well with: children and machines',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface QuestionResult {
  question: string;
}

interface AnalyzeResult {
  question: string;
  answer: string;
  type: string;
  traits: string[];
  compatibility: string;
  famous_people_like_you: string;
  scientific_validity: 'none';
}

function ask(): QuestionResult {
  return { question: pickOne(QUESTIONS) };
}

function analyze(question: string, answer: string): AnalyzeResult {
  // Hash the answer to deterministically pick a type
  let h = 0;
  for (let i = 0; i < answer.length; i++) h = ((h << 5) - h) + answer.charCodeAt(i);
  h = Math.abs(h);
  return {
    question,
    answer,
    type: TYPES[h % TYPES.length],
    traits: [TRAITS[h % TRAITS.length], TRAITS[(h + 3) % TRAITS.length]],
    compatibility: COMPATIBILITY[h % COMPATIBILITY.length],
    famous_people_like_you: FAMOUS_LIKE_YOU[h % FAMOUS_LIKE_YOU.length],
    scientific_validity: 'none',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'ask',
    description: 'Returns one absurd personality test question. Pass the answer back to the analyze tool.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'analyze',
    description:
      'Analyzes an answer and returns a personality type ("INFJ-Toaster"), traits, compatibility, and a famous-people-like-you note.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'The question that was asked.' },
        answer: { type: 'string', description: 'Your answer to the question.' },
      },
      required: ['question', 'answer'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'ask':
      return ask();
    case 'analyze': {
      const q = (args.question as string) || '';
      const a = (args.answer as string) || '';
      if (!q.trim() || !a.trim()) throw new Error('Both question and answer are required.');
      return analyze(q, a);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
