document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
// Redirect to Home (index.html) only when the user REFRESHES a non-home page.
(function () {
  // Get current page filename
  const here = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

  // Navigation type (standards + legacy fallback)
  const navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  const navType = navEntry ? navEntry.type : (performance.navigation && performance.navigation.type === 1 ? 'reload' : 'navigate');

  // If it's a refresh on a non-home page, send them to Home
  if (navType === 'reload' && here !== 'index.html') {
    window.location.replace('index.html'); // replace avoids back-button loop
  }
})();
