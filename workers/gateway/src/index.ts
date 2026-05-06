import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import magic8ball from '@stupid-apis/magic-8-ball';
import shipOnFriday from '@stupid-apis/ship-on-friday';
import emojiOracle from '@stupid-apis/emoji-oracle';
import schrodingers from '@stupid-apis/schrodingers-boolean';
import sendThatEmail from '@stupid-apis/send-that-email';
import takeTheMeeting from '@stupid-apis/take-the-meeting';
import startupOracle from '@stupid-apis/startup-oracle';
import buzzwordDensity from '@stupid-apis/buzzword-density';
import passiveAggression from '@stupid-apis/passive-aggression';
import couldHaveBeenEmail from '@stupid-apis/could-have-been-email';
import jargonTranslator from '@stupid-apis/jargon-translator';
import temperatureRandom from '@stupid-apis/temperature-random';
import phoenixNumber from '@stupid-apis/phoenix-number';
import chaosIndex from '@stupid-apis/chaos-index';
import tarotDraw from '@stupid-apis/tarot-draw';
import mercuryNumber from '@stupid-apis/mercury-number';
import issNumber from '@stupid-apis/iss-number';
import alwaysSeven from '@stupid-apis/always-seven';
import screamVoid from '@stupid-apis/scream-void';
import theCommittee from '@stupid-apis/the-committee';
import yesterdaysNumber from '@stupid-apis/yesterdays-number';
import { generateDailyNumber } from '@stupid-apis/yesterdays-number';
import corporateApology from '@stupid-apis/corporate-apology';
import performanceReview from '@stupid-apis/performance-review';
import linkedinHumblebrag from '@stupid-apis/linkedin-humblebrag';
import ycRejection from '@stupid-apis/yc-rejection';
import pressRelease from '@stupid-apis/press-release';
import apology from '@stupid-apis/apology';
import excuse from '@stupid-apis/excuse';
import tinderBio from '@stupid-apis/tinder-bio';
import shakespeareInsult from '@stupid-apis/shakespeare-insult';
import victorianComplaint from '@stupid-apis/victorian-complaint';
import conspiracyTheory from '@stupid-apis/conspiracy-theory';
import socialEntropy from '@stupid-apis/social-entropy';
import fortuneCookie from '@stupid-apis/fortune-cookie';
import dadJoke from '@stupid-apis/dad-joke';
import rubberDuck from '@stupid-apis/rubber-duck';
import weatherButLying from '@stupid-apis/weather-but-lying';
import emotionalSupportRock from '@stupid-apis/emotional-support-rock';
import fakeHoroscope from '@stupid-apis/fake-horoscope';
import corporateBuzzword from '@stupid-apis/corporate-buzzword';
import pickupLine from '@stupid-apis/pickup-line';
import medievalJobTitle from '@stupid-apis/medieval-job-title';
import catFactButFake from '@stupid-apis/cat-fact-but-fake';
import bandName from '@stupid-apis/band-name';
import fakeChangelog from '@stupid-apis/fake-changelog';
import wouldYouRather from '@stupid-apis/would-you-rather';
import wisdomOfTheAncients from '@stupid-apis/wisdom-of-the-ancients';
import roastMe from '@stupid-apis/roast-me';
import fakeRecipe from '@stupid-apis/fake-recipe';
import zodiacButWorse from '@stupid-apis/zodiac-but-worse';
import dreamInterpreter from '@stupid-apis/dream-interpreter';
import truthOrDare from '@stupid-apis/truth-or-dare';
import fakeCocktail from '@stupid-apis/fake-cocktail';
import apiErrorPoem from '@stupid-apis/api-error-poem';
import complimentGenerator from '@stupid-apis/compliment-generator';
import winePairingButWrong from '@stupid-apis/wine-pairing-but-wrong';
import fakeTedTalk from '@stupid-apis/fake-ted-talk';
import badLifeAdvice from '@stupid-apis/bad-life-advice';
import howManyLicks from '@stupid-apis/how-many-licks';
import fakeHistoricalEvent from '@stupid-apis/fake-historical-event';
import inspirationalQuote from '@stupid-apis/inspirational-quote';
import alignmentChart from '@stupid-apis/alignment-chart';
import fakeConferenceTalk from '@stupid-apis/fake-conference-talk';
import fakeTranslation from '@stupid-apis/fake-translation';
import villainMonologue from '@stupid-apis/villain-monologue';
import roastMyResume from '@stupid-apis/roast-my-resume';
import fakeMuseumPlaque from '@stupid-apis/fake-museum-plaque';
import fakeNewsHeadline from '@stupid-apis/fake-news-headline';
import insultMyCode from '@stupid-apis/insult-my-code';
import fakeRestaurantMenu from '@stupid-apis/fake-restaurant-menu';
import whatWouldXSay from '@stupid-apis/what-would-x-say';
import bandBreakupReason from '@stupid-apis/band-breakup-reason';
import personalityTest from '@stupid-apis/personality-test';
import rateMyUsername from '@stupid-apis/rate-my-username';
import fakeStackTrace from '@stupid-apis/fake-stack-trace';
import fakeEtymology from '@stupid-apis/fake-etymology';
import fakeProductReview from '@stupid-apis/fake-product-review';
import fakeSelfHelpBook from '@stupid-apis/fake-self-help-book';
import breakupTextGenerator from '@stupid-apis/breakup-text-generator';
import whatAmIDoingWithMyLife from '@stupid-apis/what-am-i-doing-with-my-life';
import rejectionLetter from '@stupid-apis/rejection-letter';
import fakeInstructions from '@stupid-apis/fake-instructions';
import fakeErrorMessage from '@stupid-apis/fake-error-message';
import fakePressQuote from '@stupid-apis/fake-press-quote';
import fakeTournamentBracket from '@stupid-apis/fake-tournament-bracket';
import gymPoster from '@stupid-apis/gym-poster';
import fakeNutritionLabel from '@stupid-apis/fake-nutrition-label';
import fakeAirbnbListing from '@stupid-apis/fake-airbnb-listing';
import fakeYelpReview from '@stupid-apis/fake-yelp-review';
import fakePodcastName from '@stupid-apis/fake-podcast-name';
import fakePropertyListing from '@stupid-apis/fake-property-listing';
import fakeObituary from '@stupid-apis/fake-obituary';
import fakeJobListing from '@stupid-apis/fake-job-listing';
import fakePassportStamp from '@stupid-apis/fake-passport-stamp';
import fakeBumperSticker from '@stupid-apis/fake-bumper-sticker';
import fakeWarningLabel from '@stupid-apis/fake-warning-label';
import fakeCurseWord from '@stupid-apis/fake-curse-word';
import fakeLicenseAgreement from '@stupid-apis/fake-license-agreement';
import fakeHaikuMachine from '@stupid-apis/fake-haiku-machine';
import fakeCoffeeOrder from '@stupid-apis/fake-coffee-order';

