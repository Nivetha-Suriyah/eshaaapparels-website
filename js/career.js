// Careers: toggle "View details" and "Apply now" per card
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.job-card').forEach(card => {
    const detailsBtn = card.querySelector('[data-toggle="details"]');
    const details    = card.querySelector('.job-details');
    const applyBtn   = card.querySelector('[data-toggle="apply"]');
    const form       = card.querySelector('.job-apply-form');

    // Guard checks
    if (detailsBtn && details) {
      detailsBtn.addEventListener('click', () => {
        const isOpen = details.classList.toggle('open');
        detailsBtn.textContent = isOpen ? 'Hide details' : 'View details';
      });
    }

    if (applyBtn && form) {
      applyBtn.addEventListener('click', () => {
        const isOpen = form.classList.toggle('open');
        applyBtn.textContent = isOpen ? 'Hide application form' : 'Apply now';
        if (isOpen) {
          form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });
});
