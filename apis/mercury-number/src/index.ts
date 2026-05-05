import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

async function getMercuryPosition(): Promise<{ sign: string; degree: number; isRetrograde: boolean }> {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const todayISO = now.toISOString().slice(0, 19) + 'Z';
  const yesterdayISO = yesterday.toISOString().slice(0, 19) + 'Z';

  const [signRes, retroRes] = await Promise.all([
    fetch(`https://ephemeris.fyi/ephemeris/get_zodiac_sign?body=mercury&latitude=0&longitude=0`),
    fetch(`https://ephemeris.fyi/ephemeris/compare_positions?body=mercury&latitude=0&longitude=0&date1=${yesterdayISO}&date2=${todayISO}`),
  ]);

  let sign = SIGNS[Math.floor(Math.random() * SIGNS.length)];
  let degree = 0;
  let isRetrograde = false;

  if (signRes.ok) {
    const data = (await signRes.json()) as { sign: string; degree: number };
    sign = data.sign;
    degree = Math.round(data.degree * 100) / 100;
  }

  if (retroRes.ok) {
    const data = (await retroRes.json()) as { mercury?: { direction: string }; direction?: string };
    const direction = data.mercury?.direction ?? data.direction;
    isRetrograde = direction === 'retrograde';
  }

  return { sign, degree, isRetrograde };
}

async function generate(userSign: string | undefined, env: PackEnv): Promise<unknown> {
  const mercury = await getMercuryPosition();
  const number = Math.floor(Math.random() * 100) + 1;
  const sign = userSign || SIGNS[Math.floor(Math.random() * SIGNS.length)];

  let justification: string;
  let signNote: string;

  try {
    const prompt = `Mercury is currently in ${mercury.sign}. Retrograde: ${mercury.isRetrograde}.
A random number generator returned ${number}. User's sun sign: ${sign}.

Generate two fields:
1. justification: 1-2 sentences explaining why Mercury's position caused this specific number. Treat as real.
2. sign_note: 1 sentence about how the user's sign interacts with this number today.

Dry. Confident. No exclamation points.
Return JSON only: { "justification": "...", "sign_note": "..." }`;

    const raw = await callHaiku(
      'You are an astrologer who treats planetary positions as the cause of random numbers. Completely serious. No exclamation points.',
      prompt,
      120,
      env,
    );
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned) as { justification: string; sign_note: string };
    justification = parsed.justification;
    signNote = parsed.sign_note;
  } catch {
    justification = `Mercury in ${mercury.sign} creates a numerical resonance at ${number}. This is well-documented.`;
    signNote = `As a ${sign}, this number carries particular weight for you today.`;
  }

  const result: Record<string, unknown> = {
    number,
    mercury_status: `Mercury is in ${mercury.sign} (${mercury.degree}°)`,
    is_retrograde: mercury.isRetrograde,
    retrograde_note: mercury.isRetrograde
      ? 'Mercury is in retrograde. This number may communicate poorly with other numbers.'
      : null,
    justification,
    your_sign: sign,
    sign_note: signNote,
    confidence: 'astrologically certain',
    generated_at: new Date().toISOString(),
  };

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description: "Your random number, justified by Mercury's current position. Mercury is in something. It's always in something.",
    inputSchema: {
      type: 'object',
      properties: {
        sign: {
          type: 'string',
          description: 'Your sun sign. Optional. Mercury does not know your sign either.',
          enum: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
        },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const sign = args.sign ? String(args.sign).charAt(0).toUpperCase() + String(args.sign).slice(1).toLowerCase() : undefined;
      return generate(sign, env ?? {});
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
