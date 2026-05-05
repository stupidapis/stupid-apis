import type { StupidApiExport } from '@stupid-apis/shared';

interface IssResponse {
  iss_position: { latitude: string; longitude: string };
  timestamp: number;
}

async function generate(): Promise<unknown> {
  const res = await fetch('http://api.open-notify.org/iss-now.json');
  if (!res.ok) throw new Error('ISS is not responding. Typical.');

  const data = (await res.json()) as IssResponse;
  const lat = parseFloat(data.iss_position.latitude);
  const lon = parseFloat(data.iss_position.longitude);
  const raw = Math.abs(lat + lon);
  const number = Math.round(raw) % 100;

  return {
    number,
    iss_position: {
      latitude: lat,
      longitude: lon,
      timestamp: new Date(data.timestamp * 1000).toISOString(),
    },
    calculation: `abs(${lat.toFixed(2)} + ${lon.toFixed(2)}) = ${raw.toFixed(2)} → last two digits → ${number}`,
    iss_note: 'The ISS is currently over the ' +
      (Math.abs(lat) < 30 ? 'tropics' : lat > 0 ? 'northern hemisphere' : 'southern hemisphere') +
      ' and has no opinion on your number.',
    crew_consulted: false,
    orbital_velocity: '7.66 km/s — faster than your last deployment',
    generated_at: new Date().toISOString(),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description: "Fetches the ISS's current coordinates, does math, returns a number. The ISS was not consulted.",
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
