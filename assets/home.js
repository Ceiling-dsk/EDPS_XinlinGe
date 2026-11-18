function showSection() {
  if (location.hash === '#personal') {
    location.replace('about/index.html#personal');
    return;
  }
  const section = location.hash === '#work-log' ? 'index.html#work-log' : 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
showSection();
window.addEventListener('hashchange', showSection);
