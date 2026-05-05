import type { StupidApiExport, PackEnv } from '@stupid-apis/shared';
import { callHaiku } from '@stupid-apis/shared';

const DEFAULT_SOURCES = ['technology', 'worldnews', 'science', 'programming', 'showerthoughts'];
const UA = 'StupidAPIs/1.0 (by u/stupidapis; api.stupidapis.com)';

interface SourceData {
  source: string;
  title: string;
  score: number;
  comments: number;
  age_hours: number;
  title_length: number;
  entropy_contribution: number;
}

// Reddit OAuth for app-only access (bypasses datacenter IP blocks)
async function getRedditToken(env: PackEnv): Promise<string | null> {
  const clientId = env.REDDIT_CLIENT_ID;
  const clientSecret = env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': UA,
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  } catch {
    return null;
  }
}

async function fetchRedditSource(name: string, token: string | null): Promise<SourceData | null> {
  const isUser = name.startsWith('u/') || name.startsWith('/u/');
  const clean = name.replace(/^\/?(u|r)\//, '');

  // Use OAuth endpoint if we have a token, otherwise fall back to public
  const base = token ? 'https://oauth.reddit.com' : 'https://www.reddit.com';
  const url = isUser
    ? `${base}/user/${clean}/submitted.json?limit=1&raw_json=1`
    : `${base}/r/${clean}/hot.json?limit=1&raw_json=1`;

  const headers: Record<string, string> = { 'User-Agent': UA };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      data: { children: Array<{ data: { title: string; score: number; num_comments: number; created_utc: number } }> };
    };

    const post = data.data?.children?.[0]?.data;
    if (!post) return null;

    const ageHours = Math.round((Date.now() / 1000 - post.created_utc) / 3600);
    const titleLen = post.title.length;
    const raw = (post.score % 100) + (post.num_comments % 100) + (ageHours % 100) + (titleLen % 100);
    const contribution = raw % 100;

    return {
      source: isUser ? `u/${clean}` : `r/${clean}`,
      title: post.title.slice(0, 80) + (post.title.length > 80 ? '...' : ''),
      score: post.score,
      comments: post.num_comments,
      age_hours: ageHours,
      title_length: titleLen,
      entropy_contribution: contribution,
    };
  } catch {
    return null;
  }
}

async function generate(sources: string[], env: PackEnv): Promise<unknown> {
  const inputs = sources.length > 0 ? sources.slice(0, 5) : DEFAULT_SOURCES;

  // Pad to 5 if fewer provided
  while (inputs.length < 5) {
    inputs.push(DEFAULT_SOURCES[inputs.length % DEFAULT_SOURCES.length]);
  }

  // Get Reddit OAuth token for datacenter access
  const token = await getRedditToken(env);

  // Fetch all 5 in parallel
  const results = await Promise.all(inputs.map((s) => fetchRedditSource(s, token)));

  const contributors: SourceData[] = [];
  const failed: string[] = [];

  for (let i = 0; i < inputs.length; i++) {
    if (results[i]) {
      contributors.push(results[i]!);
    } else {
      failed.push(inputs[i]);
    }
  }

  // Calculate final number from contributions
  const totalEntropy = contributors.reduce((sum, c) => sum + c.entropy_contribution, 0);
  const number = contributors.length > 0 ? totalEntropy % 100 : Math.floor(Math.random() * 100);

  // Haiku analysis
  let analysis: string;
  try {
    const sourceSummary = contributors.map((c) =>
      `${c.source}: "${c.title}" (${c.score} upvotes, ${c.comments} comments, ${c.age_hours}h old, contributed ${c.entropy_contribution})`
    ).join('\n');

    const raw = await callHaiku(
      'You analyze social media entropy to explain random numbers. Treat it as real science. Dry. No exclamation points. Match this voice: "Thursday, you animal."',
      `5 Reddit sources produced the number ${number}. Analyze why this number was inevitable given today's social entropy:\n${sourceSummary}\n\nReturn JSON: { "analysis": "2-3 sentences explaining why these posts produced this specific number. Be specific about the posts." }`,
      120,
      env,
    );
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    analysis = JSON.parse(cleaned).analysis;
  } catch {
    analysis = `${contributors.length} sources contributed ${totalEntropy} units of entropy. The number ${number} was the only possible outcome.`;
  }

  return {
    number,
    methodology: 'Latest posts from 5 Reddit sources. Upvotes, comments, age, and title length hashed into a two-digit number. Peer reviewed by nobody.',
    sources: contributors,
    failed_sources: failed.length > 0 ? failed : undefined,
    total_entropy: totalEntropy,
    analysis,
    platform: 'reddit',
    platform_note: 'We wanted to use Instagram. Instagram did not want us to use Instagram.',
    sources_consulted: contributors.length,
    sources_that_cooperated: contributors.length,
    generated_at: new Date().toISOString(),
  };
}

const tools: StupidApiExport['tools'] = [{
  name: 'generate',
  description: 'Generate a random number from the social entropy of 5 Reddit sources. Provide subreddits (r/technology) or users (u/spez). The internet\'s collective posting behavior determines your number.',
  inputSchema: {
    type: 'object',
    properties: {
      sources: {
        type: 'string',
        description: 'Comma-separated list of up to 5 subreddits or users (e.g. "technology,worldnews,u/spez"). Defaults to 5 popular subreddits.',
      },
    },
  },
}];

async function callTool(name: string, args: Record<string, unknown>, env?: PackEnv): Promise<unknown> {
  switch (name) {
    case 'generate': {
      const raw = args.sources as string | undefined;
      const sources = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
      return generate(sources, env ?? {});
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool } satisfies StupidApiExport;
