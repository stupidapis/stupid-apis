import type { StupidApiExport } from '@stupid-apis/shared';

const SLOGANS = [
  'PAIN IS WEAKNESS LEAVING THE BODY',
  'THE ONLY BAD WORKOUT IS THE ONE YOU DID',
  'STRONGER THAN YESTERDAY, MARGINALLY',
  'YOU VS. THE PERSON YOU WERE 19 MINUTES AGO',
  'NO EXCUSES, JUST OPINIONS',
  'WAKE UP, COMPLAIN, LIFT, COMPLAIN',
  'YOUR BODY IS A TEMPLE; YOU OWE IT BACK RENT',
  'COMMIT, OR CONSIDER COMMITTING',
  'TRAIN INSANE, OR REMAIN IN THE GROUP CHAT',
  'EXCUSES DO NOT BURN CALORIES; NEITHER DO YOU',
  'ONE MORE REP, OR ONE FEWER, BUT WITH INTENT',
  'WORK HARD IN SILENCE; LET YOUR DOMS BE THE NOISE',
];

const CAVEATS = [
  '*rest days are also days',
  '*results may vary; results may not exist',
  '*see your doctor; the doctor will see you anyway',
  '*on weekends, this poster is hopeful, not directive',
  '*some discomfort is permitted; check with the management',
  '*this poster is not legally binding',
  '*hydration is implied throughout',
  '*lifting form is not addressed by this slogan',
];

const FONTS = [
  'all-caps Impact, slightly skewed',
  'serif italics on a cracked-asphalt photo',
  'block letters over a sunset',
  'condensed sans-serif on a barbell silhouette',
  'handwritten marker on a chalkboard background',
  'all-caps Bebas Neue, no decoration',
];

const RECOMMENDED_PLACEMENT = [
  'above the squat rack',
  'next to the water fountain',
  'on the ceiling over the bench press',
  'inside a locker, facing in',
  'at eye level by the door, for entrance only',
  'above the snack vending machine',
];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  slogan: string;
  caveat: string;
  font_recommendation: string;
  recommended_placement: string;
  print_size: string;
  energy: string;
}

const ENERGY = ['unhinged', 'committed', 'aspirational', 'lightly threatening', 'wholesome but loud'];

function print(): Result {
  return {
    slogan: pickOne(SLOGANS),
    caveat: pickOne(CAVEATS),
    font_recommendation: pickOne(FONTS),
    recommended_placement: pickOne(RECOMMENDED_PLACEMENT),
    print_size: '24 x 36 inches',
    energy: pickOne(ENERGY),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'print',
    description:
      'Returns a motivational gym poster: slogan, fine-print caveat, font recommendation, recommended placement, and energy descriptor.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'print':
      return print();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
