import type { StupidApiExport } from '@stupid-apis/shared';

// Phoenix, AZ coordinates
const LAT = 33.45;
const LON = -112.07;

async function generate(): Promise<unknown> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,apparent_temperature&temperature_unit=fahrenheit`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Phoenix is unreachable. The heat finally won.');

  const data = (await res.json()) as {
    current: { temperature_2m: number; apparent_temperature: number };
  };

  const temp = Math.round(data.current.temperature_2m);
  const feelsLike = Math.round(data.current.apparent_temperature);

  return {
    number: temp,
    source: 'Phoenix, Arizona',
    temperature: temp,
    unit: 'fahrenheit',
    disclaimer: 'This is not a weather API. This is a random number generator. The number happens to be the temperature in Phoenix. Coincidence.',
    feels_like: feelsLike,
    feels_like_note: `The number does not feel like ${feelsLike}. It feels like ${temp}. We don't do feels_like here.`,
    generated_at: new Date().toISOString(),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description: 'Returns the current temperature in Phoenix, Arizona. As a random number. This is not a weather API.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
