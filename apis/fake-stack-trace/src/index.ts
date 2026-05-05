import type { StupidApiExport } from '@stupid-apis/shared';

type Language = 'javascript' | 'python' | 'java' | 'go' | 'ruby';

const VALID: Language[] = ['javascript', 'python', 'java', 'go', 'ruby'];

const ERRORS: Record<Language, string[]> = {
  javascript: [
    "TypeError: Cannot read properties of undefined (reading 'reduce')",
    'ReferenceError: process is not defined',
    'TypeError: Cannot convert object to primitive value',
    'SyntaxError: Unexpected end of JSON input',
    'RangeError: Maximum call stack size exceeded',
  ],
  python: [
    "AttributeError: 'NoneType' object has no attribute 'split'",
    'KeyError: 0',
    "TypeError: 'int' object is not subscriptable",
    'IndentationError: unexpected indent',
    'ZeroDivisionError: division by zero',
  ],
  java: [
    'java.lang.NullPointerException',
    'java.util.ConcurrentModificationException',
    'java.lang.OutOfMemoryError: Java heap space',
    'java.lang.StackOverflowError',
    'java.lang.NumberFormatException: For input string: ""',
  ],
  go: [
    'runtime error: invalid memory address or nil pointer dereference',
    'fatal error: concurrent map writes',
    'panic: runtime error: index out of range',
    'panic: send on closed channel',
    'fatal error: all goroutines are asleep - deadlock!',
  ],
  ruby: [
    "NoMethodError: undefined method `each' for nil:NilClass",
    'TypeError: no implicit conversion of String into Integer',
    'ArgumentError: wrong number of arguments (given 1, expected 2)',
    'SystemStackError: stack level too deep',
    'NameError: uninitialized constant',
  ],
};

const FILES: Record<Language, string[]> = {
  javascript: ['src/index.js', 'src/utils/parse.js', 'lib/middleware.js', 'app/handlers/checkout.js', 'pages/api/sync.js'],
  python: ['app/main.py', 'lib/processor.py', 'utils/serializer.py', 'src/handlers/auth.py', 'tools/migrate.py'],
  java: ['com/example/AppMain.java', 'com/example/service/Sync.java', 'com/example/util/Parser.java', 'com/example/db/Repo.java'],
  go: ['cmd/server/main.go', 'internal/auth/handler.go', 'pkg/db/migrate.go', 'pkg/util/parse.go'],
  ruby: ['app/controllers/sessions_controller.rb', 'lib/job_runner.rb', 'app/models/user.rb', 'config/initializers/setup.rb'],
};

const FRAMES: Record<Language, (file: string, line: number, fn: string) => string> = {
  javascript: (f, l, fn) => `    at ${fn} (${f}:${l}:${1 + Math.floor(Math.random() * 60)})`,
  python: (f, l, fn) => `  File "${f}", line ${l}, in ${fn}`,
  java: (f, l, fn) => `\tat ${fn}(${f.split('/').pop()}:${l})`,
  go: (f, l, fn) => `${f}:${l} +0x${Math.floor(Math.random() * 65535).toString(16)}\n\t${fn}(...)`,
  ruby: (f, l, fn) => `\tfrom ${f}:${l}:in \`${fn}'`,
};

const FUNCTIONS = ['handle', 'process', 'serialize', 'parse', 'validate', 'sync', 'migrate', 'compute', 'render', 'write'];

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Result {
  language: Language;
  error_message: string;
  stack: string[];
  thread: string;
  occurred_at: string;
  next_question: string;
}

const NEXT_QUESTIONS = [
  'is the input what you think it is',
  'is there a null somewhere upstream',
  'did you handle the empty case',
  'is this the only place this can happen',
  'what was the last thing that worked',
];

function generate(language: Language): Result {
  const error = pickOne(ERRORS[language]);
  const files = FILES[language];
  const frameCount = 4 + Math.floor(Math.random() * 4);
  const stack: string[] = [];
  for (let i = 0; i < frameCount; i++) {
    const file = pickOne(files);
    const line = 12 + Math.floor(Math.random() * 800);
    const fn = pickOne(FUNCTIONS);
    stack.push(FRAMES[language](file, line, fn));
  }
  return {
    language,
    error_message: error,
    stack,
    thread: language === 'java' ? 'main' : language === 'go' ? 'goroutine 1' : 'main',
    occurred_at: new Date().toISOString(),
    next_question: pickOne(NEXT_QUESTIONS),
  };
}

const tools: StupidApiExport['tools'] = [
  {
    name: 'generate',
    description:
      'Generates a believable but fictional error stack trace for the chosen language. Languages: javascript, python, java, go, ruby.',
    inputSchema: {
      type: 'object',
      properties: {
        language: { type: 'string', enum: VALID, description: 'Target language. Default: javascript.' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const l = ((args.language as string) || 'javascript').toLowerCase();
      if (!(VALID as string[]).includes(l)) throw new Error(`Unknown language. Use: ${VALID.join(', ')}`);
      return generate(l as Language);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