// ── Types ─────────────────────────────────────────────────────

interface Env {
  ANTHROPIC_API_KEY: string;
  REDDIT_CLIENT_ID: string;
  REDDIT_CLIENT_SECRET: string;
  RATE_LIMIT: KVNamespace;
  RESEND_API_KEY?: string;       // secret: wrangler secret put RESEND_API_KEY
  NOTIFY_EMAIL?: string;         // [vars] in wrangler.toml
  FROM_EMAIL?: string;           // [vars] in wrangler.toml
  ADMIN_SECRET?: string;         // secret: wrangler secret put ADMIN_SECRET — gates /__admin/*
  STRIPE_WEBHOOK_SECRET?: string; // secret: wrangler secret put STRIPE_WEBHOOK_SECRET — verifies /__stripe/webhook
}

interface ApiPack {
  slug: string;
  module: StupidApiExport;
  rateLimit?: number;     // max calls per IP per day (0 = unlimited)
  category?: string;      // shared category rate limit group
  releaseDate?: string;   // YYYY-MM-DD UTC. Omitted = always released. Future = hidden from public surfaces; direct /{slug}/* still works.
}

// ── API Registry ──────────────────────────────────────────────

const API_PACKS: ApiPack[] = [
  // Decision Makers
  { slug: 'magic-8-ball', module: magic8ball },
  { slug: 'ship-on-friday', module: shipOnFriday },
  { slug: 'emoji-oracle', module: emojiOracle, rateLimit: 20 },
  { slug: 'schrodingers-boolean', module: schrodingers },
  { slug: 'send-that-email', module: sendThatEmail },
  { slug: 'take-the-meeting', module: takeTheMeeting },
  { slug: 'startup-oracle', module: startupOracle, rateLimit: 20 },
  // Text Analysis
  { slug: 'buzzword-density', module: buzzwordDensity, category: 'text-analysis' },
  { slug: 'passive-aggression', module: passiveAggression, category: 'text-analysis' },
  { slug: 'could-have-been-email', module: couldHaveBeenEmail, category: 'text-analysis' },
  { slug: 'jargon-translator', module: jargonTranslator, category: 'text-analysis' },
  // Randomness Generators
  { slug: 'temperature-random', module: temperatureRandom, category: 'randomness' },
  { slug: 'phoenix-number', module: phoenixNumber, category: 'randomness' },
  { slug: 'chaos-index', module: chaosIndex, category: 'randomness' },
  { slug: 'tarot-draw', module: tarotDraw, category: 'randomness' },
  { slug: 'mercury-number', module: mercuryNumber, category: 'randomness' },
  { slug: 'iss-number', module: issNumber, category: 'randomness' },
  { slug: 'always-seven', module: alwaysSeven, category: 'randomness' },
  { slug: 'scream-void', module: screamVoid, category: 'randomness' },
  { slug: 'the-committee', module: theCommittee, category: 'randomness' },
  { slug: 'yesterdays-number', module: yesterdaysNumber, category: 'randomness' },
  // Generators
  { slug: 'corporate-apology', module: corporateApology, category: 'generators' },
  { slug: 'performance-review', module: performanceReview, category: 'generators' },
  { slug: 'linkedin-humblebrag', module: linkedinHumblebrag, category: 'generators' },
  { slug: 'yc-rejection', module: ycRejection, category: 'generators' },
  { slug: 'press-release', module: pressRelease, category: 'generators' },
  { slug: 'apology', module: apology, category: 'generators' },
  { slug: 'excuse', module: excuse, category: 'generators' },
  { slug: 'tinder-bio', module: tinderBio, category: 'generators' },
  { slug: 'shakespeare-insult', module: shakespeareInsult, category: 'generators' },
  { slug: 'victorian-complaint', module: victorianComplaint, category: 'generators' },
  { slug: 'conspiracy-theory', module: conspiracyTheory, category: 'generators' },
  // Social
  { slug: 'social-entropy', module: socialEntropy, category: 'randomness' },
  // Daily drops
  { slug: 'fortune-cookie', module: fortuneCookie, releaseDate: '2026-05-05' },
  { slug: 'dad-joke', module: dadJoke, releaseDate: '2026-05-06' },
  { slug: 'rubber-duck', module: rubberDuck, releaseDate: '2026-05-07' },
  { slug: 'weather-but-lying', module: weatherButLying, releaseDate: '2026-05-08' },
  { slug: 'emotional-support-rock', module: emotionalSupportRock, releaseDate: '2026-05-09' },
  { slug: 'fake-horoscope', module: fakeHoroscope, releaseDate: '2026-05-10' },
  { slug: 'corporate-buzzword', module: corporateBuzzword, releaseDate: '2026-05-11' },
  { slug: 'pickup-line', module: pickupLine, releaseDate: '2026-05-12' },
  { slug: 'medieval-job-title', module: medievalJobTitle, releaseDate: '2026-05-13' },
  { slug: 'cat-fact-but-fake', module: catFactButFake, releaseDate: '2026-05-14' },
  { slug: 'band-name', module: bandName, releaseDate: '2026-05-15' },
  { slug: 'fake-changelog', module: fakeChangelog, releaseDate: '2026-05-16' },
  { slug: 'would-you-rather', module: wouldYouRather, releaseDate: '2026-05-17' },
  { slug: 'wisdom-of-the-ancients', module: wisdomOfTheAncients, releaseDate: '2026-05-18' },
  { slug: 'roast-me', module: roastMe, releaseDate: '2026-05-19' },
  { slug: 'fake-recipe', module: fakeRecipe, releaseDate: '2026-05-20' },
  { slug: 'zodiac-but-worse', module: zodiacButWorse, releaseDate: '2026-05-21' },
  { slug: 'dream-interpreter', module: dreamInterpreter, releaseDate: '2026-05-22' },
  { slug: 'truth-or-dare', module: truthOrDare, releaseDate: '2026-05-23' },
  { slug: 'fake-cocktail', module: fakeCocktail, releaseDate: '2026-05-24' },
  { slug: 'api-error-poem', module: apiErrorPoem, releaseDate: '2026-05-25' },
  { slug: 'compliment-generator', module: complimentGenerator, releaseDate: '2026-05-26' },
  { slug: 'wine-pairing-but-wrong', module: winePairingButWrong, releaseDate: '2026-05-27' },
  { slug: 'fake-ted-talk', module: fakeTedTalk, releaseDate: '2026-05-28' },
  { slug: 'bad-life-advice', module: badLifeAdvice, releaseDate: '2026-05-29' },
  { slug: 'how-many-licks', module: howManyLicks, releaseDate: '2026-05-30' },
  { slug: 'fake-historical-event', module: fakeHistoricalEvent, releaseDate: '2026-05-31' },
  { slug: 'inspirational-quote', module: inspirationalQuote, releaseDate: '2026-06-01' },
  { slug: 'alignment-chart', module: alignmentChart, releaseDate: '2026-06-02' },
  { slug: 'fake-conference-talk', module: fakeConferenceTalk, releaseDate: '2026-06-03' },
  { slug: 'fake-translation', module: fakeTranslation, releaseDate: '2026-06-04' },
  { slug: 'villain-monologue', module: villainMonologue, releaseDate: '2026-06-05' },
  { slug: 'roast-my-resume', module: roastMyResume, releaseDate: '2026-06-06' },
  { slug: 'fake-museum-plaque', module: fakeMuseumPlaque, releaseDate: '2026-06-07' },
  { slug: 'fake-news-headline', module: fakeNewsHeadline, releaseDate: '2026-06-08' },
  { slug: 'insult-my-code', module: insultMyCode, releaseDate: '2026-06-09' },
  { slug: 'fake-restaurant-menu', module: fakeRestaurantMenu, releaseDate: '2026-06-10' },
  { slug: 'what-would-x-say', module: whatWouldXSay, releaseDate: '2026-06-11' },
  { slug: 'band-breakup-reason', module: bandBreakupReason, releaseDate: '2026-06-12' },
  { slug: 'personality-test', module: personalityTest, releaseDate: '2026-06-13' },
  { slug: 'rate-my-username', module: rateMyUsername, releaseDate: '2026-06-14' },
  { slug: 'fake-stack-trace', module: fakeStackTrace, releaseDate: '2026-06-15' },
  { slug: 'fake-etymology', module: fakeEtymology, releaseDate: '2026-06-16' },
  { slug: 'fake-product-review', module: fakeProductReview, releaseDate: '2026-06-17' },
  { slug: 'fake-self-help-book', module: fakeSelfHelpBook, releaseDate: '2026-06-18' },
  { slug: 'breakup-text-generator', module: breakupTextGenerator, releaseDate: '2026-06-19' },
  { slug: 'what-am-i-doing-with-my-life', module: whatAmIDoingWithMyLife, releaseDate: '2026-06-20' },
  { slug: 'rejection-letter', module: rejectionLetter, releaseDate: '2026-06-21' },
  { slug: 'fake-instructions', module: fakeInstructions, releaseDate: '2026-06-22' },
  { slug: 'fake-error-message', module: fakeErrorMessage, releaseDate: '2026-06-23' },
  { slug: 'fake-press-quote', module: fakePressQuote, releaseDate: '2026-06-24' },
  { slug: 'fake-tournament-bracket', module: fakeTournamentBracket, releaseDate: '2026-06-25' },
  { slug: 'gym-poster', module: gymPoster, releaseDate: '2026-06-26' },
  { slug: 'fake-nutrition-label', module: fakeNutritionLabel, releaseDate: '2026-06-27' },
  { slug: 'fake-airbnb-listing', module: fakeAirbnbListing, releaseDate: '2026-06-28' },
  { slug: 'fake-yelp-review', module: fakeYelpReview, releaseDate: '2026-06-29' },
  { slug: 'fake-podcast-name', module: fakePodcastName, releaseDate: '2026-06-30' },
  { slug: 'fake-property-listing', module: fakePropertyListing, releaseDate: '2026-07-01' },
  { slug: 'fake-obituary', module: fakeObituary, releaseDate: '2026-07-02' },
  { slug: 'fake-job-listing', module: fakeJobListing, releaseDate: '2026-07-03' },
  { slug: 'fake-passport-stamp', module: fakePassportStamp, releaseDate: '2026-07-04' },
  { slug: 'fake-bumper-sticker', module: fakeBumperSticker, releaseDate: '2026-07-05' },
  { slug: 'fake-warning-label', module: fakeWarningLabel, releaseDate: '2026-07-06' },
  { slug: 'fake-curse-word', module: fakeCurseWord, releaseDate: '2026-07-07' },
  { slug: 'fake-license-agreement', module: fakeLicenseAgreement, releaseDate: '2026-07-08' },
  { slug: 'fake-haiku-machine', module: fakeHaikuMachine, releaseDate: '2026-07-09' },
  { slug: 'fake-coffee-order', module: fakeCoffeeOrder, releaseDate: '2026-07-10' },
];

