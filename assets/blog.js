const filters = document.querySelector('.blog-filter');
if (filters) {
  const buttons = Array.from(filters.querySelectorAll('button'));
  const entries = Array.from(document.querySelectorAll('.blog-row'));
  const status = document.querySelector('.blog-status');
  filters.hidden = false;
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const venue = button.dataset.venue;
      for (const control of buttons) {
        control.setAttribute('aria-pressed', String(control === button));
      }
      let visible = 0;
      for (const entry of entries) {
        entry.hidden = Boolean(venue && venue !== entry.dataset.conference);
        if (!entry.hidden) visible++;
      }
      status.textContent = `${visible} ${venue ? venue + ' ' : ''}reading ${visible === 1 ? 'note' : 'notes'}.`;
    });
  }
}
