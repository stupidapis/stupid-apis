#!/usr/bin/env node

/**
 * StupidAPIs.com Build Script
 *
 * Reads apis.json and categories.json, generates all HTML pages.
 * No dependencies. Run with: node build.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const PAGES = path.join(ROOT, 'pages');

// Load data
const allApis = JSON.parse(fs.readFileSync(path.join(DATA, 'apis.json'), 'utf8')).apis;
const categories = JSON.parse(fs.readFileSync(path.join(DATA, 'categories.json'), 'utf8')).categories;

// Filter out APIs whose release_date is in the future. Built once per build run —
// surface a daily build to keep the directory current, or rely on the live /today
// endpoint for the hero card.
const TODAY = new Date().toISOString().slice(0, 10);
const apis = allApis.filter((a) => !a.release_date || a.release_date <= TODAY);

// Pick today's API of the day: either today's release, or a deterministic
// date-seeded random pick from the released set.
function pickApiOfTheDay() {
  const todays = apis.find((a) => a.release_date === TODAY);
  if (todays) return { api: todays, isNewRelease: true };
  if (apis.length === 0) return null;
  let h = 0;
  for (let i = 0; i < TODAY.length; i++) h = ((h << 5) - h) + TODAY.charCodeAt(i);
  return { api: apis[Math.abs(h) % apis.length], isNewRelease: false };
}
const apiOfTheDay = pickApiOfTheDay();

// Build category lookup
const categoryMap = {};
categories.forEach(c => { categoryMap[c.id] = c; });

// Count APIs per category
const categoryCounts = {};
apis.forEach(a => {
  categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
});

// Ensure directories
[PAGES, path.join(PAGES, 'apis'), path.join(PAGES, 'categories')].forEach(d => {
  fs.mkdirSync(d, { recursive: true });
});

// Recursive copy helper
function copyDirSync(src, dest) {
  // Remove old symlink or directory
  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (stat.isSymbolicLink()) fs.unlinkSync(dest);
    else fs.rmSync(dest, { recursive: true });
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ============================================================
// HELPERS
// ============================================================

function stupidityRating(level) {
  const labels = ['', 'Mild', 'Medium', 'Unhinged'];
  const dogs = '\u{1F32D}'.repeat(level);
  return `<span class="stupidity-rating" title="${labels[level]}: ${['','slightly questionable','confidently wrong','chaotic neutral'][level]}">${dogs} <span class="stupidity-label">${labels[level]}</span></span>`;
}

function categoryBadge(catId) {
  const cat = categoryMap[catId];
  if (!cat) return '';
  return `<span class="category-badge" data-color="${cat.color}">${cat.icon} ${cat.name}</span>`;
}

function apiCard(api) {
  const cat = categoryMap[api.category];
  const isNew = isRecent(api.added_date);
  return `<div class="api-card" data-category="${api.category}" data-stupidity="${api.stupidity}" data-date="${api.added_date}" data-calls="${api.call_count}">
  <div class="api-card-header">
    <h3><a href="/apis/${api.id}.html">${api.name}</a>${isNew ? '<span class="new-badge">NEW</span>' : ''}</h3>
    ${stupidityRating(api.stupidity)}
  </div>
  ${categoryBadge(api.category)}
  <p class="description">${api.description}</p>
  <div class="card-meta">
    <span class="call-count">${api.call_count.toLocaleString()} bad decisions made</span>
  </div>
  <div class="card-actions">
    <a href="/apis/${api.id}.html#playground" class="btn btn-primary btn-small">TRY IT</a>
    <a href="/apis/${api.id}.html" class="btn btn-outline btn-small">DOCS</a>
  </div>
</div>`;
}

function isRecent(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  return diff < 90 * 24 * 60 * 60 * 1000; // 90 days
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================
// LAYOUT
// ============================================================

const SITE_URL = 'https://stupidapis.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-share.png`;
const DEFAULT_DESCRIPTION = 'A public catalog of deliberately absurd APIs. One new pack drops every day.';

function layout(title, body, { depth = 0, clippy_message = '', extraHead = '', description = DEFAULT_DESCRIPTION, og_url = SITE_URL, og_image = DEFAULT_OG_IMAGE } = {}) {
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  const absPrefix = '/';
  const fullTitle = title === 'Home' ? 'StupidAPIs.com — APIs So Stupid They Just Might Work' : `${title} — StupidAPIs.com`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullTitle}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${og_url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="StupidAPIs.com">
  <meta property="og:image" content="${og_image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${og_image}">
  <link rel="icon" type="image/x-icon" href="${prefix}assets/images/favicons/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="${prefix}assets/images/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="${prefix}assets/images/favicons/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${prefix}assets/images/favicons/favicon-180x180.png">
  <link rel="stylesheet" href="${prefix}assets/css/base.css">
  <link rel="stylesheet" href="${prefix}assets/css/components.css">
  ${extraHead}
</head>
<body>

<header class="site-header">
  <div class="container">
    <a href="${absPrefix}" class="site-logo">
      <span class="logo-dot"></span> StupidAPIs.com
    </a>
    <div class="nav-right">
      <button class="hotdog-toggle" id="hotdog-toggle" aria-label="Toggle Hot Dog Cart theme">
        <span class="hotdog-toggle-icon">\ud83c\udf2d</span>
        <span class="hotdog-toggle-label" data-on="HOT DOG CART" data-off="NOT HOT DOG CART">NOT HOT DOG CART</span>
      </button>
      <button class="nav-toggle" aria-label="Toggle navigation">\u2630</button>
    </div>
    <nav>
      <ul class="site-nav">
        <li><a href="${absPrefix}">APIs</a></li>
        <li><a href="${absPrefix}pricing.html">Pricing</a></li>
        <li><a href="${absPrefix}docs.html">Docs</a></li>
        <li><a href="${absPrefix}contribute.html">Contribute</a></li>
        <li><a href="https://github.com/stupidapis/stupid-apis" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="https://pipeworx.io" target="_blank" rel="noopener" class="nav-pipeworx">Need Real APIs? &rarr;</a></li>
      </ul>
    </nav>
  </div>
</header>

${body}

<footer class="site-footer">
  <div class="container">
    <div class="footer-hit-counter">
      You are visitor number <span id="hit-counter">48,271</span>
    </div>
    <div class="footer-under-construction">
      <span>\ud83d\udea7 \ud83d\udea7 \ud83d\udea7 \ud83d\udea7 \ud83d\udea7 UNDER CONSTRUCTION \ud83d\udea7 \ud83d\udea7 \ud83d\udea7 \ud83d\udea7 \ud83d\udea7</span>
    </div>
    <p class="footer-pipeworx">Need real data, not jokes? <a href="https://pipeworx.io" target="_blank" rel="noopener">Try Pipeworx &rarr;</a></p>
    <p>&copy; 2025 StupidAPIs.com &mdash; Not liable for Friday deploys</p>
    <p class="footer-netscape">Best viewed in Netscape Navigator 4.0</p>
  </div>
</footer>

<!-- Clippy -->
<div id="clippy-widget" class="clippy-widget"${clippy_message ? ` data-page-message="${escapeHtml(clippy_message)}"` : ''}>
  <button class="clippy-dismiss" aria-label="Dismiss Clippy">&times;</button>
  <div class="clippy-bubble">...</div>
  <img src="${prefix}assets/images/clippy.png" alt="Clippy" class="clippy-image" width="100">
</div>

<style>
.clippy-widget {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  z-index: 200;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: opacity 0.3s, transform 0.3s;
}
.clippy-widget.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.clippy-bubble {
  background: #FFFFCC;
  border: 1px solid #CCCC99;
  border-radius: 8px 8px 0 8px;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  max-width: 250px;
  color: var(--hotdog-black);
  line-height: 1.4;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
  position: relative;
}
.clippy-dismiss {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--hotdog-grey);
  border: 1px solid var(--hotdog-border);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  z-index: 1;
}
.clippy-dismiss:hover { background: var(--hotdog-red); color: white; border-color: var(--hotdog-red); }
@keyframes clippy-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.clippy-image {
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.15));
  animation: clippy-bounce 3s ease-in-out infinite;
}
@media (max-width: 600px) {
  .clippy-widget { bottom: 1rem; right: 1rem; }
  .clippy-bubble { max-width: 200px; font-size: 0.75rem; }
  .clippy-image { width: 70px; }
}
</style>

<script src="${prefix}assets/js/main.js"></script>
<script src="${prefix}assets/js/clippy-sayings.js"></script>
<script src="${prefix}assets/js/clippy.js"></script>
</body>
</html>`;
}

// ============================================================
// HOMEPAGE
// ============================================================

function buildHomepage() {
  const sortedByDate = [...apis].sort((a, b) => b.added_date.localeCompare(a.added_date));
  const featured = sortedByDate.slice(0, 3);

  const totalCalls = apis.reduce((sum, a) => sum + a.call_count, 0);
  const fridayDeploys = apis.find(a => a.id === 'ship-on-friday')?.call_count || 0;
  const emailsNotSent = apis.find(a => a.id === 'send-that-email')?.call_count || 0;
  const startupIdeas = apis.find(a => a.id === 'startup-oracle')?.call_count || 0;

  const aotdSection = apiOfTheDay ? `
  <!-- API of the Day -->
  <section class="section section-aotd">
    <div class="container">
      <div class="section-title">
        <h2>${apiOfTheDay.isNewRelease ? "Today's Fresh Drop" : 'API of the Day'}</h2>
        <p class="aotd-subhead">${apiOfTheDay.isNewRelease ? 'A new API has been released today.' : 'Picked at random from the catalog.'}</p>
      </div>
      <div class="aotd-feature">
        ${apiCard(apiOfTheDay.api)}
      </div>
    </div>
  </section>` : '';

  const body = `
<main>
  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <h1>APIs So Stupid They Just Might Work</h1>
      <p class="subhead">Programmatically terrible decisions since 2025</p>
      <div class="hero-buttons">
        <a href="#catalog" class="btn btn-primary">EXPLORE APIS</a>
        <a href="/docs.html" class="btn btn-outline">READ THE DOCS</a>
      </div>
      <div class="hero-clippy">
        <img src="assets/images/clippy.png" alt="" width="50">
        <span>It looks like you're evaluating APIs. Have you tried a spreadsheet?</span>
      </div>
    </div>
  </section>
${aotdSection}
  <!-- Featured APIs -->
  <section class="section">
    <div class="container">
      <div class="section-title">
        <h2>Recently Deployed Questionable Technology</h2>
      </div>
      <div class="grid grid-3">
        ${featured.map(apiCard).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- Categories -->
  <section class="section">
    <div class="container">
      <div class="section-title">
        <h2>Browse By Category</h2>
      </div>
      <div class="grid grid-5">
        ${categories.map(cat => `
        <a href="/categories/${cat.id}.html" class="category-card">
          <div class="icon">${cat.icon}</div>
          <h3>${cat.name}</h3>
          <p class="description">${cat.description}</p>
          <span class="api-count-badge">${categoryCounts[cat.id] || 0} API${(categoryCounts[cat.id] || 0) !== 1 ? 's' : ''}</span>
        </a>`).join('\n')}
      </div>
    </div>
  </section>

  <!-- Stats Bar -->
  <section class="stats-bar">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">${apis.length}</span>
          <span class="stat-label">APIs Available</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${totalCalls.toLocaleString()}</span>
          <span class="stat-label">Decisions Outsourced</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${fridayDeploys.toLocaleString()}</span>
          <span class="stat-label">Friday Deploys Prevented</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${emailsNotSent.toLocaleString()}</span>
          <span class="stat-label">Emails Not Sent</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${startupIdeas.toLocaleString()}</span>
          <span class="stat-label">Startup Ideas Destroyed</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">Both</span>
          <span class="stat-label">Schr\u00f6dinger's Cats</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Full Catalog -->
  <section class="section" id="catalog">
    <div class="container">
      <div class="section-title">
        <h2>The Full Suite of Bad Decisions</h2>
      </div>

      <div class="filter-bar">
        <select id="filter-category">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('\n          ')}
        </select>
        <select id="filter-stupidity">
          <option value="">All Stupidity Levels</option>
          <option value="1">\ud83c\udf2d Mild</option>
          <option value="2">\ud83c\udf2d\ud83c\udf2d Medium</option>
          <option value="3">\ud83c\udf2d\ud83c\udf2d\ud83c\udf2d Unhinged</option>
        </select>
        <input type="text" id="filter-search" placeholder="Search APIs...">
      </div>

      <div class="sort-bar">
        <button class="sort-btn active" data-sort="newest">Newest</button>
        <button class="sort-btn" data-sort="calls">Most Called</button>
        <button class="sort-btn" data-sort="stupidity">Most Stupid</button>
      </div>

      <div class="grid grid-3" id="api-catalog">
        ${sortedByDate.map(apiCard).join('\n        ')}
        <div class="empty-state" style="display:none;grid-column:1/-1;">No APIs match your filters. Try being less specific. We certainly are.</div>
      </div>
    </div>
  </section>
</main>`;

  const html = layout('Home', body, {
    depth: 0,
    description: 'A public catalog of deliberately absurd APIs. One new pack drops every day. REST + MCP for AI assistants.',
    og_url: SITE_URL,
    clippy_message: "It looks like you're evaluating APIs. Have you tried a spreadsheet?"
  });

  fs.writeFileSync(path.join(PAGES, 'index.html'), html);
  console.log('  \u2713 pages/index.html');
}

// ============================================================
// CATEGORY PAGES
// ============================================================

function buildCategoryPages() {
  categories.forEach(cat => {
    const catApis = apis.filter(a => a.category === cat.id)
      .sort((a, b) => b.added_date.localeCompare(a.added_date));

    const body = `
<main>
  <div class="container">
    <div class="breadcrumb">
      <a href="/">StupidAPIs.com</a><span class="sep">&gt;</span>${cat.name}
    </div>

    <div class="category-header">
      <div class="icon">${cat.icon}</div>
      <h1>${cat.name}</h1>
      <p class="description">${cat.description}</p>
      <p class="api-count">${catApis.length} questionable tool${catApis.length !== 1 ? 's' : ''} in this category</p>
    </div>

    <div class="filter-bar">
      <select id="filter-stupidity">
        <option value="">All Stupidity Levels</option>
        <option value="1">\ud83c\udf2d Mild</option>
        <option value="2">\ud83c\udf2d\ud83c\udf2d Medium</option>
        <option value="3">\ud83c\udf2d\ud83c\udf2d\ud83c\udf2d Unhinged</option>
      </select>
      <input type="text" id="filter-search" placeholder="Search APIs...">
    </div>

    <div class="sort-bar">
      <button class="sort-btn active" data-sort="newest">Newest</button>
      <button class="sort-btn" data-sort="calls">Most Called</button>
      <button class="sort-btn" data-sort="stupidity">Most Stupid</button>
    </div>

    <div class="grid grid-3" id="api-catalog">
      ${catApis.map(apiCard).join('\n      ')}
      <div class="empty-state" style="display:none;grid-column:1/-1;">No APIs match your filters.</div>
    </div>
  </div>
</main>`;

    const html = layout(cat.name, body, {
      depth: 1,
      description: cat.description,
      og_url: `${SITE_URL}/categories/${cat.id}.html`,
    });
    fs.writeFileSync(path.join(PAGES, 'categories', `${cat.id}.html`), html);
    console.log(`  \u2713 pages/categories/${cat.id}.html`);
  });
}

// ============================================================
// API PAGES
// ============================================================

function buildApiPages() {
  apis.forEach(api => {
    const cat = categoryMap[api.category];
    const endpoint = api.endpoints[0];

    // Related APIs: same category, excluding self
    const related = apis
      .filter(a => a.id !== api.id && (a.category === api.category || a.tags.some(t => api.tags.includes(t))))
      .slice(0, 3);

    const body = `
<main>
  <div class="container">
    <div class="breadcrumb">
      <a href="/">StupidAPIs.com</a><span class="sep">&gt;</span>
      <a href="/categories/${api.category}.html">${cat ? cat.name : api.category}</a><span class="sep">&gt;</span>
      ${api.name}
    </div>

    <!-- Header -->
    <div class="api-header">
      <h1>${api.name}</h1>
      <div class="api-header-meta">
        ${categoryBadge(api.category)}
        ${stupidityRating(api.stupidity)}
        <span class="call-count">${api.call_count.toLocaleString()} calls</span>
      </div>
      <p class="description">${api.long_description}</p>
    </div>

    <!-- Playground -->
    <section class="section" id="playground">
      <h2>Try It &mdash; No Seriously</h2>
      <div class="windows-dialog">
        <div class="windows-titlebar">
          <span>${api.name}.exe</span>
          <div class="windows-titlebar-buttons">
            <span class="windows-titlebar-btn">_</span>
            <span class="windows-titlebar-btn">\u25a1</span>
            <span class="windows-titlebar-btn">\u00d7</span>
          </div>
        </div>
        <div class="windows-body">
          <form id="playground-form" data-base-url="${api.base_url}" data-endpoint="${endpoint.path}" data-api-id="${api.id}">
            <div class="playground-form">
              ${api.parameters.map(p => renderParamField(p)).join('\n              ')}
            </div>
            <button type="submit" class="btn btn-primary playground-submit">CONSULT THE API</button>
          </form>

          <div id="playground-response" class="response-display" style="display:none;"></div>
          <div id="response-actions" class="response-actions" style="display:none;">
            <button id="copy-response">Copy Response</button>
            <button id="share-response">Share This Response</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Parameters -->
    <section class="section">
      <h2>Parameters</h2>
      <table class="params-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Required</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${api.parameters.map(p => `
          <tr>
            <td><code>${p.name}</code></td>
            <td><code>${p.type}</code></td>
            <td>${p.required ? '<span class="required-badge">Required</span>' : '<span class="optional-badge">Optional</span>'}</td>
            <td>${p.default ? `<code>${escapeHtml(p.default)}</code>` : '&mdash;'}</td>
            <td>${p.description}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </section>

    <!-- Code Examples -->
    <section class="section">
      <h2>Examples</h2>
      <div class="code-block-container">
        <div class="code-tabs">
          <button class="code-tab active" data-lang="curl">curl</button>
          <button class="code-tab" data-lang="python">Python</button>
          <button class="code-tab" data-lang="javascript">JavaScript</button>
        </div>
        <div class="code-panel active" data-lang="curl">
          <button class="code-copy-btn">Copy</button>
          <pre>${escapeHtml(api.examples.curl)}</pre>
        </div>
        <div class="code-panel" data-lang="python">
          <button class="code-copy-btn">Copy</button>
          <pre>${escapeHtml(api.examples.python)}</pre>
        </div>
        <div class="code-panel" data-lang="javascript">
          <button class="code-copy-btn">Copy</button>
          <pre>${escapeHtml(api.examples.javascript)}</pre>
        </div>
      </div>
    </section>

    <!-- Response Schema -->
    <section class="section">
      <h2>Response Schema</h2>
      <table class="params-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${api.response_schema.map(f => `
          <tr>
            <td><code>${f.field}</code>${f.optional ? ' <span class="optional-badge">conditional</span>' : ''}</td>
            <td><code>${f.type}</code></td>
            <td>${f.description}</td>
          </tr>`).join('')}
        </tbody>
      </table>

      <h3 style="margin-top:1.5rem;">Example Response</h3>
      <div class="response-display">
        <pre>${syntaxHighlightJSON(api.examples.response)}</pre>
      </div>
    </section>

    <!-- MCP -->
    <section class="section">
      <h2>MCP Access</h2>
      <p>This API is available as an MCP tool for AI assistants. Connect your agent to:</p>
      <div class="code-block-container">
        <div class="code-tabs">
          <button class="code-tab active" data-lang="mcp-single">This API</button>
          <button class="code-tab" data-lang="mcp-all">All APIs</button>
        </div>
        <div class="code-panel active" data-lang="mcp-single">
          <button class="code-copy-btn">Copy</button>
          <pre>POST https://api.stupidapis.com/${api.id}/mcp</pre>
        </div>
        <div class="code-panel" data-lang="mcp-all">
          <button class="code-copy-btn">Copy</button>
          <pre>POST https://api.stupidapis.com/mcp</pre>
        </div>
      </div>
      <p style="margin-top:1rem;">Use <a href="https://pipeworx.io/packs/${api.id}/" target="_blank">Pipeworx</a> to connect this MCP tool to Claude, ChatGPT, and other AI assistants with no code.</p>
    </section>

    ${related.length > 0 ? `
    <!-- Related APIs -->
    <section class="related-apis">
      <h2>More Questionable Technology</h2>
      <div class="grid grid-3">
        ${related.map(apiCard).join('\n        ')}
      </div>
    </section>` : ''}
  </div>
</main>

<script>
window.MOCK_RESPONSES = ${JSON.stringify(api.mock_responses)};
</script>
<script src="../assets/js/playground.js"></script>
<script>
// Show response display when form is submitted
document.getElementById('playground-form').addEventListener('submit', function() {
  document.getElementById('playground-response').style.display = '';
});
</script>`;

    const html = layout(api.name, body, {
      depth: 1,
      clippy_message: api.clippy_message,
      description: api.description,
      og_url: `${SITE_URL}/apis/${api.id}.html`,
    });

    fs.writeFileSync(path.join(PAGES, 'apis', `${api.id}.html`), html);
    console.log(`  \u2713 pages/apis/${api.id}.html`);
  });
}

function renderSelect(param, options) {
  return `<div class="playground-field">
  <label>${param.name}${param.required ? ' *' : ''}</label>
  <select data-param="${param.name}">
    ${options.map(o => `<option value="${o}">${o}</option>`).join('\n    ')}
  </select>
  <div class="field-desc">${param.description}</div>
</div>`;
}

function renderParamField(param) {
  if (param.type === 'boolean') {
    return `<div class="playground-field">
  <label class="playground-checkbox">
    <input type="checkbox" data-param="${param.name}">
    <span>${param.name}</span>
  </label>
  <div class="field-desc">${param.description}</div>
</div>`;
  }

  if (param.type === 'number') {
    return `<div class="playground-field">
  <label>${param.name}${param.required ? ' *' : ''}</label>
  <input type="number" data-param="${param.name}" ${param.default && param.default !== 'auto-detected' ? `value="${param.default}"` : ''} ${param.required ? 'required' : ''}>
  <div class="field-desc">${param.description}</div>
</div>`;
  }

  // Enum selects — use options array from parameter definition if available
  if (param.options) {
    return renderSelect(param, param.options);
  }

  return `<div class="playground-field">
  <label>${param.name}${param.required ? ' *' : ''}</label>
  <input type="text" data-param="${param.name}" ${param.required ? 'required' : ''} placeholder="${param.required ? 'Required' : 'Optional'}">
  <div class="field-desc">${param.description}</div>
</div>`;
}

function syntaxHighlightJSON(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(?:[^"\\]|\\.)*")\s*:/g,
      '<span class="json-key">$1</span>:'
    )
    .replace(
      /:\s*("(?:[^"\\]|\\.)*")/g,
      ': <span class="json-string">$1</span>'
    )
    .replace(
      /:\s*(-?\d+(?:\.\d+)?)/g,
      ': <span class="json-number">$1</span>'
    )
    .replace(
      /:\s*(true|false)/g,
      ': <span class="json-boolean">$1</span>'
    )
    .replace(
      /:\s*(null)/g,
      ': <span class="json-null">$1</span>'
    );
}

// ============================================================
// DOCS PAGE
// ============================================================

function buildDocsPage() {
  const body = `
<main>
  <div class="container">
    <div class="docs-content">
      <h1>Documentation</h1>
      <p>Everything you need to know about making terrible decisions programmatically.</p>

      <h2>Getting Started</h2>
      <p>Using StupidAPIs is simple. Pick an API, make a request, receive questionable wisdom. No setup required. No SDK needed. No regrets guaranteed (regrets not guaranteed).</p>
      <pre><code>curl "https://api.stupidapis.com/magic-8-ball/ask?question=Should+I+read+the+docs"</code></pre>
      <p>That's it. You're now a StupidAPIs developer. Update your LinkedIn.</p>

      <h2>Base URL</h2>
      <p>All API endpoints are available at:</p>
      <pre><code>https://api.stupidapis.com</code></pre>
      <p>Each API has its own path prefix. For example, the Magic 8 Ball lives at <code>/magic-8-ball/</code>.</p>

      <h2>Authentication</h2>
      <p>None required. We trust you. This is our first mistake.</p>
      <p>We don't need your API key, your OAuth token, or your firstborn child. Just make requests. We believe in you, even if our APIs don't.</p>

      <h2>Rate Limits</h2>
      <p>Rate limits depend on whether an API has an LLM behind it. Please don't be weird about it.</p>
      <table class="error-table">
        <thead><tr><th>Type</th><th>Limit</th></tr></thead>
        <tbody>
          <tr><td>LLM-powered APIs</td><td>5 req/min per IP</td></tr>
          <tr><td>Deterministic APIs</td><td>Unlimited (please still don't be weird)</td></tr>
        </tbody>
      </table>
      <p>When rate limited, you'll receive a <code>429 Too Many Requests</code> with <code>X-RateLimit-Remaining</code> and <code>X-RateLimit-Reset</code> headers.</p>

      <h2>LLM-Powered vs. Deterministic</h2>
      <p>Some APIs use Claude Haiku for response generation. Others are pure deterministic chaos. Here's the breakdown:</p>
      <p><strong>Uses Haiku:</strong> Emoji Oracle, Startup Oracle, Buzzword Density (roast mode), Passive Aggression, Could Have Been Email, Jargon Translator, Tarot Draw, Mercury Number, Chaos Index (interpretation), Scream Void, The Committee (minutes), Yesterday's Number (tasting notes)</p>
      <p><strong>Pure deterministic:</strong> Magic 8-Ball, Ship on Friday, Schr\u00f6dinger's Boolean, Send That Email, Take the Meeting, Always Seven, ISS Number, Phoenix Number, Temperature Random</p>
      <p>The LLM-powered APIs produce different responses each time. The deterministic APIs produce the same response to the same inputs. Both are equally unhelpful.</p>

      <h2>Request Format</h2>
      <p>All APIs accept both <code>GET</code> and <code>POST</code> requests.</p>
      <ul>
        <li><strong>GET:</strong> Parameters as query strings</li>
        <li><strong>POST:</strong> Parameters as JSON body with <code>Content-Type: application/json</code></li>
      </ul>
      <p>All responses are JSON. Always. Even the errors. Especially the errors.</p>

      <h2>MCP (Model Context Protocol)</h2>
      <p>Every API is also available as an MCP tool for AI assistants. The MCP endpoint lives at:</p>
      <pre><code>POST https://api.stupidapis.com/mcp          # All tools
POST https://api.stupidapis.com/{slug}/mcp   # Single API pack</code></pre>
      <p>This means you can give your AI assistant the ability to make terrible decisions on your behalf. Delegation at its finest.</p>
      <p>Use <a href="https://pipeworx.io/packs/">Pipeworx</a> to connect StupidAPIs MCP tools to Claude, ChatGPT, and other AI assistants with no code.</p>

      <h2>Error Codes</h2>
      <table class="error-table">
        <thead>
          <tr><th>Code</th><th>Meaning</th><th>What We Say</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>200</code></td>
            <td>Success</td>
            <td>Your request worked. The advice, however, may not.</td>
          </tr>
          <tr>
            <td><code>400</code></td>
            <td>Bad Request</td>
            <td>You sent us something we can't parse. Impressive, given how low our standards are.</td>
          </tr>
          <tr>
            <td><code>404</code></td>
            <td>Not Found</td>
            <td>That API doesn't exist. Yet. We're always working on new bad ideas.</td>
          </tr>
          <tr>
            <td><code>429</code></td>
            <td>Rate Limited</td>
            <td>Slow down. Whatever you're doing, it can wait. Especially if it's consulting the Emoji Oracle.</td>
          </tr>
          <tr>
            <td><code>500</code></td>
            <td>Server Error</td>
            <td>We broke something. This is the most honest our APIs have ever been.</td>
          </tr>
          <tr>
            <td><code>418</code></td>
            <td>I'm a Teapot</td>
            <td>You asked Schr\u00f6dinger's Boolean to reopen a collapsed wavefunction. Physics said no.</td>
          </tr>
        </tbody>
      </table>

      <h2>SDKs</h2>
      <p>We don't have any. Use <code>curl</code> like a person.</p>
      <p>If you want a wrapper library, you're welcome to write one. We recommend naming it something like <code>stupid-sdk</code> and publishing it to npm with zero tests. That's on brand.</p>

      <h2>FAQ</h2>
      <h3>Is this real?</h3>
      <p>The APIs are real. The advice is not. The infrastructure costs are, unfortunately, very real.</p>

      <h3>Can I use this in production?</h3>
      <p>You can. Should you? Consult our "Should I Ship on Friday" API. (The answer is no, but the API will tell you that.)</p>

      <h3>Is there a free tier?</h3>
      <p>Yes. It's called the Cheap Bastard plan. 5 LLM requests per minute, unlimited deterministic APIs, zero dollars. See <a href="/pricing.html">Pricing</a> for the tiers where we pretend to be a real business.</p>

      <h3>How do I report a bug?</h3>
      <p>Open a GitHub issue. Describe what you expected and what you got. We'll fix it if it's actually broken. If our API gave you bad advice, that's a feature.</p>

      <h3>Can I contribute a Stupid API?</h3>
      <p>Absolutely. Check the <a href="https://github.com/stupidapis">GitHub repo</a> for contribution guidelines. The only requirement is that your API must be genuinely, confidently, unrepentantly stupid.</p>

      <h2>What Is This?</h2>
      <p>StupidAPIs is a collection of deliberately absurd REST APIs that do things no reasonable person would ask a computer to do. Each API is fully functional, well-documented, and completely unhelpful.</p>
      <p>Every API is also available as an MCP server (for AI tool use) and an OpenClaw skill. Because if you're going to build something stupid, you should build it for every platform.</p>
      <p>This project exists because the world has enough serious APIs. What it needs is more APIs that tell you not to deploy on Friday, interpret your life through emoji, and evaluate your startup ideas with brutal honesty.</p>
      <p>We're not sorry.</p>
    </div>
  </div>
</main>`;

  const html = layout('Documentation', body, {
    depth: 0,
    description: 'How to use StupidAPIs. REST + MCP. No SDK. No setup. No regrets guaranteed.',
    og_url: `${SITE_URL}/docs.html`,
    clippy_message: "It looks like you're reading documentation. That's more than most developers do."
  });

  fs.writeFileSync(path.join(PAGES, 'docs.html'), html);
  console.log('  \u2713 pages/docs.html');
}

// ============================================================
// PRICING PAGE
// ============================================================

function buildPricingPage() {
  const body = `
<main>
  <div class="container">
    <div class="pricing-header">
      <h1>Pricing</h1>
      <p class="subhead">Pay us money to make bad decisions faster</p>

      <div class="billing-toggle">
        <span class="billing-label" data-period="annual">Annual <span class="billing-save">Save ~33%</span></span>
        <button class="billing-switch" id="billing-switch" aria-label="Toggle billing period">
          <span class="billing-switch-track">
            <span class="billing-switch-thumb"></span>
          </span>
        </button>
        <span class="billing-label" data-period="monthly">Monthly</span>
      </div>
    </div>

    <div class="pricing-grid">

      <!-- Cheap Bastard -->
      <div class="pricing-card">
        <div class="pricing-card-header">
          <span class="pricing-stupidity">\ud83c\udf2d</span>
          <h2>Cheap Bastard</h2>
          <p class="pricing-tagline">For the financially cautious decision-maker</p>
        </div>
        <div class="pricing-price">
          <span class="price-amount">$0</span>
          <span class="price-period">/mo forever</span>
        </div>
        <ul class="pricing-features">
          <li><strong>5 req/min</strong> \u2014 LLM-powered APIs</li>
          <li><strong>Unlimited</strong> \u2014 deterministic APIs</li>
          <li>Clippy judges you silently</li>
          <li>Support: Stack Overflow, probably</li>
          <li>Rate limit error messages are passive-aggressive</li>
        </ul>
        <a href="#" class="btn btn-outline pricing-btn">Start for Free</a>
        <p class="pricing-footnote">No credit card required. We trust you. Mistake #1.</p>
      </div>

      <!-- Poor Life Choices -->
      <div class="pricing-card">
        <div class="pricing-card-header">
          <span class="pricing-stupidity">\ud83c\udf2d\ud83c\udf2d</span>
          <h2>Poor Life Choices</h2>
          <p class="pricing-tagline">You looked at these APIs and thought "I should pay for this"</p>
        </div>
        <div class="pricing-price">
          <span class="price-amount" data-annual="$4" data-monthly="$6">$4</span>
          <span class="price-period" data-annual="/mo billed annually" data-monthly="/mo billed monthly">/mo billed annually</span>
        </div>
        <ul class="pricing-features">
          <li><strong>20 req/min</strong> \u2014 LLM-powered APIs</li>
          <li><strong>Unlimited</strong> \u2014 deterministic APIs</li>
          <li>Clippy judges you out loud</li>
          <li>Email support (we'll read it eventually)</li>
          <li>Rate limit error messages are encouraging</li>
          <li>API key with your name on it</li>
        </ul>
        <a href="https://buy.stripe.com/6oUbJ00tQaPM8V0dIUes000" class="btn btn-primary pricing-btn" data-stripe-annual="https://buy.stripe.com/6oUbJ00tQaPM8V0dIUes000" data-stripe-monthly="https://buy.stripe.com/4gM5kC90m9LI3AG8oAes001">Subscribe</a>
        <p class="pricing-footnote" data-annual="$48 billed annually" data-monthly="$6/mo, cancel anytime">$48 billed annually</p>
      </div>

      <!-- Professionally Unhinged -->
      <div class="pricing-card pricing-card-featured">
        <div class="pricing-card-badge">MOST POPULAR (SUSPICIOUSLY)</div>
        <div class="pricing-card-header">
          <span class="pricing-stupidity">\ud83c\udf2d\ud83c\udf2d\ud83c\udf2d</span>
          <h2>Professionally Unhinged</h2>
          <p class="pricing-tagline">For when "why not" becomes a business strategy</p>
        </div>
        <div class="pricing-price">
          <span class="price-amount" data-annual="$9" data-monthly="$13">$9</span>
          <span class="price-period" data-annual="/mo billed annually" data-monthly="/mo billed monthly">/mo billed annually</span>
        </div>
        <ul class="pricing-features">
          <li><strong>60 req/min</strong> \u2014 LLM-powered APIs</li>
          <li><strong>Unlimited</strong> \u2014 deterministic APIs</li>
          <li>Priority Clippy (faster, not better)</li>
          <li>Email support (we'll read it this week)</li>
          <li>Rate limit error messages contain life advice</li>
          <li>API usage dashboard</li>
          <li>Webhook notifications (for when you've gone too far)</li>
        </ul>
        <a href="https://buy.stripe.com/3cI8wO2BYe1Y3AGfR2es002" class="btn btn-primary pricing-btn" data-stripe-annual="https://buy.stripe.com/3cI8wO2BYe1Y3AGfR2es002" data-stripe-monthly="https://buy.stripe.com/fZu9AS7Wi0b84EKfR2es003">Subscribe</a>
        <p class="pricing-footnote" data-annual="$108 billed annually" data-monthly="$13/mo, cancel anytime">$108 billed annually</p>
      </div>

      <!-- Somebody Else's Budget -->
      <div class="pricing-card pricing-card-enterprise">
        <div class="pricing-card-header">
          <span class="pricing-stupidity">\ud83c\udf2d\ud83c\udf2d\ud83c\udf2d\ud83c\udf2d</span>
          <h2>Somebody Else's Budget</h2>
          <p class="pricing-tagline">For when the expense report goes to a department you've never heard of</p>
        </div>
        <div class="pricing-price">
          <span class="price-amount" data-annual="$349" data-monthly="$499">$349</span>
          <span class="price-period" data-annual="/mo billed annually" data-monthly="/mo billed monthly">/mo billed annually</span>
        </div>
        <ul class="pricing-features">
          <li><strong>Unlimited</strong> \u2014 all APIs, no rate limits</li>
          <li>Dedicated Clippy instance</li>
          <li>SLA (Suspiciously Lenient Agreement)</li>
          <li>Custom stupidity levels</li>
          <li>SOC 2 compliant (we think)</li>
          <li>Diane from The Committee will personally dissent on your behalf</li>
          <li>Your logo on our refrigerator</li>
          <li>We will attend one meeting per quarter and tell you it could have been an email</li>
        </ul>
        <a href="https://buy.stripe.com/6oU9ASekG7DA0ou6gses004" class="btn btn-primary pricing-btn" data-stripe-annual="https://buy.stripe.com/6oU9ASekG7DA0ou6gses004" data-stripe-monthly="https://buy.stripe.com/14AeVc6Se0b8fjodIUes005">Subscribe</a>
        <p class="pricing-footnote" data-annual="$4,188 billed annually" data-monthly="$499/mo, cancel anytime">$4,188 billed annually</p>
      </div>

    </div>

    <!-- FAQ -->
    <div class="pricing-faq">
      <h2>Pricing FAQ</h2>

      <h3>Why would I pay for this?</h3>
      <p>Excellent question. We've consulted our Startup Oracle and it says your judgment is "questionable but not unprecedented." The paid tiers give you higher rate limits for LLM-powered APIs. Whether that's worth money is between you and your accountant.</p>

      <h3>Can I expense this?</h3>
      <p>The Somebody Else's Budget tier was specifically designed for corporate expense reports. List it under "Developer Tooling" or "Innovation R&D." Both are technically accurate and neither will be questioned.</p>

      <h3>What happens if I hit the rate limit?</h3>
      <p>You'll get a <code>429 Too Many Requests</code> response. On the free tier, the error message is passive-aggressive. On paid tiers, it's encouraging. On Enterprise, it never happens because nothing has limits when you're on Somebody Else's Budget.</p>

      <h3>Do you offer refunds?</h3>
      <p>If our APIs give you bad advice that you follow, that's on you. If they give you bad advice that you don't follow, you didn't need us. Either way, no refunds. Yes refunds. We offer full refunds within 30 days, no questions asked. We will, however, silently judge.</p>

      <h3>What's the SLA?</h3>
      <p>Our Suspiciously Lenient Agreement guarantees 99.9% uptime. The 0.1% is when Gerald from The Committee accidentally unplugs something. If we miss the SLA, we'll credit you the equivalent in Clippy motivational quotes.</p>

      <h3>Is the Enterprise tier real?</h3>
      <p>As real as anything else here. You will get unlimited requests. Diane will dissent. Your logo will go on our refrigerator. We keep our promises. Even the stupid ones. Especially the stupid ones.</p>
    </div>

  </div>
</main>

<script>
(function() {
  const toggle = document.getElementById('billing-switch');
  if (!toggle) return;

  let isMonthly = false;

  toggle.addEventListener('click', function() {
    isMonthly = !isMonthly;
    toggle.classList.toggle('monthly', isMonthly);

    document.querySelectorAll('[data-annual]').forEach(function(el) {
      if (el.tagName === 'A') {
        el.href = isMonthly ? el.dataset.stripeMonthly : el.dataset.stripeAnnual;
      } else {
        el.textContent = isMonthly ? el.dataset.monthly : el.dataset.annual;
      }
    });

    document.querySelectorAll('.billing-label').forEach(function(lbl) {
      lbl.classList.toggle('active', lbl.dataset.period === (isMonthly ? 'monthly' : 'annual'));
    });
  });

  // Set initial state
  document.querySelectorAll('.billing-label[data-period="annual"]').forEach(function(l) { l.classList.add('active'); });
})();
</script>`;

  const html = layout('Pricing', body, {
    depth: 0,
    description: 'Pay us money to make bad decisions faster. Four tiers, all questionable.',
    og_url: `${SITE_URL}/pricing.html`,
    clippy_message: "It looks like you're considering paying for stupid APIs. I respect the commitment."
  });

  fs.writeFileSync(path.join(PAGES, 'pricing.html'), html);
  console.log('  \u2713 pages/pricing.html');
}

// ============================================================
// CONTRIBUTE PAGE
// ============================================================

function buildContributePage() {
  const body = `
<main>
  <div class="container">
    <div class="docs-content">
      <h1>Contribute a Stupid API</h1>
      <p class="subhead">We host every pack on our own infrastructure. That means submissions are code we read and merge.</p>

      <h2>The bar</h2>
      <p>Specific. Dry. Confidently wrong. The voice is deadpan. No exclamation points. The joke is in the precision.</p>

      <h2>Two ways to submit</h2>

      <div class="contribute-cards">
        <div class="contribute-card">
          <h3>I have code</h3>
          <p>Open a pull request that adds a pack under <code>apis/{your-slug}/</code>, an entry in <code>website/data/apis.json</code>, and a <code>SKILL.md</code>. Our CI checks the security boundary automatically.</p>
          <a href="https://github.com/stupidapis/stupid-apis/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" class="btn btn-primary">Read CONTRIBUTING.md</a>
          <a href="https://github.com/stupidapis/stupid-apis/compare" target="_blank" rel="noopener" class="btn btn-outline">Open a PR</a>
        </div>

        <div class="contribute-card">
          <h3>I just have an idea</h3>
          <p>Open a GitHub issue with the "stupid API idea" template. Tell us what it is, what a single call returns, and why it's stupid. We may build it. We make no promises.</p>
          <a href="https://github.com/stupidapis/stupid-apis/issues/new?template=idea.md" target="_blank" rel="noopener" class="btn btn-primary">Submit an idea</a>
        </div>
      </div>

      <h2>The hard rules</h2>
      <p>These are the security boundary. CI rejects PRs that violate them.</p>
      <ul>
        <li><strong>No <code>fetch()</code> calls in pack source.</strong> Need a model? Import <code>callHaiku</code> from <code>@stupid-apis/shared</code>.</li>
        <li><strong>No external imports.</strong> The only allowed import is <code>@stupid-apis/shared</code>.</li>
        <li><strong>No <code>eval</code>, <code>new Function</code>, <code>require</code>, or <code>process</code>.</strong> Pure functions only.</li>
        <li><strong>No state outside the function.</strong> Each call is independent.</li>
        <li><strong>Deterministic where possible.</strong> A curated list of 20 hand-picked items beats a procedural template that produces 2000.</li>
      </ul>

      <h2>What we review for</h2>
      <ul>
        <li>Voice fit (specific, dry, deadpan)</li>
        <li>Security boundary (the rules above)</li>
        <li>Dedup vs existing packs</li>
        <li>Whether it makes us laugh once</li>
      </ul>

      <h2>What happens if we accept</h2>
      <p>We assign a <code>releaseDate</code> and the pack drops on its day. You get attribution on the API page.</p>

      <h2>Starter template</h2>
      <p>Copy <a href="https://github.com/stupidapis/stupid-apis/tree/main/apis/dad-joke" target="_blank" rel="noopener"><code>apis/dad-joke/</code></a> — it's the cleanest example of a deterministic pack. Replace the slug, the joke list, and the tool name.</p>
    </div>
  </div>
</main>`;

  const html = layout('Contribute', body, {
    depth: 0,
    description: 'Submit a stupid API. PR-based. Security-linted. We host every pack on our own infrastructure.',
    og_url: `${SITE_URL}/contribute.html`,
    clippy_message: "It looks like you want to contribute. Have you read CONTRIBUTING.md?"
  });

  fs.writeFileSync(path.join(PAGES, 'contribute.html'), html);
  console.log('  ✓ pages/contribute.html');
}

// ============================================================
// BUILD
// ============================================================

console.log('\nBuilding StupidAPIs.com...\n');
console.log(`  ${apis.length} APIs loaded`);
console.log(`  ${categories.length} categories loaded\n`);

buildHomepage();
buildCategoryPages();
buildApiPages();
buildDocsPage();
buildPricingPage();
buildContributePage();

// Copy assets into pages/ for deployment
const assetsDest = path.join(PAGES, 'assets');
copyDirSync(path.join(ROOT, 'assets'), assetsDest);
console.log('  \u2713 assets copied');

console.log('\nBuild complete! Serve from pages/ directory.\n');
console.log('  npx serve pages/');
console.log('  # or');
console.log('  python3 -m http.server -d pages/ 8080\n');