// ── Release Gating ────────────────────────────────────────────

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function isReleased(pack: ApiPack, today: string = todayUTC()): boolean {
  return !pack.releaseDate || pack.releaseDate <= today;
}

function publicPacks(today: string = todayUTC()): ApiPack[] {
  return API_PACKS.filter((p) => isReleased(p, today));
}

// Deterministic date-seeded index — same date always picks the same pack
function dateHashIndex(today: string, length: number): number {
  let h = 0;
  for (let i = 0; i < today.length; i++) h = ((h << 5) - h) + today.charCodeAt(i);
  return Math.abs(h) % length;
}

interface DailyDrop {
  date: string;
  is_new_release: boolean;
  slug: string;
  category: string | null;
  tools: ApiPack['module']['tools'];
  mcp_url: string;
  rest_base: string;
}

function computeDailyDrop(today: string = todayUTC()): DailyDrop | null {
  const todaysRelease = API_PACKS.find((p) => p.releaseDate === today);
  const released = publicPacks(today);
  if (released.length === 0) return null;

  const pack = todaysRelease ?? released[dateHashIndex(today, released.length)];

  return {
    date: today,
    is_new_release: !!todaysRelease && todaysRelease.slug === pack.slug,
    slug: pack.slug,
    category: pack.category ?? null,
    tools: pack.module.tools,
    mcp_url: `https://api.stupidapis.com/${pack.slug}/mcp`,
    rest_base: `https://api.stupidapis.com/${pack.slug}`,
  };
}

