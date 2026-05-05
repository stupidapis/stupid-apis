import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

interface TarotCard {
  name: string;
  arcana: 'major' | 'minor';
  number: number;
  suit?: string;
  keywords: string[];
}

const MAJOR_ARCANA: TarotCard[] = [
  { name: 'The Fool', arcana: 'major', number: 0, keywords: ['beginnings', 'innocence', 'leap of faith'] },
  { name: 'The Magician', arcana: 'major', number: 1, keywords: ['willpower', 'creation', 'manifestation'] },
  { name: 'The High Priestess', arcana: 'major', number: 2, keywords: ['intuition', 'mystery', 'subconscious'] },
  { name: 'The Empress', arcana: 'major', number: 3, keywords: ['abundance', 'nurturing', 'nature'] },
  { name: 'The Emperor', arcana: 'major', number: 4, keywords: ['authority', 'structure', 'control'] },
  { name: 'The Hierophant', arcana: 'major', number: 5, keywords: ['tradition', 'conformity', 'institutions'] },
  { name: 'The Lovers', arcana: 'major', number: 6, keywords: ['choices', 'partnerships', 'duality'] },
  { name: 'The Chariot', arcana: 'major', number: 7, keywords: ['determination', 'willpower', 'victory'] },
  { name: 'Strength', arcana: 'major', number: 8, keywords: ['courage', 'patience', 'inner strength'] },
  { name: 'The Hermit', arcana: 'major', number: 9, keywords: ['solitude', 'introspection', 'guidance'] },
  { name: 'Wheel of Fortune', arcana: 'major', number: 10, keywords: ['cycles', 'fate', 'turning point'] },
  { name: 'Justice', arcana: 'major', number: 11, keywords: ['fairness', 'truth', 'accountability'] },
  { name: 'The Hanged Man', arcana: 'major', number: 12, keywords: ['surrender', 'perspective', 'pause'] },
  { name: 'Death', arcana: 'major', number: 13, keywords: ['transformation', 'endings', 'transition'] },
  { name: 'Temperance', arcana: 'major', number: 14, keywords: ['balance', 'moderation', 'patience'] },
  { name: 'The Devil', arcana: 'major', number: 15, keywords: ['bondage', 'materialism', 'shadow self'] },
  { name: 'The Tower', arcana: 'major', number: 16, keywords: ['upheaval', 'revelation', 'chaos'] },
  { name: 'The Star', arcana: 'major', number: 17, keywords: ['hope', 'inspiration', 'serenity'] },
  { name: 'The Moon', arcana: 'major', number: 18, keywords: ['illusion', 'fear', 'subconscious'] },
  { name: 'The Sun', arcana: 'major', number: 19, keywords: ['joy', 'success', 'vitality'] },
  { name: 'Judgement', arcana: 'major', number: 20, keywords: ['rebirth', 'reflection', 'reckoning'] },
  { name: 'The World', arcana: 'major', number: 21, keywords: ['completion', 'achievement', 'wholeness'] },
];

const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const RANKS = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
const SUIT_KEYWORDS: Record<string, string[]> = {
  Wands: ['passion', 'energy', 'action'],
  Cups: ['emotion', 'intuition', 'relationships'],
  Swords: ['intellect', 'conflict', 'truth'],
  Pentacles: ['material', 'security', 'craft'],
};

function buildMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  for (const suit of SUITS) {
    for (let i = 0; i < RANKS.length; i++) {
      cards.push({
        name: `${RANKS[i]} of ${suit}`,
        arcana: 'minor',
        number: i + 1,
        suit,
        keywords: SUIT_KEYWORDS[suit],
      });
    }
  }
  return cards;
}

const FULL_DECK = [...MAJOR_ARCANA, ...buildMinorArcana()];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawCard(): { card: TarotCard; orientation: string } {
  return {
    card: pick(FULL_DECK),
    orientation: Math.random() < 0.5 ? 'upright' : 'reversed',
  };
}

async function interpretCard(
  card: TarotCard,
  orientation: string,
  question: string | undefined,
  env: PackEnv,
): Promise<{ interpretation: string; warning?: string; advice: string }> {
  try {
    const prompt = `A tarot reading. Card drawn: ${card.name} (${orientation}). Keywords: ${card.keywords.join(', ')}.
Question asked: '${question || 'unspecified'}'.

Generate fields:
1. interpretation: 2 sentences. Treat the card as completely real and significant. Specific to the question if provided.
2. warning: 1 sentence. ${card.arcana === 'major' ? 'This is major arcana — provide an ominous warning.' : 'This is minor arcana — set to null.'}
3. advice: 1 sentence. Actionable. Slightly absurd.

Dry, confident, no exclamation points.
Return JSON only: { "interpretation": "...", "warning": ${card.arcana === 'major' ? '"..."' : 'null'}, "advice": "..." }`;

    const raw = await callHaiku(
      'You interpret tarot cards. You treat them as completely real. Dry. Confident. No exclamation points. Match this voice: "The cat knew too much."',
      prompt,
      150,
      env,
    );
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      interpretation: `The ${card.name} appears ${orientation}. The cards have spoken.`,
      warning: card.arcana === 'major' ? 'Major arcana demands attention. Ignore at your own risk.' : undefined,
      advice: 'Consider the card. Then do whatever you were going to do anyway.',
    };
  }
}

async function pull(
  question: string | undefined,
  spread: string,
  env: PackEnv,
): Promise<unknown> {
  if (spread === 'past_present_future') {
    const draws = [drawCard(), drawCard(), drawCard()];
    const labels = ['past', 'present', 'future'];
    const cards = await Promise.all(
      draws.map(async (d, i) => {
        const interp = await interpretCard(d.card, d.orientation, question, env);
        return {
          position: labels[i],
          card: { name: d.card.name, arcana: d.card.arcana, number: d.card.number, keywords: d.card.keywords },
          orientation: d.orientation,
          ...interp,
        };
      }),
    );

    return {
      question: question || 'The cards were drawn without a question. They answered anyway.',
      spread: 'past_present_future',
      cards,
      generated_at: new Date().toISOString(),
    };
  }

  // Single card
  const { card, orientation } = drawCard();
  const interp = await interpretCard(card, orientation, question, env);

  return {
    question: question || 'The cards were drawn without a question. They answered anyway.',
    card: { name: card.name, arcana: card.arcana, number: card.number, keywords: card.keywords },
    orientation,
    ...interp,
    generated_at: new Date().toISOString(),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'pull',
    description: 'Draw a tarot card from the 78-card deck. Interprets it for your situation. Accuracy not guaranteed. Refunds not available.',
    inputSchema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Your question for the cards. Optional. The cards do not care.' },
        spread: { type: 'string', enum: ['single', 'past_present_future'], description: 'Card spread type' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'pull':
      return pull(args.question as string | undefined, (args.spread as string) || 'single', env ?? {});
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
