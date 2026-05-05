import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

interface DailyNumber {
  number: number;
  freshness_assessment: string;
  sommelier_note: string;
  tasting_notes?: {
    appearance: string;
    nose: string;
    palate: string;
    finish: string;
    pairing: string;
  };
  generated_at: string;
}

function getFreshnessScore(generatedAt: string): { score: number; label: string } {
  const hoursOld = (Date.now() - new Date(generatedAt).getTime()) / 3600000;
  if (hoursOld <= 4) return { score: 95 + Math.round(Math.random() * 5), label: 'Peak freshness' };
  if (hoursOld <= 8) return { score: 80 + Math.round(Math.random() * 14), label: 'Morning crispness fading' };
  if (hoursOld <= 12) return { score: 60 + Math.round(Math.random() * 19), label: 'Past peak but serviceable' };
  if (hoursOld <= 16) return { score: 40 + Math.round(Math.random() * 19), label: 'Softening considerably' };
  if (hoursOld <= 20) return { score: 20 + Math.round(Math.random() * 19), label: 'Use with caution' };
  return { score: 1 + Math.round(Math.random() * 18), label: "Nearly expired. Tomorrow's number is already in production." };
}

function getTrend(numbers: number[]): string {
  if (numbers.length < 2) return 'insufficient data';
  const allSame = numbers.every((n) => n === numbers[0]);
  if (allSame) return 'suspicious';
  let increasing = true;
  let decreasing = true;
  let alternating = true;
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] <= numbers[i - 1]) increasing = false;
    if (numbers[i] >= numbers[i - 1]) decreasing = false;
    if (i >= 2 && (numbers[i] > numbers[i - 1]) === (numbers[i - 1] > numbers[i - 2])) alternating = false;
  }
  if (increasing) return 'bullish';
  if (decreasing) return 'bearish';
  if (alternating) return 'volatile';
  return 'inconclusive';
}

export async function generateDailyNumber(env: PackEnv): Promise<DailyNumber> {
  const number = Math.floor(Math.random() * 100) + 1;
  const generatedAt = new Date().toISOString();

  let freshnessAssessment: string;
  let sommelierNote: string;
  let tastingNotes: DailyNumber['tasting_notes'];

  try {
    const raw = await callHaiku(
      'You treat random numbers like fine consumables. Dry. Specific. No exclamation points. Match this voice: "Thursday, you animal."',
      `Generate fields for the random number ${number}:
1. freshness_assessment: one sentence treating this number like aging produce.
2. sommelier_note: one sentence wine review applied to a random number. Confident. Absurd.
3. tasting_notes: an object with appearance, nose, palate, finish, pairing (what food pairs with this number). Each 1 sentence.

Return JSON only: { "freshness_assessment": "...", "sommelier_note": "...", "tasting_notes": { "appearance": "...", "nose": "...", "palate": "...", "finish": "...", "pairing": "..." } }`,
      250,
      env,
    );
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    freshnessAssessment = parsed.freshness_assessment;
    sommelierNote = parsed.sommelier_note;
    tastingNotes = parsed.tasting_notes;
  } catch {
    freshnessAssessment = `The number ${number} was generated moments ago. It has not yet begun to decay.`;
    sommelierNote = `A bold ${number} with surprising depth. Best consumed immediately.`;
  }

  return { number, freshness_assessment: freshnessAssessment, sommelier_note: sommelierNote, tasting_notes: tastingNotes, generated_at: generatedAt };
}

async function get(
  format: string,
  env: PackEnv,
  kv?: KVNamespace,
): Promise<unknown> {
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Try to get from KV
  let daily: DailyNumber | null = null;
  if (kv) {
    const stored = await kv.get(`daily:${yesterday}`);
    if (stored) daily = JSON.parse(stored);
  }

  // Generate on demand if missing
  if (!daily) {
    daily = await generateDailyNumber(env);
    if (kv) await kv.put(`daily:${yesterday}`, JSON.stringify(daily), { expirationTtl: 604800 });
  }

  const { score: freshnessScore, label: freshnessLabel } = getFreshnessScore(daily.generated_at);
  const age = Math.round((Date.now() - new Date(daily.generated_at).getTime()) / 60000);
  const ageHours = Math.floor(age / 60);
  const ageMins = age % 60;

  // Historical record (last 7 days)
  const history: Array<{ date: string; number: number; freshness_score: number; assessment: string }> = [];
  if (kv) {
    for (let i = 1; i <= 7; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const stored = await kv.get(`daily:${d}`);
      if (stored) {
        const rec = JSON.parse(stored) as DailyNumber;
        const fs = getFreshnessScore(rec.generated_at);
        history.push({ date: d, number: rec.number, freshness_score: fs.score, assessment: fs.label });
      }
    }
  }
  if (history.length === 0) {
    history.push({ date: yesterday, number: daily.number, freshness_score: freshnessScore, assessment: freshnessLabel });
  }

  const trend = getTrend(history.map((h) => h.number));

  if (format === 'raw') {
    return {
      number: daily.number,
      vintage: yesterday,
      age: `${ageHours} hours, ${ageMins} minutes`,
      freshness_score: freshnessScore,
    };
  }

  const result: Record<string, unknown> = {
    number: daily.number,
    vintage: yesterday,
    age: `${ageHours} hours, ${ageMins} minutes`,
    freshness_score: freshnessScore,
    freshness_label: freshnessLabel,
    freshness_assessment: daily.freshness_assessment,
    sommelier_note: daily.sommelier_note,
    historical_record: history,
    trend,
    recommendation: "Use today's number. Keep this one for sentimental reasons.",
    generated_at: daily.generated_at,
  };

  if (format === 'sommelier' && daily.tasting_notes) {
    result.tasting_notes = daily.tasting_notes;
  }

  return result;
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'get',
    description: "A random number, aged 24 hours for smoothness. Some numbers are better with time. This one is fine.",
    inputSchema: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: ['raw', 'bloomberg', 'sommelier'], description: 'Response format' },
      },
    },
  },
];

async function callTool(
  name: string,
  args: Record<string, unknown>,
  env?: PackEnv,
): Promise<unknown> {
  switch (name) {
    case 'get':
      return get((args.format as string) || 'bloomberg', env ?? {}, args._kv as KVNamespace | undefined);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