// ── Email Notification (Resend) ───────────────────────────────

function prettySlug(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

async function sendDropEmail(env: Env, drop: DailyDrop): Promise<{ id?: string }> {
  const apiKey = env.RESEND_API_KEY;
  const to = env.NOTIFY_EMAIL;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  if (!to) throw new Error('NOTIFY_EMAIL not set');

  const name = prettySlug(drop.slug);
  const tagline = drop.tools[0]?.description ?? 'A new stupid API.';
  const sampleTool = drop.tools[0]?.name ?? '';
  const sampleUrl = sampleTool ? `${drop.rest_base}/${sampleTool}` : drop.rest_base;

  const subject = `🥠 New stupid API: ${name}`;
  const text = `A new stupid API has joined the catalog.

Today's drop: ${name}
${tagline}

Try it:
  curl "${sampleUrl}"

Page: https://stupidapis.com/apis/${drop.slug}.html
MCP:  ${drop.mcp_url}

— The Cron`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL ?? 'Stupid APIs <onboarding@resend.dev>',
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API ${response.status}: ${body}`);
  }
  return (await response.json()) as { id?: string };
}

// ── Stripe Webhook Fulfillment ────────────────────────────────

// Verify Stripe's signature on the raw request body.
// Format: "t=<unix_ts>,v1=<hex_sig>,..." (may include older v0 signatures)
async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const parts = signature.split(',').reduce<Record<string, string[]>>((acc, p) => {
    const [k, v] = p.split('=');
    if (!k || !v) return acc;
    (acc[k] ||= []).push(v);
    return acc;
  }, {});

  const ts = parts.t?.[0];
  const v1Sigs = parts.v1 ?? [];
  if (!ts || v1Sigs.length === 0) return false;

  // Reject signatures older than 5 minutes to prevent replay
  const tsNum = parseInt(ts, 10);
  if (!Number.isFinite(tsNum) || Math.abs(Date.now() / 1000 - tsNum) > 300) return false;

  const signed = `${ts}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed));
  const expected = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time compare against any of the v1 sigs (Stripe rotates)
  for (const candidate of v1Sigs) {
    if (candidate.length !== expected.length) continue;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ candidate.charCodeAt(i);
    }
    if (diff === 0) return true;
  }
  return false;
}

function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return 'stupid_' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendKeyEmail(env: Env, to: string, apiKey: string, amountCents: number, currency: string): Promise<{ id?: string }> {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');
  const formatted = `$${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  const subject = '🥠 Receipt: you paid us for stupid APIs';
  const text = `You did it. You paid us for stupid APIs (${formatted}).

Here is your API key:
  ${apiKey}

Use it like this:
  curl -H "x-api-key: ${apiKey}" "https://api.stupidapis.com/dad-joke/tell"

What you get:
- Skipped rate limits across all of our deliberately absurd APIs
- The same APIs everyone else has access to
- A small private satisfaction we cannot describe

What you do not get:
- Better APIs. There are no better APIs.
- A different version of the website.
- Tier-specific features. We sell tiers as a joke. The key is the key.

Save this key somewhere. We cannot recover it for you.

— The Receipt`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL ?? 'Stupid APIs <onboarding@resend.dev>',
      to,
      subject,
      text,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API ${response.status}: ${body}`);
  }
  return (await response.json()) as { id?: string };
}

