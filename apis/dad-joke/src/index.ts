import type { StupidApiExport } from '@stupid-apis/shared';

interface Joke {
  setup: string | null;
  punchline: string;
  category: Category;
  groan_factor: number;
}

type Category = 'food' | 'animals' | 'puns' | 'tech' | 'dad';

const JOKES: Joke[] = [
  // food
  { setup: null, punchline: "I'm on a seafood diet. I see food and I eat it.", category: 'food', groan_factor: 7 },
  { setup: 'What do you call a fake noodle?', punchline: 'An impasta.', category: 'food', groan_factor: 8 },
  { setup: 'Why did the coffee file a police report?', punchline: 'It got mugged.', category: 'food', groan_factor: 8 },
  { setup: null, punchline: "I asked the bartender for something cold and full of rum. He recommended his wife.", category: 'food', groan_factor: 6 },
  { setup: 'What did the grape do when it got stepped on?', punchline: 'It let out a little wine.', category: 'food', groan_factor: 8 },
  { setup: null, punchline: "I used to be addicted to soap. I'm clean now.", category: 'food', groan_factor: 7 },
  { setup: 'Why did the cookie cry?', punchline: 'Its mother had been a wafer too long.', category: 'food', groan_factor: 9 },

  // animals
  { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field.', category: 'animals', groan_factor: 7 },
  { setup: 'What do you call a fish with no eyes?', punchline: 'A fsh.', category: 'animals', groan_factor: 9 },
  { setup: 'How do you organize a space party?', punchline: 'You planet.', category: 'animals', groan_factor: 8 },
  { setup: null, punchline: "I'm reading a book about anti-gravity. It's impossible to put down.", category: 'animals', groan_factor: 6 },
  { setup: 'What do you call a sleeping bull?', punchline: 'A bulldozer.', category: 'animals', groan_factor: 8 },
  { setup: 'Why do bees have sticky hair?', punchline: 'They use a honeycomb.', category: 'animals', groan_factor: 9 },
  { setup: 'What do you call a cow with no legs?', punchline: 'Ground beef.', category: 'animals', groan_factor: 8 },

  // puns
  { setup: null, punchline: 'I tried to catch fog yesterday. Mist.', category: 'puns', groan_factor: 8 },
  { setup: null, punchline: 'I used to hate facial hair. Then it grew on me.', category: 'puns', groan_factor: 7 },
  { setup: null, punchline: "I'd tell you a construction joke, but I'm still working on it.", category: 'puns', groan_factor: 8 },
  { setup: null, punchline: "I told my wife she was drawing her eyebrows too high. She looked surprised.", category: 'puns', groan_factor: 7 },
  { setup: 'Did you hear about the mathematician who is afraid of negative numbers?', punchline: 'He will stop at nothing to avoid them.', category: 'puns', groan_factor: 9 },
  { setup: null, punchline: "I have a fear of speed bumps. I'm slowly getting over it.", category: 'puns', groan_factor: 8 },
  { setup: null, punchline: 'I told a chemistry joke. There was no reaction.', category: 'puns', groan_factor: 9 },

  // tech
  { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.', category: 'tech', groan_factor: 8 },
  { setup: 'How many programmers does it take to change a light bulb?', punchline: 'None. That is a hardware problem.', category: 'tech', groan_factor: 7 },
  { setup: null, punchline: "There are 10 kinds of people in the world: those who understand binary, and those who don't.", category: 'tech', groan_factor: 9 },
  { setup: 'Why did the programmer quit his job?', punchline: 'He did not get arrays.', category: 'tech', groan_factor: 9 },
  { setup: null, punchline: 'A SQL query walks into a bar, walks up to two tables, and asks: "Can I join you?"', category: 'tech', groan_factor: 8 },
  { setup: 'Why was the JavaScript developer sad?', punchline: 'Because he did not Node how to Express himself.', category: 'tech', groan_factor: 10 },

  // dad (meta)
  { setup: null, punchline: '"Dad, I\'m hungry." "Hi Hungry, I\'m Dad."', category: 'dad', groan_factor: 10 },
  { setup: null, punchline: '"Can you put the cat out?" "I didn\'t know it was on fire."', category: 'dad', groan_factor: 9 },
  { setup: null, punchline: 'I\'ll call you back. I\'m putting up shelves. Yes, this conversation is hanging.', category: 'dad', groan_factor: 9 },
  { setup: 'What time is it?', punchline: 'Time you got a watch.', category: 'dad', groan_factor: 10 },
  { setup: null, punchline: 'I used to play piano by ear. Now I use my hands.', category: 'dad', groan_factor: 8 },
  { setup: null, punchline: '"Did you get a haircut?" "No, I got them all cut."', category: 'dad', groan_factor: 10 },
];

const VALID_CATEGORIES: Category[] = ['food', 'animals', 'puns', 'tech', 'dad'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function audienceFor(groan: number): string {
  if (groan >= 9) return 'a child who has not yet learned to fake-laugh';
  if (groan >= 7) return 'a coworker trapped in your kitchen';
  return 'someone who is paid to be there';
}

interface TellResult {
  setup: string | null;
  punchline: string;
  category: Category;
  groan_factor: number;
  recommended_audience: string;
  delivery_note: string;
}

function tell(category?: Category): TellResult {
  const pool = category ? JOKES.filter((j) => j.category === category) : JOKES;
  const joke = pickOne(pool);
  return {
    setup: joke.setup,
    punchline: joke.punchline,
    category: joke.category,
    groan_factor: joke.groan_factor,
    recommended_audience: audienceFor(joke.groan_factor),
    delivery_note: joke.setup ? 'Pause before the punchline. Commit fully.' : 'Deliver flatly. The flatness is the joke.',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'tell',
    description:
      'Tell one dad joke. Returns setup, punchline, groan factor, and a delivery note. Optional category: food, animals, puns, tech, dad.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: VALID_CATEGORIES,
          description: 'Filter to a specific category. Default: any.',
        },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'tell': {
      const cat = args.category as string | undefined;
      const validated = cat && (VALID_CATEGORIES as string[]).includes(cat) ? (cat as Category) : undefined;
      return tell(validated);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
