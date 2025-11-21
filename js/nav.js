// Highlight active nav link based on current page (handles /, ./, #, queries, hashes)
document.addEventListener('DOMContentLoaded', () => {
  // Normalize a href to a filename like 'index.html'
  const toFile = href => {
    const u = new URL(href, window.location.origin);
    let file = u.pathname.split('/').pop();      // e.g., '', 'about.html'
    if (!file) file = 'index.html';              // treat / as index.html
    return file.toLowerCase();
  };

  // Current page filename
  let here = window.location.pathname.split('/').pop();
  if (!here) here = 'index.html';
  here = here.toLowerCase();

  document.querySelectorAll('nav a[href]').forEach(a => {
    const linkFile = toFile(a.getAttribute('href'));
    // Also treat anchors or './' as index.html
    if (linkFile === 'index.html' && (here === 'index.html' || here === './' || here === '')) {
      a.classList.add('active');
    } else if (linkFile === here) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
});
