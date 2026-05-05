import type { StupidApiExport } from '@stupid-apis/shared';

const PROVERBS = [
  'A watched inbox never pings',
  'The fire warms the room only of the man who built it',
  'A man who eats lunch at his desk is twice no one',
  'Where the road forks, take both, slowly',
  'The unread book is still a book',
  'The cat that knows your habits has decided about you',
  'A small lie, well-kept, is rent',
  'A good neighbor is a hedge of the right height',
  'The hand that signs the check is also the hand',
  'He who explains his joke is sentenced to it',
  'The river does not consult the stone',
  'A guest is a guest until the third night',
  'The bowl is what you eat from; the table is what you eat on',
  'Between two answers there is a third one, hiding',
  'The wise man and the foolish man both pay the toll',
  'A door, once opened, is not the same door',
];

const PHILOSOPHERS = [
  'Zoltrak the Lesser',
  'Maranthia of Ephesus',
  'Bren the Quiet',
  'Old Dovin',
  'Vesper of the Eastern Marches',
  'Cassel the Forgotten',
  'Helia of Thrace',
  'The Brothers Anrim',
  'Phaedra of the Long Hall',
  'Tirek the Unverified',
  'Yula of the Inner Province',
  'Saint Crisp of the Reedlands',
];

const SCHOOLS = [
  'Lower Stoic',
  'Domestic Skeptic',
  'Northern Pragmatist',
  'Late Cynic',
  'Provincial Idealist',
  'Cellar School',
  'Quiet Materialist',
  'Eastern Particularist',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  proverb: string;
  attributed_to: string;
  century: string;
  school_of_thought: string;
  modern_application: string;
  citation: string;
}

const APPLICATIONS = [
  'consider this before responding to the email',
  'apply at the next standup',
  'do not say this aloud at the meeting',
  'think on this in the elevator',
  'mention to one trusted colleague',
  'apply only on Tuesday',
];

function consult(): Result {
  const cent = -4 + Math.floor(Math.random() * 22);
  const era = cent < 0 ? `${Math.abs(cent)}th century BCE` : `${cent}th century CE`;
  return {
    proverb: pickOne(PROVERBS),
    attributed_to: pickOne(PHILOSOPHERS),
    century: era,
    school_of_thought: pickOne(SCHOOLS),
    modern_application: pickOne(APPLICATIONS),
    citation: 'fragmentary',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'consult',
    description:
      'Returns a fake ancient proverb attributed to a fake philosopher. Includes century, school of thought, and a modern application.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'consult':
      return consult();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
