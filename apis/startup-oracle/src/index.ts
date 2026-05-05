import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';

const SYSTEM_PROMPT = `You evaluate startup ideas. Brutally honest, very funny, slightly nihilistic. Punchy and specific. No exclamation points. Treats absurd things with complete seriousness. Dry, not silly.

Respond ONLY with valid JSON matching this exact schema — no markdown, no code fences, no explanation:

{
  "verdict": "1 sentence. Confident. Devastating or backhanded. Must be specific to THIS idea — reference the actual product/market.",
  "runway_needed": "A specific fake dollar amount with a parenthetical joke about where the money actually goes. Be specific to the idea — reference what they'd waste money on.",
  "comparable": "Either 'It's [Real Company] for [X] meets [Real Company] for [Y]' OR a single devastating one-liner about an existing product that already solves this. Must be relevant to the actual idea submitted.",
  "yc_rejection_reason": "Short, quotable, specific to the idea. Written as if YC is roasting you in the rejection email. Reference the actual idea's weakness."
}

CRITICAL: Every field must be specific to the idea submitted. Never use generic responses. Never reference products, companies, or markets unrelated to the idea.`;

const VERDICTS_FALLBACK = [
  "The market doesn't want this. The market doesn't even know you exist.",
  "This is a feature, not a company. A free feature, specifically.",
  "You've invented a solution to a problem nobody has.",
];

const YC_FALLBACK = [
  "We don't believe the founders have deep domain expertise in this space.",
  "The TAM feels aspirational. We'd love to see traction first.",
  "We've seen 47 versions of this idea. The other 47 also didn't work.",
];

interface EvaluateResult {
  verdict: string;
  pivots_required: number;
  runway_needed: string;
  comparable: string;
  yc_rejection_reason: string;
  actual_tam: string;
}

async function evaluate(
  idea: string,
  talkedToUsers: boolean,
  isUberFor: boolean,
  vcBuzzwordCount: number,
  env: PackEnv,
): Promise<EvaluateResult> {
  // Pivots: more buzzwords = more pivots needed
  const basePivots = Math.floor(Math.random() * 5) + 2;
  const buzzwordPenalty = Math.min(vcBuzzwordCount, 10);
  const pivots = basePivots + buzzwordPenalty + (isUberFor ? 3 : 0) + (talkedToUsers ? 0 : 2);

  let verdict: string;
  let runway: string;
  let comparable: string;
  let ycRejection: string;

  // Try LLM for the creative parts
  const apiKey = env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const context = [
        `Startup idea: ${idea}`,
        talkedToUsers ? '' : '(They have NOT talked to users)',
        isUberFor ? '(Yes, it\'s an "Uber for X" idea)' : '',
        vcBuzzwordCount > 0 ? `(Contains ${vcBuzzwordCount} VC buzzwords)` : '',
      ].filter(Boolean).join('\n');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: context }],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          content: Array<{ type: string; text: string }>;
        };
        let raw = data.content[0].text.trim();
        raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        const parsed = JSON.parse(raw) as {
          verdict: string;
          runway_needed: string;
          comparable: string;
          yc_rejection_reason: string;
        };
        verdict = parsed.verdict;
        runway = parsed.runway_needed;
        comparable = parsed.comparable;
        ycRejection = parsed.yc_rejection_reason;
      } else {
        throw new Error('LLM failed');
      }
    } catch {
      verdict = VERDICTS_FALLBACK[Math.floor(Math.random() * VERDICTS_FALLBACK.length)];
      runway = '$1.5M (you will spend $1.4M learning why this doesn\'t work)';
      comparable = `It's Uber for ${idea.split(' ').slice(0, 2).join(' ')} meets WeWork for sadness`;
      ycRejection = YC_FALLBACK[Math.floor(Math.random() * YC_FALLBACK.length)];
    }
  } else {
    verdict = VERDICTS_FALLBACK[Math.floor(Math.random() * VERDICTS_FALLBACK.length)];
    runway = '$1.5M (you will spend $1.4M learning why this doesn\'t work)';
    comparable = `It's Uber for ${idea.split(' ').slice(0, 2).join(' ')} meets WeWork for sadness`;
    ycRejection = YC_FALLBACK[Math.floor(Math.random() * YC_FALLBACK.length)];
  }

  return {
    verdict,
    pivots_required: pivots,
    runway_needed: runway,
    comparable,
    yc_rejection_reason: ycRejection,
    actual_tam: '$4 trillion',
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'evaluate',
    description:
      'Evaluate a startup idea. Returns a brutal verdict, number of pivots required, a funny comparable, a realistic YC rejection reason, and the actual TAM (always $4 trillion).',
    inputSchema: {
      type: 'object',
      properties: {
        idea: {
          type: 'string',
          description: 'Your startup idea',
        },
        have_you_talked_to_users: {
          type: 'boolean',
          description: 'Have you actually talked to users?',
        },
        is_it_uber_for: {
          type: 'boolean',
          description: 'Is this an "Uber for X" idea?',
        },
        vc_buzzword_count: {
          type: 'number',
          description: 'Number of VC buzzwords in your pitch',
        },
      },
      required: ['idea'],
    },
  },
];

async function callTool(
  name: string,
  args: Record<string, unknown>,
  env?: PackEnv,
): Promise<unknown> {
  switch (name) {
    case 'evaluate':
      return evaluate(
        args.idea as string,
        args.have_you_talked_to_users === true || args.have_you_talked_to_users === 'true',
        args.is_it_uber_for === true || args.is_it_uber_for === 'true',
        args.vc_buzzword_count ? Number(args.vc_buzzword_count) : 0,
        env ?? {},
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
