import type { StupidApiExport } from '@stupid-apis/shared';

const CITIES: Array<{ city: string; lat: number; lon: number }> = [
  { city: 'New York', lat: 40.71, lon: -74.01 },
  { city: 'London', lat: 51.51, lon: -0.13 },
  { city: 'Tokyo', lat: 35.68, lon: 139.69 },
  { city: 'Sydney', lat: -33.87, lon: 151.21 },
  { city: 'Cairo', lat: 30.04, lon: 31.24 },
  { city: 'São Paulo', lat: -23.55, lon: -46.63 },
  { city: 'Mumbai', lat: 19.08, lon: 72.88 },
  { city: 'Moscow', lat: 55.76, lon: 37.62 },
  { city: 'Toronto', lat: 43.65, lon: -79.38 },
  { city: 'Lagos', lat: 6.52, lon: 3.38 },
];

async function generate(unit: string): Promise<unknown> {
  const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit';

  // Fetch all cities in parallel
  const lats = CITIES.map((c) => c.lat).join(',');
  const lons = CITIES.map((c) => c.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m&temperature_unit=${tempUnit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('The weather refused to cooperate.');

  const data = (await res.json()) as Array<{ current: { temperature_2m: number } }>;

  const cities = CITIES.map((c, i) => ({
    city: c.city,
    temp: Math.round(data[i].current.temperature_2m),
  }));

  const total = cities.reduce((sum, c) => sum + c.temp, 0);
  const number = Math.abs(total) % 100;

  return {
    number,
    methodology: 'Sum of temperatures across 10 cities. Last two digits extracted. Science.',
    cities,
    total,
    unit: tempUnit,
    confidence: 'meteorologically sound',
    generated_at: new Date().toISOString(),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description: 'Fetches current temperature from 10 cities worldwide, sums them, returns last two digits. Rigorous methodology.',
    inputSchema: {
      type: 'object',
      properties: {
        unit: { type: 'string', enum: ['fahrenheit', 'celsius'], description: 'Temperature unit' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate((args.unit as string) || 'fahrenheit');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
