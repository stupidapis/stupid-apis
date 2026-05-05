/* === StupidAPIs.com Playground === */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('playground-form');
  if (!form) return;

  const responseEl = document.getElementById('playground-response');
  const submitBtn = form.querySelector('.playground-submit');
  const baseUrl = form.dataset.baseUrl || '';
  const endpoint = form.dataset.endpoint || '';
  const apiId = form.dataset.apiId || '';
  const mockData = window.MOCK_RESPONSES || [];

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect params
    const params = new URLSearchParams();
    form.querySelectorAll('[data-param]').forEach(input => {
      const name = input.dataset.param;
      let value;
      if (input.type === 'checkbox') {
        value = input.checked ? 'true' : 'false';
      } else {
        value = input.value;
      }
      if (value && value !== '' && value !== 'false') {
        params.set(name, value);
      }
    });

    // Show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'CONSULTING...';
    responseEl.innerHTML = '<span class="response-loading">Consulting the API...<span class="loading-dots"></span></span>';

    // Simulate slight delay for drama
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    let data;
    try {
      const url = `${baseUrl}${endpoint}?${params.toString()}`;
      const res = await fetch(url);
      if (res.ok) {
        data = await res.json();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      // Fall back to mock data
      data = getMockResponse(mockData, params);
    }

    renderResponse(responseEl, data, apiId);
    submitBtn.disabled = false;
    submitBtn.textContent = 'CONSULT THE API';

    // Show response actions
    const actions = document.getElementById('response-actions');
    if (actions) actions.style.display = 'flex';
  });

  // Copy response button
  const copyBtn = document.getElementById('copy-response');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const pre = responseEl.querySelector('pre');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent).then(() => {
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = orig; }, 1500);
      });
    });
  }

  // Share response button
  const shareBtn = document.getElementById('share-response');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const params = new URLSearchParams();
      form.querySelectorAll('[data-param]').forEach(input => {
        const name = input.dataset.param;
        let value;
        if (input.type === 'checkbox') {
          if (input.checked) params.set(name, 'true');
        } else if (input.value) {
          params.set(name, input.value);
        }
      });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      navigator.clipboard.writeText(url).then(() => {
        const orig = shareBtn.textContent;
        shareBtn.textContent = 'Link copied!';
        setTimeout(() => { shareBtn.textContent = orig; }, 1500);
      });
    });
  }
});

function getMockResponse(mocks, params) {
  if (!mocks.length) return { error: 'No response available' };
  // Pick a random mock, or one that matches the question if available
  const question = params.get('question') || params.get('idea') || params.get('content') || '';
  if (question) {
    const match = mocks.find(m =>
      (m.question || '').toLowerCase().includes(question.toLowerCase().substring(0, 10))
    );
    if (match) return { ...match };
  }
  return { ...mocks[Math.floor(Math.random() * mocks.length)] };
}

function renderResponse(container, data, apiId) {
  const html = syntaxHighlight(data, apiId);
  container.innerHTML = `<pre>${html}</pre>`;
}

function syntaxHighlight(obj, apiId) {
  const json = JSON.stringify(obj, null, 2);
  // Replace JSON tokens with spans
  return json.replace(
    /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")\s*:/g,
    '<span class="json-key">$1</span>:'
  ).replace(
    /:\s*("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")/g,
    (match, str) => {
      const raw = str.slice(1, -1);
      // Check for special renderings
      const rendered = renderSpecialField(raw, obj, apiId);
      if (rendered) return ': ' + rendered;
      return ': <span class="json-string">' + str + '</span>';
    }
  ).replace(
    /:\s*(-?\d+(?:\.\d+)?)/g,
    ': <span class="json-number">$1</span>'
  ).replace(
    /:\s*(true|false)/g,
    ': <span class="json-boolean">$1</span>'
  ).replace(
    /:\s*(null)/g,
    ': <span class="json-null">$1</span>'
  );
}

function renderSpecialField(value, data, apiId) {
  // Prophecy field - render emojis larger
  if (data.prophecy && value === data.prophecy) {
    return `<span class="prophecy-display">${escapeHtml(value)}</span>`;
  }

  // Vibe check - render as colored badge
  if (data.vibe_check && value === data.vibe_check) {
    const cls = value === 'positive' ? 'positive' : value === 'negative' ? 'negative' : 'chaotic';
    return `<span class="vibe-badge ${cls}">${escapeHtml(value)}</span>`;
  }

  // Score bars for numeric score fields
  if (typeof data.on_call_sympathy_score === 'number' &&
      value === String(data.on_call_sympathy_score)) {
    return renderScoreBar(data.on_call_sympathy_score);
  }
  if (typeof data.email_viability_score === 'number' &&
      value === String(data.email_viability_score)) {
    return renderScoreBar(data.email_viability_score);
  }

  return null;
}

function renderScoreBar(score) {
  const cls = score >= 70 ? 'red' : score >= 40 ? 'yellow' : 'green';
  return `<span class="score-bar-container"><span class="score-bar"><span class="score-bar-fill ${cls}" style="width:${score}%"></span></span><span class="score-bar-value">${score}</span></span>`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