interface StripeCheckoutSession {
  id: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
}

// Stupid APIs Payment Links carry tier metadata (e.g. tier=somebodys-budget,
// stupidity=4). Pipeworx purchases use credits_amount + account_id and don't
// carry "tier", so a presence check on session.metadata.tier cleanly
// separates them.

// Slugs that need KV passthrough
const KV_SLUGS = new Set(['yesterdays-number']);

// Category rate limits: requests per minute per IP
const CATEGORY_LIMITS: Record<string, number> = {
  'text-analysis': 5,
  'randomness': 20,
  'generators': 5,
};

// Tool lookup: "slug/toolName" → entry
const TOOL_REGISTRY = new Map<
  string,
  { slug: string; callTool: StupidApiExport['callTool']; rateLimit: number; category?: string; releaseDate?: string }
>();

for (const pack of API_PACKS) {
  for (const tool of pack.module.tools) {
    TOOL_REGISTRY.set(`${pack.slug}/${tool.name}`, {
      slug: pack.slug,
      callTool: pack.module.callTool,
      rateLimit: pack.rateLimit ?? 0,
      category: pack.category,
      releaseDate: pack.releaseDate,
    });
  }
}

// When a slug is supplied, direct-access entries are always findable (pre-release works
// if you know the slug). Without a slug (global /mcp), unreleased entries are hidden.
function findTool(toolName: string, slug?: string) {
  if (slug) return TOOL_REGISTRY.get(`${slug}/${toolName}`);
  const today = todayUTC();
  for (const [key, entry] of TOOL_REGISTRY) {
    if (!key.endsWith(`/${toolName}`)) continue;
    if (entry.releaseDate && entry.releaseDate > today) continue;
    return entry;
  }
  return undefined;
}

// ── Auth ──────────────────────────────────────────────────────

type Tier = 'anonymous' | 'partner';

interface AuthContext {
  tier: Tier;
  identifier: string; // IP for anonymous, key name for partner
}

async function resolveAuth(request: Request, kv: KVNamespace): Promise<AuthContext> {
  const apiKey = request.headers.get('x-api-key')
    ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    ?? new URL(request.url).searchParams.get('apikey');

  if (apiKey) {
    const stored = await kv.get(`apikey:${apiKey}`);
    if (stored) {
      const { name } = JSON.parse(stored) as { name: string };
      return { tier: 'partner', identifier: name };
    }
  }

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  return { tier: 'anonymous', identifier: ip };
}

// ── Rate Limiting ─────────────────────────────────────────────

async function checkDailyLimit(
  kv: KVNamespace,
  ip: string,
  slug: string,
  limit: number,
): Promise<{ allowed: boolean }> {
  if (limit <= 0) return { allowed: true };
  const key = `rl:${slug}:${ip}:${new Date().toISOString().slice(0, 10)}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  if (current >= limit) return { allowed: false };
  await kv.put(key, String(current + 1), { expirationTtl: 90000 });
  return { allowed: true };
}

async function checkCategoryLimit(
  kv: KVNamespace,
  ip: string,
  category: string,
  limit: number,
): Promise<{ allowed: boolean }> {
  // Per-minute window
  const minute = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  const key = `rl:cat:${category}:${ip}:${minute}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  if (current >= limit) return { allowed: false };
  await kv.put(key, String(current + 1), { expirationTtl: 120 });
  return { allowed: true };
}

// ── Helpers ───────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'cache-control': 'no-store',
    },
  });
}

function jsonRpc(id: unknown, result: unknown): Response {
  return json({ jsonrpc: '2.0', id, result });
}

function jsonRpcError(id: unknown, code: number, message: string): Response {
  return json({ jsonrpc: '2.0', id, error: { code, message } });
}

const RATE_LIMIT_429 = {
  error: 'The oracle is overwhelmed',
  retry_after: 60,
  suggestion: 'Perhaps use this time to reconsider whether you needed this API at all',
};

// ── Routing ───────────────────────────────────────────────────

function getTools(slug?: string) {
  if (slug) {
    const pack = API_PACKS.find((p) => p.slug === slug);
    if (!pack) return null;
    return pack.module.tools;
  }
  return publicPacks().flatMap((p) => p.module.tools);
}

// ── Counters ──────────────────────────────────────────────────

