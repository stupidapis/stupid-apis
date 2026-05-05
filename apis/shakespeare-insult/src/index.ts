import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const COL1 = ['artless','bawdy','beslubbering','bootless','churlish','cockered','clouted','craven','currish','dankish','dissembling','droning','errant','fawning','fobbing','froward','frothy','gleeking','goatish','gorbellied','impertinent','infectious','jarring','loggerheaded','lumpish','mammering','mangled','mewling','paunchy','pribbling','puking','puny','qualling','rank','reeky','roguish','ruttish','saucy','spleeny','unmuzzled','vain','venomed','villainous','warped','wayward','weedy','yeasty'];
const COL2 = ['base-court','bat-fowling','beef-witted','beetle-headed','boil-brained','clapper-clawed','clay-brained','common-kissing','crook-pated','dismal-dreaming','dizzy-eyed','doghearted','dread-bolted','earth-vexing','elf-skinned','fat-kidneyed','fen-sucked','flap-mouthed','fly-bitten','folly-fallen','fool-born','full-gorged','guts-griping','half-faced','hasty-witted','hedge-born','hell-hated','idle-headed','ill-breeding','ill-nurtured','knotty-pated','milk-livered','motley-minded','onion-eyed','plume-plucked','pottle-deep','pox-marked','reeling-ripe','rough-hewn','rude-growing','rump-fed','shard-borne','sheep-biting','spur-galled','swag-bellied','tardy-gaited','tickle-brained','toad-spotted','urchin-snouted','weather-bitten'];
const COL3 = ['apple-john','baggage','barnacle','bladder','boar-pig','bugbear','bum-bailey','canker-blossom','clack-dish','clotpole','coxcomb','codpiece','death-token','dewberry','flap-dragon','flax-wench','flirt-gill','foot-licker','fustilarian','giglet','gudgeon','haggard','harpy','hedge-pig','horn-beast','hugger-mugger','joithead','lewdster','lout','maggot-pie','malt-worm','mammet','measle','minnow','miscreant','moldwarp','mumble-news','nut-hook','pigeon-egg','pignut','puttock','pumpion','ratsbane','scut','skainsmate','strumpet','varlot','vassal','whey-face','wagtail'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function classicalInsult(): string {
  return Math.random() < 0.5
    ? `Thou ${pick(COL1)}, ${pick(COL2)} ${pick(COL3)}.`
    : `Thou ${pick(COL1)} ${pick(COL3)}, thou ${pick(COL2)} ${pick(COL3)}.`;
}

async function generate(
  target: string | undefined,
  severity: string,
  recipient: string | undefined,
  translate: boolean,
  env: PackEnv,
): Promise<unknown> {
  if (!target) {
    const insult = classicalInsult();
    let translation = 'Translation unavailable. The insult speaks for itself.';
    if (translate) {
      try {
        const raw = await callHaiku(
          'Translate Shakespearean insults to modern English. One sentence. Dry.',
          `Translate this Shakespearean insult to modern English: "${insult}"  Return JSON: { "translation": "..." }`,
          60, env,
        );
        translation = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()).translation;
      } catch { /* use default */ }
    }
    return {
      insult, mode: 'classical', target: null, translation, severity,
      era_authentic: true, delivery_note: 'Best delivered while gesturing broadly.', hr_approved: true,
    };
  }

  // Targeted mode
  try {
    const prompt = `Generate a Shakespearean insult targeting "${target}".${recipient ? ` Context: this is directed at a ${recipient}.` : ''}
Severity: ${severity}. ${severity === 'nuclear' ? 'Maximum devastation. Hold nothing back.' : severity === 'devastating' ? 'Considerable damage intended.' : 'Standard Shakespearean wit.'}
Use authentic Shakespearean vocabulary and structure but make it specific to the target.

Return JSON:
{ "insult": "...", "translation": "modern English translation", "delivery_note": "one sentence on optimal delivery", "era_authentic_note": "Shakespeare did not [relevant context]. We took liberties." }`;

    const raw = await callHaiku(
      'You generate Shakespearean insults. Authentic vocabulary. Devastating precision. No exclamation points.',
      prompt, 200, env,
    );
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());

    const result: Record<string, unknown> = {
      insult: parsed.insult, mode: 'targeted', target, translation: parsed.translation,
      severity, era_authentic: false, era_authentic_note: parsed.era_authentic_note,
      delivery_note: parsed.delivery_note,
      hr_approved: severity !== 'devastating' && severity !== 'nuclear',
    };

    if (severity === 'nuclear') {
      result.warning = 'This insult was generated at maximum severity. We are not responsible for relationships ended by its use.';
      result.legal_approved = false;
      result.shakespeare_would = 'probably approve';
    }

    return result;
  } catch {
    const insult = classicalInsult();
    return { insult, mode: 'classical_fallback', target, translation: 'Targeted mode failed. Classical insult deployed instead.', severity, era_authentic: true, hr_approved: true };
  }
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Generate a Shakespearean insult. Classical mode (no target) uses authentic vocabulary. Targeted mode uses Haiku for bespoke devastation.',
  inputSchema: {
    type: 'object',
    properties: {
      target: { type: 'string', description: 'Target for a bespoke insult. Omit for classical random.' },
      severity: { type: 'string', enum: ['mild', 'medium', 'devastating', 'nuclear'] },
      recipient: { type: 'string', enum: ['colleague', 'ex', 'traffic', 'software', 'abstract_concept', 'the_universe'] },
      translate: { type: 'boolean', description: 'Include modern English translation' },
    },
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.target as string | undefined, (args.severity as string) || 'medium', args.recipient as string | undefined, args.translate !== false && args.translate !== 'false', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
