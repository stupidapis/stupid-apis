import type { StupidApiExport } from '@stupid-apis/shared';

// Honors a fictional life. Tone is dignified — the person did not exist;
// the form is treated seriously.

const FIRST_NAMES = ['Margaret', 'Henry', 'Pearl', 'Walter', 'Estelle', 'Frank', 'Beatrice', 'Lewis', 'Doris', 'Earl', 'Ruth', 'Vernon', 'Alma'];
const LAST_NAMES = ['Hollis', 'Wensley', 'Coombe', 'Trask', 'Dempsey', 'Falk', 'Ostrom', 'Brennig', 'Vail', 'Whitlock', 'Carrew'];

const HOMETOWNS = ['a small town in Iowa', 'the eastern shore', 'an unincorporated township', 'a fishing village in Maine', 'a quiet block in Rochester', 'a hill town in Pennsylvania'];

const PROFESSIONS = [
  'a typesetter and amateur clarinetist',
  'a clerk at the same hardware store for 41 years',
  'a librarian who never missed a meeting',
  'a high school choir director and church organist',
  'a veterinarian, mostly for cats',
  'an accountant who kept her books in pencil',
  'a Coast Guard reservist and Sunday driver',
  'a teacher; eighth grade, social studies',
];

const VIRTUES = [
  'patient with the impatient',
  'a careful listener',
  'a maker of small repairs',
  'someone who remembered birthdays',
  'a quiet presence in a loud room',
  'a writer of long letters in short sentences',
];

const FAMILIES = [
  'their three children, four grandchildren, and a dog who knew her name',
  'their spouse of 51 years and two daughters',
  'their brother, two nieces, and the bridge club',
  'their many former students',
  'their parish, their neighbors, and one specific armchair',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  full_name: string;
  born: string;
  passed: string;
  age: number;
  hometown: string;
  occupation: string;
  text: string;
  survived_by: string;
  service: string;
  flowers: string;
}

function generate(): Result {
  const first = pickOne(FIRST_NAMES);
  const last = pickOne(LAST_NAMES);
  const middle = pickOne([null, ...FIRST_NAMES]);
  const fullName = middle ? `${first} ${middle} ${last}` : `${first} ${last}`;
  const age = 64 + Math.floor(Math.random() * 35);
  const passedYear = 2024 - Math.floor(Math.random() * 5);
  const bornYear = passedYear - age;
  const hometown = pickOne(HOMETOWNS);
  const occupation = pickOne(PROFESSIONS);
  const virtue = pickOne(VIRTUES);
  const family = pickOne(FAMILIES);

  const text = `${fullName}, ${age}, of ${hometown}, passed peacefully in the company of family. ${first} was ${occupation}, and ${virtue}. ${first} is survived by ${family}.`;

  return {
    full_name: fullName,
    born: `${bornYear}`,
    passed: `${passedYear}`,
    age,
    hometown,
    occupation,
    text,
    survived_by: family,
    service: pickOne(['private; a celebration of life will be announced', 'open to the community on Saturday', 'family only; a notice will be mailed', 'graveside, brief']),
    flowers: pickOne(['flowers welcome', 'donations to the local library in lieu of flowers', 'donations to the animal shelter preferred', 'no flowers; bring a story']),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a dignified obituary for a fictional person. Returns name, birth/death years, age, hometown, occupation, the text, who they are survived by, service note, and flowers/donations.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
