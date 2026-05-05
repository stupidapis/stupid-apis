/* === StupidAPIs.com Clippy === */

document.addEventListener('DOMContentLoaded', () => {
  const clippy = document.getElementById('clippy-widget');
  if (!clippy) return;

  const bubble = clippy.querySelector('.clippy-bubble');
  const dismissKey = 'stupidapis-clippy-dismissed';
  const dismissDuration = 5 * 60 * 1000; // 5 minutes

  const dismissedAt = parseInt(localStorage.getItem(dismissKey) || '0', 10);
  const elapsed = Date.now() - dismissedAt;

  function randomSaying() {
    if (!window.CLIPPY_SAYINGS || !window.CLIPPY_SAYINGS.length) return null;
    return window.CLIPPY_SAYINGS[Math.floor(Math.random() * window.CLIPPY_SAYINGS.length)];
  }

  function setSaying() {
    if (!bubble) return;
    // If the page set a specific message via data attribute, use it sometimes
    // but rotate in random sayings too
    const pageMessage = clippy.dataset.pageMessage;
    if (pageMessage && Math.random() < 0.4) {
      bubble.textContent = pageMessage;
    } else {
      const saying = randomSaying();
      if (saying) bubble.textContent = saying;
    }
  }

  function showClippy() {
    setSaying();
    clippy.classList.add('visible');
  }

  function dismissClippy() {
    clippy.classList.remove('visible');
    localStorage.setItem(dismissKey, Date.now().toString());
    // Come back after 5 minutes with a new saying (intentional, on brand)
    setTimeout(showClippy, dismissDuration);
  }

  const dismissBtn = clippy.querySelector('.clippy-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', dismissClippy);
  }

  // Show after delay, unless recently dismissed
  if (elapsed > dismissDuration) {
    setTimeout(showClippy, 3000);
  } else {
    setTimeout(showClippy, dismissDuration - elapsed);
  }
});
