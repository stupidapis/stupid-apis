import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const CITIES = [
  { city: 'New York', lat: 40.71, lon: -74.01 },
  { city: 'London', lat: 51.51, lon: -0.13 },
  { city: 'Tokyo', lat: 35.68, lon: 139.69 },
  { city: 'Sydney', lat: -33.87, lon: 151.21 },
  { city: 'Cairo', lat: 30.04, lon: 31.24 },
];

const LEVELS: Record<string, string> = {
  '0': 'Suspiciously calm',
  '21': 'Manageable',
  '41': 'Normal chaos',
  '61': 'Elevated',
  '81': 'Do not make decisions',
  '91': 'Stay in bed',
};

function getLevel(n: number): string {
  if (n >= 91) return 'Stay in bed';
  if (n >= 81) return 'Do not make decisions';
  if (n >= 61) return 'Elevated';
  if (n >= 41) return 'Normal chaos';
  if (n >= 21) return 'Manageable';
  return 'Suspiciously calm';
}

function getLunarPhase(): { phase: string; illumination: number } {
  const knownNew = new Date(2000, 0, 6).getTime();
  const cycle = 29.53058770576;
  const daysSince = (Date.now() - knownNew) / 86400000;
  const pos = ((daysSince % cycle) + cycle) % cycle;
  const illum = Math.round((1 - Math.cos(2 * Math.PI * pos / cycle)) / 2 * 100);

  let phase: string;
  if (pos < 1.85) phase = 'New Moon';
  else if (pos < 7.38) phase = 'Waxing Crescent';
  else if (pos < 9.23) phase = 'First Quarter';
  else if (pos < 14.77) phase = 'Waxing Gibbous';
  else if (pos < 16.61) phase = 'Full Moon';
  else if (pos < 22.15) phase = 'Waning Gibbous';
  else if (pos < 23.99) phase = 'Last Quarter';
  else phase = 'Waning Crescent';

  return { phase, illumination: illum };
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url}`);
  return res.json() as Promise<T>;
}

async function calculate(env: PackEnv): Promise<unknown> {
  // Fetch all data in parallel
  const [btcData, issData, tempData, quakeData] = await Promise.all([
    fetchJson<{ bitcoin: { usd: number } }>('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .catch(() => ({ bitcoin: { usd: 50000 + Math.random() * 30000 } })),
    fetchJson<{ iss_position: { latitude: string; longitude: string } }>('http://api.open-notify.org/iss-now.json')
      .catch(() => ({ iss_position: { latitude: String(Math.random() * 100 - 50), longitude: String(Math.random() * 360 - 180) } })),
    fetchJson<Array<{ current: { temperature_2m: number } }>>(
      `https://api.open-meteo.com/v1/forecast?latitude=${CITIES.map((c) => c.lat).join(',')}&longitude=${CITIES.map((c) => c.lon).join(',')}&current=temperature_2m&temperature_unit=fahrenheit`,
    ).catch(() => CITIES.map(() => ({ current: { temperature_2m: 60 + Math.random() * 30 } }))),
    fetchJson<{ features: Array<{ properties: { mag: number; place: string } }> }>(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    ).catch(() => ({ features: [{ properties: { mag: 1.0 + Math.random() * 3, place: 'Unknown' } }] })),
  ]);

  // Bitcoin contribution
  const btcPrice = Math.round(btcData.bitcoin.usd);
  const btcContrib = btcPrice % 100;

  // ISS contribution
  const issLat = parseFloat(issData.iss_position.latitude);
  const issLon = parseFloat(issData.iss_position.longitude);
  const issContrib = Math.abs(Math.round(issLat + issLon)) % 100;

  // Temperature contribution
  const temps = tempData.map((d) => d.current.temperature_2m);
  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  const tempContrib = Math.round(avgTemp) % 100;

  // Earthquake contribution
  const quake = quakeData.features[0]?.properties ?? { mag: 0, place: 'None recorded' };
  const quakeContrib = Math.round(quake.mag * 10);

  // Lunar contribution
  const lunar = getLunarPhase();
  const lunarContrib = lunar.illumination % 100;

  // Combine: weighted sum, last two digits
  const raw = btcContrib + issContrib + tempContrib + quakeContrib + lunarContrib;
  const chaosIndex = raw % 100;
  const level = getLevel(chaosIndex);

  // Haiku interpretation
  let interpretation: string;
  try {
    const raw2 = await callHaiku(
      'You interpret a daily chaos index. Treat it as completely real data. Dry. Specific. No exclamation points. Match this voice: "Thursday, you animal."',
      `The chaos index today is ${chaosIndex}/100 (${level}). Write one sentence interpreting what this means for the average person's day. Return JSON only: { "interpretation": "..." }`,
      80,
      env,
    );
    const cleaned = raw2.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    interpretation = JSON.parse(cleaned).interpretation;
  } catch {
    interpretation = `At ${chaosIndex}/100, the chaos is ${level.toLowerCase()}. Plan accordingly.`;
  }

  return {
    chaos_index: chaosIndex,
    level,
    interpretation,
    components: {
      bitcoin: {
        value: btcPrice,
        contribution: btcContrib,
        note: 'Crypto doing crypto things',
      },
      iss: {
        latitude: issLat,
        longitude: issLon,
        contribution: issContrib,
        note: "The ISS doesn't care about your day",
      },
      temperature: {
        average: Math.round(avgTemp * 10) / 10,
        contribution: tempContrib,
        note: 'Earth is warm. Chaos confirmed.',
      },
      earthquake: {
        magnitude: quake.mag,
        location: quake.place,
        contribution: quakeContrib,
        note: quake.mag < 3 ? 'Minor. Added to the index anyway.' : 'Notable. The earth is contributing.',
      },
      lunar_phase: {
        phase: lunar.phase,
        illumination: `${lunar.illumination}%`,
        contribution: lunarContrib,
        note: 'The moon is involved. Of course.',
      },
    },
    chaos_levels: {
      '0-20': 'Suspiciously calm',
      '21-40': 'Manageable',
      '41-60': 'Normal chaos',
      '61-80': 'Elevated',
      '81-90': 'Do not make decisions',
      '91-100': 'Stay in bed',
    },
    generated_at: new Date().toISOString(),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'calculate',
    description: 'Combines Bitcoin price, ISS coordinates, city temperatures, earthquake magnitude, and lunar phase into a single chaos score. Methodology available upon request. Please do not request it.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, _args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'calculate':
      return calculate(env ?? {});
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
