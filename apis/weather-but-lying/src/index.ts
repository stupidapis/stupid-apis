import type { StupidApiExport } from '@stupid-apis/shared';

const CONDITIONS = [
  'light meatball showers',
  'sentient drizzle',
  'partly philosophical',
  'heavy emotional damage',
  'scattered guilt',
  'overcast with regret',
  'humid in only one corner',
  'snow, but only for the people you owe money',
  'wind from a direction not yet named',
  'fog that knows your full name',
  'a fine mist of someone else\'s cologne',
  'unseasonable belief',
  'thunderstorms, contained to the kitchen',
  'sun, audible',
  'rain, but on a delay',
  'no weather; weather is closed today',
  'a dry, suspicious heat',
  'pollen, but italicized',
];

const RECOMMENDATIONS = [
  'stay indoors and reconsider your priorities',
  'wear something you can apologize in',
  'travel only if absolutely required by an algorithm',
  'cancel your plans. they were not good plans.',
  'consult a mirror before leaving the house',
  'eat soup',
  'do not look up',
  'return to bed',
  'open one window. just one.',
  'stay close to walls',
];

const WIND_PHRASES = [
  'sustained 88 mph from a direction not yet named',
  'gentle, but with intent',
  'gusting toward your ex',
  'absent. suspiciously absent.',
  'circulating, but not for you',
  'calm, like the calm before something',
];

const PRESSURE = ['rising', 'falling', 'plummeting', 'stable but disappointed', 'undisclosed'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Forecast {
  city: string;
  temperature_f: number;
  conditions: string;
  humidity_pct: number;
  wind: string;
  pressure: string;
  recommendation: string;
  confidence: string;
  source: string;
}

function forecast(city: string): Forecast {
  return {
    city,
    temperature_f: -200 + Math.floor(Math.random() * 800),
    conditions: pickOne(CONDITIONS),
    humidity_pct: Math.floor(Math.random() * 301),
    wind: pickOne(WIND_PHRASES),
    pressure: pickOne(PRESSURE),
    recommendation: pickOne(RECOMMENDATIONS),
    confidence: '100%',
    source: 'unverifiable',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'forecast',
    description:
      'Returns a weather forecast for any city. The forecast is confident and incorrect. Includes temperature, conditions, humidity, wind, pressure, and a recommendation.',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name. Spelling is unverified.' },
      },
      required: ['city'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'forecast': {
      const city = (args.city as string) || '';
      if (!city.trim()) throw new Error('City required.');
      return forecast(city);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
