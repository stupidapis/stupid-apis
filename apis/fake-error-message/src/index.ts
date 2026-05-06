import type { StupidApiExport } from '@stupid-apis/shared';

type Severity = 'warning' | 'error' | 'critical' | 'philosophical';

interface ErrorMessage {
  title: string;
  body: string;
  buttons: string[];
}

const MESSAGES: Record<Severity, ErrorMessage[]> = {
  warning: [
    { title: 'Something is fine', body: 'Operation completed. The result is ambiguous.', buttons: ['OK', 'Why'] },
    { title: 'Save deferred', body: 'The file has been saved, but not where you would expect.', buttons: ['Locate file', 'Continue'] },
    { title: 'Network is opinionated', body: 'Connection established with a known set of complaints.', buttons: ['Acknowledge', 'Reconnect'] },
    { title: 'Your input was understood', body: 'It will not, however, be acted upon.', buttons: ['Try again', 'Accept'] },
  ],
  error: [
    { title: 'File is happy', body: 'Cannot save happy files.', buttons: ['Make sad', 'Cancel'] },
    { title: 'Operation refused', body: 'The system is temporarily disagreeable.', buttons: ['Retry later', 'Take it personally'] },
    { title: 'Path not found', body: 'The path was found, but it has moved.', buttons: ['Pursue', 'Let it go'] },
    { title: 'Permission denied', body: 'You have permissions. They are the wrong permissions.', buttons: ['Contact administrator', 'Continue without'] },
    { title: 'Could not parse', body: 'Could not parse, but loved the formatting.', buttons: ['Reformat', 'Submit anyway'] },
  ],
  critical: [
    { title: 'System integrity questioned', body: 'The system has integrity. It is, however, sad.', buttons: ['Console it', 'Restart', 'Ignore'] },
    { title: 'Unrecoverable, sort of', body: 'Some things have been lost. They were not the important things.', buttons: ['Continue', 'Mourn'] },
    { title: 'A reboot is required', body: 'Probably not by the system.', buttons: ['Reboot', 'Reboot self'] },
  ],
  philosophical: [
    { title: 'Why', body: 'Why.', buttons: ['Yes', 'Also yes'] },
    { title: 'The action you are about to take', body: 'Has been taken before. It did not go well.', buttons: ['Take it again', 'Cancel'] },
    { title: 'Are you sure', body: 'You have been asked this before.', buttons: ['Yes', 'No', 'Sometimes'] },
    { title: 'A choice has been made', body: 'It was not made by you.', buttons: ['Accept', 'Refuse', 'Both'] },
  ],
};

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const VALID: Severity[] = ['warning', 'error', 'critical', 'philosophical'];

interface Result extends ErrorMessage {
  severity: Severity;
  modal: boolean;
  dismissable: boolean;
  has_progress_bar: boolean;
  icon: string;
}

const ICONS: Record<Severity, string> = {
  warning: '⚠️',
  error: '✖',
  critical: '☢',
  philosophical: '?',
};

function generate(severity: Severity): Result {
  const m = pickOne(MESSAGES[severity]);
  return {
    severity,
    title: m.title,
    body: m.body,
    buttons: m.buttons,
    modal: severity !== 'warning',
    dismissable: severity !== 'critical' && severity !== 'philosophical',
    has_progress_bar: Math.random() < 0.3,
    icon: ICONS[severity],
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Returns a fake system error dialog with title, body, buttons, severity, and rendering hints (modal, dismissable, icon).',
    inputSchema: {
      type: 'object',
      properties: {
        severity: { type: 'string', enum: VALID, description: 'Default: error.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const s = ((args.severity as string) || 'error').toLowerCase();
      if (!(VALID as string[]).includes(s)) throw new Error(`Unknown severity. Use: ${VALID.join(', ')}`);
      return generate(s as Severity);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
