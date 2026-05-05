import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

async function generate(complaint: string, recipient: string, indignation: string, complaintType: string, length: string, env: PackEnv): Promise<unknown> {
  const isAbstract = complaintType === 'abstract';
  const isExcessive = length === 'excessive';

  const prompt = `Write a Victorian complaint letter.
Complaint: "${complaint}". Recipient: "${recipient}". Indignation: ${indignation}. Type: ${complaintType}. Length: ${length}.
${isAbstract ? 'Recipient is "The Universe" or similar cosmic entity.' : ''}
${indignation === 'mild' ? 'Almost reasonable. The restraint IS the joke.' : ''}
${isExcessive ? 'The letter threatens a follow-up letter. Then INCLUDE the follow-up letter. The follow-up threatens a third. Include a third letter that is one sentence: "We trust our point has been made."' : ''}

Structure:
- Formal Victorian salutation
- Statement of grievance
- Elaboration with historical/literary reference
- Specific demand
- Threat (always vague)
- Closing (always better than the letter)
- Signature: "A [Adjective] [Noun]"

Also generate:
- victorianizations: array of 3+ objects { "modern": "...", "victorian": "..." } translating modern concepts to Victorian language
- complaint_severity_actual: trivial / minor / moderate
- complaint_severity_perceived: catastrophic / civilisation ending / an affront to progress
- historical_comparison: a historical event compared to this complaint
- closing: the closing line extracted
- threats_made: integer count

Return JSON: { "letter": "...", "victorianizations": [...], "complaint_severity_actual": "...", "complaint_severity_perceived": "...", "historical_comparison": "...", "closing": "...", "threats_made": N }`;

  let parsed: Record<string, unknown> = {};
  try {
    const raw = await callHaiku('You write Victorian complaint letters. Maximum indignation. Formal structure. The complaint is always taken more seriously than it deserves.', prompt, 600, env);
    parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim());
  } catch {
    parsed = { letter: `Dear ${recipient},\n\nIt is with considerable displeasure that I write regarding ${complaint}. I trust I need not elaborate on the gravity of this situation.\n\nYours, in considerable dudgeon,\nA Concerned Citizen`, victorianizations: [{ modern: complaint.split(' ')[0], victorian: 'apparatus of modern inconvenience' }], complaint_severity_actual: 'trivial', complaint_severity_perceived: 'catastrophic', historical_comparison: 'The Fall of Rome was less concerning.', closing: 'Yours, in considerable dudgeon,', threats_made: 1 };
  }

  const result: Record<string, unknown> = {
    complaint, recipient: isAbstract ? (recipient === 'The Relevant Authorities' ? 'The Universe' : recipient) : recipient,
    letter: parsed.letter,
    complaint_severity_actual: parsed.complaint_severity_actual,
    complaint_severity_perceived: parsed.complaint_severity_perceived,
    indignation,
    words_used_to_describe_complaint: String(parsed.letter ?? '').split(/\s+/).length,
    historical_comparison_made: !!parsed.historical_comparison,
    historical_comparison: parsed.historical_comparison ?? null,
    victorianizations: parsed.victorianizations,
    threats_made: parsed.threats_made ?? 1,
    threats_credible: false,
    closing: parsed.closing,
    closing_note: 'The closing is always better than the letter.',
    follow_up_letter_threatened: isExcessive,
    follow_up_letter_coming: false,
  };

  if (isAbstract) {
    result.response_expected = false;
    result.response_expected_note = 'The universe does not correspond in writing.';
  }

  if (indignation === 'mild') {
    result.indignation_note = 'We attempted mild. This is mild. It is somehow funnier.';
  }

  return result;
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Any complaint, maximum Victorian indignation. The wifi being slow has never been taken more seriously.',
  inputSchema: {
    type: 'object',
    properties: {
      complaint: { type: 'string' }, recipient: { type: 'string' },
      indignation: { type: 'string', enum: ['mild', 'considerable', 'severe', 'maximum'] },
      complaint_type: { type: 'string', enum: ['service', 'neighbor', 'technology', 'food', 'abstract', 'government'] },
      length: { type: 'string', enum: ['brief', 'standard', 'excessive'] },
    },
    required: ['complaint'],
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate':
      return generate(args.complaint as string, (args.recipient as string) || 'The Relevant Authorities', (args.indignation as string) || 'considerable', (args.complaint_type as string) || 'service', (args.length as string) || 'standard', env ?? {});
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
