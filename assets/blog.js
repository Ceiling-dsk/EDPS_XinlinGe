(() => {
  const filters = document.querySelector('.blog-filter');
  if (!filters) return;

  const group = filters.querySelector('[role="group"]');
  const allButton = group.querySelector('[data-all]');
  const status = document.querySelector('.blog-status');
  const empty = document.querySelector('.blog-no-matches');
  const labels = new Map();
  const normalize = tag => tag.trim().normalize('NFC').toLowerCase();
  const entries = Array.from(document.querySelectorAll('.blog-row'), row => {
    const topics = Array.from(row.querySelectorAll('[data-note-tag]'), link => link.textContent);
    const keys = new Set();
    for (const text of [row.dataset.source, ...topics]) {
      const key = normalize(text || '');
      if (!key) continue;
      keys.add(key);
      if (!labels.has(key)) labels.set(key, text.trim());
    }
    return { row, keys };
  });
  if (!labels.size) return;

  // The same links work from article pages and for a shared filtered view.
  const address = new URL(window.location.href);
  const selection = new Set(address.searchParams.getAll('tag').map(normalize).filter(key => labels.has(key)));
  const buttons = new Map();

  function apply(saveAddress) {
    allButton.setAttribute('aria-pressed', String(!selection.size));
    for (const [key, button] of buttons) {
      button.setAttribute('aria-pressed', String(selection.has(key)));
    }
    let visible = 0;
    for (const { row, keys } of entries) {
      row.hidden = Array.from(selection).some(key => !keys.has(key));
      if (!row.hidden) visible++;
    }
    empty.hidden = visible !== 0;
    status.textContent = visible + (visible === 1 ? ' reading note.' : ' reading notes.');
    if (saveAddress) {
      address.searchParams.delete('tag');
      for (const key of selection) address.searchParams.append('tag', labels.get(key));
      window.history.replaceState(null, '', address);
    }
  }

  for (const [key, label] of Array.from(labels).sort((a, b) => a[1].localeCompare(b[1]))) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => {
      if (selection.has(key)) selection.delete(key);
      else selection.add(key);
      apply(true);
    });
    group.append(button);
    buttons.set(key, button);
  }
  allButton.addEventListener('click', () => {
    selection.clear();
    apply(true);
  });
  filters.hidden = false;
  apply(false);
})();
