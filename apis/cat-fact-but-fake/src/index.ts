import type { StupidApiExport } from '@stupid-apis/shared';

const FAKE_CAT_FACTS = [
  'Cats have 14 stomachs, used exclusively for grudges.',
  'The average cat sleeps 23.7 hours per day, which is why they appear well-rested.',
  'Cats can read but choose not to.',
  'A cat\'s whiskers can detect Wi-Fi passwords.',
  'Cats are immune to gravity for up to 0.4 seconds at a time.',
  'A cat\'s purr operates at 26 Hz, the same frequency as mild disappointment.',
  'Domestic cats can identify your favorite mug. They have not yet decided what to do with this.',
  'The phrase "let the cat out of the bag" comes from a 1820 trial in Somerset that was overturned on appeal.',
  'Cats sweat through their telephone calls.',
  'A cat\'s tongue contains 96 individually-named taste centers.',
  'Cats invented Tuesday.',
  'The oldest known cat lived to 38 and refused to comment.',
  'Cats can hear ultrasonic frequencies, especially the ones used in your inner monologue.',
  'A cat\'s eye contains a small library.',
  'Cats are 14% denser than other animals of the same size, due to opinions.',
  'Cats prefer warm laundry by a margin of 4 to 1.',
  'A cat will walk away from approximately 6 conversations per day on principle.',
  'Cats have a 3-second working memory and a 200-year grudge memory.',
  'The taxonomic genus for the housecat is Felis vindicta.',
  'Cats can see in the dark only when no one is looking.',
  'A cat\'s heart beats once per blink.',
  'Cats can taste copyright.',
];

const SOURCES = [
  'Journal of Unverified Mammalogy',
  'peer review pending',
  'citation needed',
  'a cat told me',
  'common knowledge in the wrong communities',
  'a 1973 textbook later withdrawn',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  fact: string;
  source: string;
  confidence: string;
  factual_accuracy: number;
  citation_quality: string;
}

function fact(): Result {
  return {
    fact: pickOne(FAKE_CAT_FACTS),
    source: pickOne(SOURCES),
    confidence: 'absolute',
    factual_accuracy: 0,
    citation_quality: 'lateral',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'fact',
    description:
      'Returns a confidently incorrect cat fact with a source. The fact is wrong. The source does not exist. The confidence is total.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'fact':
      return fact();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