async function incrementCounter(kv: KVNamespace, slug: string): Promise<void> {
  const key = `counter:${slug}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  await kv.put(key, String(current + 1));
}

async function incrementGlobalCounter(kv: KVNamespace): Promise<void> {
  const key = 'counter:_total';
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  await kv.put(key, String(current + 1));
}

async function getStats(kv: KVNamespace): Promise<Record<string, unknown>> {
  const slugs = API_PACKS.map((p) => p.slug);
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const val = parseInt((await kv.get(`counter:${slug}`)) ?? '0', 10);
      return [slug, val] as [string, number];
    }),
  );
  const total = parseInt((await kv.get('counter:_total')) ?? '0', 10);
  const bySlug = Object.fromEntries(entries);
  const byCategory: Record<string, number> = {};
  for (const pack of API_PACKS) {
    const cat = pack.category ?? 'uncategorized';
    byCategory[cat] = (byCategory[cat] ?? 0) + (bySlug[pack.slug] ?? 0);
  }

  return { total, by_slug: bySlug, by_category: byCategory, apis: slugs.length };
}

// ── Execute tool with rate limiting + env ─────────────────────

async function executeToolCall(
  toolName: string,
  toolArgs: Record<string, unknown>,
  env: Env,
  auth: AuthContext,
  slug?: string,
): Promise<{ result?: unknown; error?: unknown; status?: number }> {
  const entry = findTool(toolName, slug);
  if (!entry) return { error: `Unknown tool: ${toolName}`, status: 404 };

  // Partners skip rate limits
  if (auth.tier === 'anonymous') {
    // Category rate limit (per-minute)
    if (entry.category && CATEGORY_LIMITS[entry.category]) {
      const rl = await checkCategoryLimit(env.RATE_LIMIT, auth.identifier, entry.category, CATEGORY_LIMITS[entry.category]);
      if (!rl.allowed) return { error: RATE_LIMIT_429, status: 429 };
    }

    // Per-slug daily rate limit
    if (entry.rateLimit > 0) {
      const rl = await checkDailyLimit(env.RATE_LIMIT, auth.identifier, entry.slug, entry.rateLimit);
      if (!rl.allowed) {
        return {
          error: `Rate limited. The ${entry.slug} oracle rests. Try again tomorrow.`,
          status: 429,
        };
      }
    }
  }

  const packEnv: PackEnv = {
    ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
    REDDIT_CLIENT_ID: env.REDDIT_CLIENT_ID ?? '',
    REDDIT_CLIENT_SECRET: env.REDDIT_CLIENT_SECRET ?? '',
  };

  // Inject KV for packs that need it
  const args = KV_SLUGS.has(entry.slug)
    ? { ...toolArgs, _kv: env.RATE_LIMIT }
    : toolArgs;

  const result = await entry.callTool(toolName, args, packEnv);

  // Fire-and-forget counter increment
  void Promise.all([incrementCounter(env.RATE_LIMIT, entry.slug), incrementGlobalCounter(env.RATE_LIMIT)]).catch(() => {});

  return { result };
}

// ── MCP JSON-RPC Handler ──────────────────────────────────────

async function handleMcp(
  request: Request,
  env: Env,
  slug?: string,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type, x-api-key, authorization',
      },
    });
  }

  if (request.method !== 'POST') {
    return jsonRpcError(null, -32600, 'POST required');
  }

  const body = (await request.json()) as {
    jsonrpc: string;
    id: unknown;
    method: string;
    params?: Record<string, unknown>;
  };

  const { id, method, params } = body;

  switch (method) {
    case 'initialize':
      return jsonRpc(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: slug ? `stupid-apis/${slug}` : 'stupid-apis',
          version: '0.0.1',
        },
      });

    case 'tools/list': {
      const tools = getTools(slug);
      if (!tools) return jsonRpcError(id, -32602, `Unknown API: ${slug}`);
      return jsonRpc(id, { tools });
    }

    case 'tools/call': {
      const toolName = (params as { name: string })?.name;
      const toolArgs =
        ((params as { arguments?: Record<string, unknown> })?.arguments) ?? {};

      const entry = findTool(toolName, slug);
      if (!entry) return jsonRpcError(id, -32602, `Unknown tool: ${toolName}`);

      const auth = await resolveAuth(request, env.RATE_LIMIT);

      try {
        const outcome = await executeToolCall(toolName, toolArgs, env, auth, slug);
        if (outcome.error) {
          const errText = typeof outcome.error === 'string'
            ? outcome.error
            : JSON.stringify(outcome.error);
          return jsonRpc(id, {
            content: [{ type: 'text', text: errText }],
            isError: true,
          });
        }
        return jsonRpc(id, {
          content: [{ type: 'text', text: JSON.stringify(outcome.result) }],
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return jsonRpc(id, {
          content: [{ type: 'text', text: message }],
          isError: true,
        });
      }
    }

    default:
      return jsonRpcError(id, -32601, `Unknown method: ${method}`);
  }
}

// ── REST Handler ──────────────────────────────────────────────

async function handleRest(
  slug: string,
  toolName: string,
  request: Request,
  env: Env,
): Promise<Response> {
  const entry = findTool(toolName, slug);
  if (!entry) {
    return json({ error: `Unknown tool: ${slug}/${toolName}` }, 404);
  }

  let args: Record<string, unknown> = {};
  if (request.method === 'POST') {
    args = (await request.json()) as Record<string, unknown>;
  } else {
    const url = new URL(request.url);
    for (const [k, v] of url.searchParams) {
      args[k] = v;
    }
  }

  const auth = await resolveAuth(request, env.RATE_LIMIT);

  try {
    const outcome = await executeToolCall(toolName, args, env, auth, slug);
    if (outcome.error) {
      return json(typeof outcome.error === 'string' ? { error: outcome.error } : outcome.error, outcome.status ?? 500);
    }
    return json(outcome.result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
}

// ── Entry Point ───────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length === 0) {
      const drop = computeDailyDrop();
      return json({
        name: 'Stupid APIs',
        version: '0.0.1',
        api_of_the_day: drop,
        apis: publicPacks().map((p) => ({
          slug: p.slug,
          tools: p.module.tools.map((t) => t.name),
          category: p.category,
          mcp: `/${p.slug}/mcp`,
          rest: `/${p.slug}/{tool_name}`,
        })),
      });
    }

    if (parts[0] === 'health') return json({ status: 'ok' });

    // Admin: manually run the cron logic. Gated by ADMIN_SECRET.
    // POST /__admin/run-cron     — only sends if not already sent today
    // POST /__admin/run-cron?force=1 — clears the idempotency flag and re-sends
    if (parts[0] === '__admin' && parts[1] === 'run-cron') {
      if (request.method !== 'POST') return json({ error: 'POST required' }, 405);
      if (!env.ADMIN_SECRET) return json({ error: 'ADMIN_SECRET not configured' }, 500);
      const provided = request.headers.get('x-admin-secret');
      if (provided !== env.ADMIN_SECRET) return json({ error: 'unauthorized' }, 401);

      const force = url.searchParams.get('force') === '1';
      const today = todayUTC();
      const result: Record<string, unknown> = { date: today, force };

      // Step 1: drop + email
      try {
        const drop = computeDailyDrop(today);
        if (!drop) {
          result.status = 'no_drop';
          return json(result);
        }
        await env.RATE_LIMIT.put(`daily:drop:${today}`, JSON.stringify(drop), { expirationTtl: 172800 });
        result.drop_slug = drop.slug;
        result.is_new_release = drop.is_new_release;

        if (!drop.is_new_release) {
          result.status = 'not_new_release';
          return json(result);
        }
        if (!env.RESEND_API_KEY) {
          result.status = 'missing_resend_api_key';
          return json(result);
        }
        if (!env.NOTIFY_EMAIL) {
          result.status = 'missing_notify_email';
          return json(result);
        }

        const sentKey = `daily:emailed:${today}`;
        if (force) {
          await env.RATE_LIMIT.delete(sentKey);
        } else {
          const already = await env.RATE_LIMIT.get(sentKey);
          if (already) {
            result.status = 'already_sent';
            result.previous_send = already;
            return json(result);
          }
        }

        try {
          const sent = await sendDropEmail(env, drop);
          await env.RATE_LIMIT.put(sentKey, JSON.stringify({ at: new Date().toISOString(), id: sent.id }), { expirationTtl: 172800 });
          result.status = 'sent';
          result.resend_id = sent.id;
          result.notify_email = env.NOTIFY_EMAIL;
          result.from_email = env.FROM_EMAIL ?? 'Stupid APIs <onboarding@resend.dev>';
        } catch (err) {
          result.status = 'email_error';
          result.error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        }
      } catch (err) {
        result.status = 'fatal';
        result.error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      }

      return json(result);
    }

    // Stripe webhook fulfillment: mint an API key on checkout.session.completed.
    // Configure in Stripe Dashboard → Developers → Webhooks:
    //   URL:    https://api.stupidapis.com/__stripe/webhook
    //   Event:  checkout.session.completed
    // Then: wrangler secret put STRIPE_WEBHOOK_SECRET
    if (parts[0] === '__stripe' && parts[1] === 'webhook') {
      if (request.method !== 'POST') return json({ error: 'POST required' }, 405);
      if (!env.STRIPE_WEBHOOK_SECRET) return json({ error: 'STRIPE_WEBHOOK_SECRET not configured' }, 500);

      const signature = request.headers.get('stripe-signature');
      if (!signature) return json({ error: 'missing stripe-signature' }, 400);

      const rawBody = await request.text();
      const valid = await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
      if (!valid) return json({ error: 'invalid signature' }, 401);

      let event: { id: string; type: string; data: { object: unknown } };
      try {
        event = JSON.parse(rawBody);
      } catch {
        return json({ error: 'invalid JSON' }, 400);
      }

      // Idempotency on event ID — Stripe retries.
      const eventKey = `stripe:event:${event.id}`;
      if (await env.RATE_LIMIT.get(eventKey)) {
        return json({ status: 'already_processed', event_id: event.id });
      }
      await env.RATE_LIMIT.put(eventKey, '1', { expirationTtl: 86400 * 30 });

      if (event.type !== 'checkout.session.completed') {
        return json({ status: 'ignored', type: event.type });
      }

      const session = event.data.object as StripeCheckoutSession;

      // Symmetric filter: Stupid APIs Payment Links carry a tier in metadata.
      // Pipeworx purchases use credits_amount + account_id and have no tier.
      // Anything else short-circuits here without minting a key or sending mail.
      const tier = session.metadata?.tier;
      if (!tier) {
        return json({
          status: 'not_for_us',
          session_id: session.id,
          reason: 'session.metadata.tier is missing',
        });
      }

      const buyerEmail = session.customer_email ?? session.customer_details?.email ?? null;
      if (!buyerEmail) return json({ status: 'no_email', session_id: session.id });

      // Idempotency on session ID — same checkout always gets the same key.
      const sessionMapKey = `stripe:session:${session.id}`;
      let apiKey = await env.RATE_LIMIT.get(sessionMapKey);
      if (!apiKey) {
        apiKey = generateApiKey();
        await env.RATE_LIMIT.put(`apikey:${apiKey}`, JSON.stringify({
          name: buyerEmail,
          tier: 'partner',                          // skips rate limits in resolveAuth
          stupid_tier: tier,                        // the bought tier slug, e.g. somebodys-budget
          purchase_metadata: session.metadata ?? null,
          stripe_session: session.id,
          amount_total: session.amount_total ?? null,
          currency: session.currency ?? null,
          created_at: new Date().toISOString(),
        }));
        await env.RATE_LIMIT.put(sessionMapKey, apiKey, { expirationTtl: 86400 * 365 });
      }

      // Send the email best-effort. If it fails, log to KV for manual recovery.
      const emailedKey = `stripe:emailed:${session.id}`;
      const alreadyEmailed = await env.RATE_LIMIT.get(emailedKey);
      if (!alreadyEmailed) {
        ctx.waitUntil((async () => {
          try {
            const sent = await sendKeyEmail(env, buyerEmail, apiKey!, session.amount_total ?? 0, session.currency ?? 'usd');
            await env.RATE_LIMIT.put(emailedKey, JSON.stringify({ at: new Date().toISOString(), id: sent.id }), { expirationTtl: 86400 * 30 });
          } catch (err) {
            const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
            await env.RATE_LIMIT.put(`stripe:email-error:${session.id}`, msg, { expirationTtl: 86400 * 30 });
          }
        })());
      }

      return json({
        status: 'provisioned',
        event_id: event.id,
        session_id: session.id,
        api_key_prefix: apiKey.slice(0, 14) + '...',
      });
    }

    // Admin: read cron health keys without exposing them on public surface.
    if (parts[0] === '__admin' && parts[1] === 'cron-status') {
      if (!env.ADMIN_SECRET) return json({ error: 'ADMIN_SECRET not configured' }, 500);
      const provided = request.headers.get('x-admin-secret') ?? url.searchParams.get('secret');
      if (provided !== env.ADMIN_SECRET) return json({ error: 'unauthorized' }, 401);
      const today = todayUTC();
      const [status, error, emailed, drop] = await Promise.all([
        env.RATE_LIMIT.get(`daily:cron-status:${today}`),
        env.RATE_LIMIT.get(`daily:cron-error:${today}`),
        env.RATE_LIMIT.get(`daily:emailed:${today}`),
        env.RATE_LIMIT.get(`daily:drop:${today}`),
      ]);
      return json({ date: today, status, error, emailed: emailed ? JSON.parse(emailed) : null, drop_cached: !!drop });
    }
    if (parts[0] === 'stats.json') return json(await getStats(env.RATE_LIMIT));

    // Today's drop — feeds the website's "API of the day" section.
    // Reads cached drop from KV (written by the daily cron); recomputes on miss.
    if (parts[0] === 'today' || parts[0] === 'today.json') {
      const today = todayUTC();
      const cached = await env.RATE_LIMIT.get(`daily:drop:${today}`);
      if (cached) return json(JSON.parse(cached));
      const drop = computeDailyDrop(today);
      if (!drop) return json({ error: 'No APIs released yet' }, 404);
      return json(drop);
    }

    // Full manifest with schemas — for programmatic consumers
    if (parts[0] === 'manifest.json') {
      return json({
        name: 'Stupid APIs',
        version: '0.0.1',
        base_url: 'https://api.stupidapis.com',
        apis: publicPacks().map((p) => ({
          slug: p.slug,
          category: p.category ?? null,
          tools: p.module.tools,
          endpoints: {
            mcp: `https://api.stupidapis.com/${p.slug}/mcp`,
            rest: p.module.tools.map((t) => ({
              tool: t.name,
              url: `https://api.stupidapis.com/${p.slug}/${t.name}`,
            })),
          },
        })),
      });
    }

    if (parts[0] === 'mcp') return handleMcp(request, env);

    const slug = parts[0];
    if (parts[1] === 'mcp') return handleMcp(request, env, slug);
    if (parts[1]) return handleRest(slug, parts[1], request, env);

    return json({ error: 'Not found' }, 404);
  },

  // Midnight GMT cron: generate daily number + cache today's API drop + notify on new release
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const today = todayUTC();
    const packEnv: PackEnv = {
      ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY,
      REDDIT_CLIENT_ID: env.REDDIT_CLIENT_ID ?? '',
      REDDIT_CLIENT_SECRET: env.REDDIT_CLIENT_SECRET ?? '',
    };

    ctx.waitUntil(
      (async () => {
        const daily = await generateDailyNumber(packEnv);
        await env.RATE_LIMIT.put(`daily:${today}`, JSON.stringify(daily), { expirationTtl: 604800 });
      })(),
    );

    // Cache today's drop and email on actual new releases (not random picks).
    // Errors get captured in KV at `daily:cron-error:YYYY-MM-DD` for after-the-fact debugging.
    ctx.waitUntil(
      (async () => {
        try {
          const drop = computeDailyDrop(today);
          if (!drop) {
            await env.RATE_LIMIT.put(`daily:cron-status:${today}`, 'no_drop', { expirationTtl: 604800 });
            return;
          }
          await env.RATE_LIMIT.put(`daily:drop:${today}`, JSON.stringify(drop), { expirationTtl: 172800 });

          if (!drop.is_new_release) {
            await env.RATE_LIMIT.put(`daily:cron-status:${today}`, 'not_new_release', { expirationTtl: 604800 });
            return;
          }
          if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) {
            await env.RATE_LIMIT.put(`daily:cron-status:${today}`, 'missing_email_config', { expirationTtl: 604800 });
            return;
          }

          // Idempotency guard
          const sentKey = `daily:emailed:${today}`;
          const already = await env.RATE_LIMIT.get(sentKey);
          if (already) {
            await env.RATE_LIMIT.put(`daily:cron-status:${today}`, 'already_sent', { expirationTtl: 604800 });
            return;
          }

          const sent = await sendDropEmail(env, drop);
          await env.RATE_LIMIT.put(sentKey, JSON.stringify({ at: new Date().toISOString(), id: sent.id }), { expirationTtl: 172800 });
          await env.RATE_LIMIT.put(`daily:cron-status:${today}`, 'sent', { expirationTtl: 604800 });
        } catch (err) {
          const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
          await env.RATE_LIMIT.put(`daily:cron-error:${today}`, message, { expirationTtl: 604800 });
        }
      })(),
    );
  },
};
