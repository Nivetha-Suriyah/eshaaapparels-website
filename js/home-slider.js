document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dots .dot');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');

  if (!slides.length) return;

  let current = 0;
  const delay = 4000; // 4 seconds
  let timer;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    current = index;
  }

  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (current - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, delay);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  // arrows
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    startAuto(); // reset timer
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    startAuto();
  });

  // dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = Number(dot.getAttribute('data-slide')) || 0;
      showSlide(target);
      startAuto();
    });
  });

  // start
  showSlide(0);
  startAuto();
});
