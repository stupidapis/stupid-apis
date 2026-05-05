/* === StupidAPIs.com Main JS === */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initHotdogToggle();
  initHitCounter();
  initFilterBar();
  initCodeTabs();
  initCopyButtons();
});

/* === Hot Dog Cart Theme Toggle === */
function initHotdogToggle() {
  const btn = document.getElementById('hotdog-toggle');
  if (!btn) return;

  const label = btn.querySelector('.hotdog-toggle-label');
  const stored = localStorage.getItem('stupidapis-hotdog');

  function setTheme(on) {
    document.body.classList.toggle('hotdog-mode', on);
    if (label) {
      label.textContent = on ? label.dataset.on : label.dataset.off;
    }
    btn.classList.toggle('active', on);
    localStorage.setItem('stupidapis-hotdog', on ? '1' : '0');
  }

  // Restore saved preference
  if (stored === '1') setTheme(true);

  btn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('hotdog-mode'));
  });
}

/* === Mobile Nav Toggle === */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.textContent = nav.classList.contains('open') ? '\u2715' : '\u2630';
  });
}

/* === Hit Counter === */
function initHitCounter() {
  const counter = document.getElementById('hit-counter');
  if (!counter) return;

  // Random large number displayed as exponent notation
  const base = (Math.random() * 9 + 1).toFixed(6);
  const exp = Math.floor(Math.random() * 12) + 6;
  counter.innerHTML = `${base} &times; 10<sup>${exp}</sup>`;
}

/* === Filter Bar === */
function initFilterBar() {
  const categoryFilter = document.getElementById('filter-category');
  const stupidityFilter = document.getElementById('filter-stupidity');
  const searchInput = document.getElementById('filter-search');
  const catalog = document.getElementById('api-catalog');

  if (!catalog) return;

  function applyFilters() {
    const cards = catalog.querySelectorAll('.api-card');
    const category = categoryFilter ? categoryFilter.value : '';
    const stupidity = stupidityFilter ? stupidityFilter.value : '';
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    let visible = 0;

    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardStupidity = card.dataset.stupidity || '';
      const cardText = (card.textContent || '').toLowerCase();

      let show = true;
      if (category && cardCategory !== category) show = false;
      if (stupidity && cardStupidity !== stupidity) show = false;
      if (search && !cardText.includes(search)) show = false;

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const empty = catalog.querySelector('.empty-state');
    if (empty) {
      empty.style.display = visible === 0 ? '' : 'none';
    }
  }

  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (stupidityFilter) stupidityFilter.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  // Sort buttons
  const sortBtns = document.querySelectorAll('.sort-btn');
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortCatalog(btn.dataset.sort, catalog);
    });
  });
}

function sortCatalog(sortBy, catalog) {
  const cards = Array.from(catalog.querySelectorAll('.api-card'));
  cards.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      case 'calls':
        return parseInt(b.dataset.calls || '0', 10) - parseInt(a.dataset.calls || '0', 10);
      case 'stupidity':
        return parseInt(b.dataset.stupidity || '0', 10) - parseInt(a.dataset.stupidity || '0', 10);
      default:
        return 0;
    }
  });
  const empty = catalog.querySelector('.empty-state');
  cards.forEach(card => catalog.appendChild(card));
  if (empty) catalog.appendChild(empty);
}

/* === Code Tabs === */
function initCodeTabs() {
  document.querySelectorAll('.code-block-container').forEach(container => {
    const tabs = container.querySelectorAll('.code-tab');
    const panels = container.querySelectorAll('.code-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = container.querySelector(`[data-lang="${tab.dataset.lang}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* === Copy Buttons === */
function initCopyButtons() {
  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.code-panel');
      const pre = panel ? panel.querySelector('pre') : null;
      if (!pre) return;

      navigator.clipboard.writeText(pre.textContent).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      });
    });
  });
}
