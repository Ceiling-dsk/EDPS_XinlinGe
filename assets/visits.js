(() => {
  const map = document.querySelector('[data-visitor-map]');
  if (map && location.hash === '#personal') return; // This legacy homepage URL redirects to About.
  const endpoint = 'https://xinlin-visitor-map.vercel.app/api/visits';

  async function request(method) {
    const timeout = new AbortController();
    const timer = setTimeout(() => timeout.abort(), 8000);
    try {
      const response = await fetch(endpoint, {
        method, credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error',
        cache: 'no-store', signal: timeout.signal
      });
      if (!response.ok) throw new Error();
      if (!map) return;
      const data = await response.json();
      if (!data || Object.keys(data).join(',') !== 'countries' || !data.countries ||
          typeof data.countries !== 'object' || Array.isArray(data.countries)) throw new Error();
      let total = 0;
      const counts = new Map();
      for (const [code, count] of Object.entries(data.countries)) {
        if (!/^[A-Z]{2}$/.test(code) || !Number.isSafeInteger(count) || count < 0) throw new Error();
        total += count;
        if (!Number.isSafeInteger(total)) throw new Error();
        if (count) counts.set(code, count);
      }
      return { counts, total };
    } finally {
      clearTimeout(timer);
    }
  }

  function render({ counts, total }) {
    const names = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
    const nameOf = code => names?.of(code) || code;
    const format = new Intl.NumberFormat('en');
    const status = map.querySelector('[data-visit-status]');
    const list = map.querySelector('[data-visit-list]');
    const rows = Array.from(counts, ([code, count]) => ({ code, count, name: nameOf(code) }));
    rows.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const fragment = document.createDocumentFragment();
    for (const row of rows) {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = row.name;
      const td = document.createElement('td');
      td.textContent = format.format(row.count);
      tr.append(th, td);
      fragment.append(tr);
    }
    list.querySelector('tbody').replaceChildren(fragment);
    list.hidden = !rows.length;
    if (rows.length > 5) list.tabIndex = 0;
    status.textContent = total
      ? format.format(total) + (total === 1 ? ' recorded page view.' : ' recorded page views.')
      : 'No page views with a country or region have been recorded yet.';
    for (const area of map.querySelectorAll('path[data-country]')) {
      const count = counts.get(area.dataset.country) || 0;
      area.dataset.level = count >= 100 ? '3' : count >= 10 ? '2' : count ? '1' : '0';
      area.querySelector('title').textContent = nameOf(area.dataset.country) + ' · ' +
        format.format(count) + (count === 1 ? ' page view' : ' page views');
    }
  }

  async function measure() {
    if (document.documentElement.hasAttribute('data-visit-requested')) return;
    document.documentElement.setAttribute('data-visit-requested', '');
    const noCount = navigator.globalPrivacyControl === true ||
      [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack].some(setting => setting === '1' || setting === 'yes');
    if (map) map.querySelector('[data-visit-status]').textContent = 'Loading page views…';

    if (!noCount) {
      try {
        const stats = await request('POST');
        if (map) render(stats);
        return;
      } catch { /* The POST may have succeeded. Never retry an increment. */ }
    }
    if (!map) return;
    try { render(await request('GET')); }
    catch { map.querySelector('[data-visit-status]').textContent = 'Page-view counts are temporarily unavailable.'; }
  }

  if (document.prerendering) document.addEventListener('prerenderingchange', measure, { once: true });
  else measure();
})();
