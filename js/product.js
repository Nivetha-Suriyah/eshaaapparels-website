document.addEventListener('DOMContentLoaded', () => {
  // ---------- PRODUCT DATA ----------
  // Update these paths with your real image files
  const productData = {
    mens: {
      Formal: [
        { src: 'assets/Placeholder/formal1.jpg', alt: 'Mens Round Neck 1' },
        { src: 'assets/Placeholder/formal2.jpg', alt: 'Mens Round Neck 2' },
        { src: 'assets/Placeholder/formal3.jpg', alt: 'Mens Round Neck 3' }
      ],
      Casual: [
        { src: 'assets/Placeholder/casual1.jpg', alt: '' },
        { src: 'assets/Placeholder/casual2.jpg', alt: '' },
        { src: 'assets/Placeholder/casual3.jpg', alt: '' }
      ]
    },
    women: {
        Kurtis: [
        { src: 'assets/Placeholder/kurti1.jpg', alt: '' },
        { src: 'assets/Placeholder/kurti2.jpg', alt: '' },
    ],
      'bottom-wear': [
        { src: 'assets/Placeholder/bottom1.jpg', alt: '' },
        { src: 'assets/Placeholder/bottom2.jpg', alt: '' },
      ]
    }
  };

  const grid   = document.getElementById('product-grid');
  const banner = document.getElementById('product-banner');

  // ---------- RENDER FUNCTION ----------
  function renderProducts(category, sub) {
    const items = productData[category] && productData[category][sub];

    // hide banner, show grid
    if (banner) banner.classList.add('hidden');
    if (grid)   grid.classList.remove('hidden');

    if (!items || items.length === 0) {
      grid.innerHTML = `<p class="no-products">Products coming soon in this category.</p>`;
      return;
    }

    grid.innerHTML = items
      .map(
        (item) => `
        <div class="product-card">
          <img src="${item.src}" alt="${item.alt}">
        </div>`
      )
      .join('');
  }

  // ---------- SIDEBAR BEHAVIOUR ----------
  const categories = document.querySelectorAll('.product-category');

  categories.forEach((cat) => {
    const header   = cat.querySelector('.product-category-header');
    const arrow    = header.querySelector('.cat-arrow');
    const subItems = cat.querySelectorAll('.product-subitem');

    // toggle open/close category
    header.addEventListener('click', () => {
      const isOpen = cat.classList.contains('open');

      // close all categories
      categories.forEach((c) => {
        c.classList.remove('open');
        const a = c.querySelector('.cat-arrow');
        if (a) a.innerHTML = '&#9660;'; // down
      });

      // open this if it was closed
      if (!isOpen) {
        cat.classList.add('open');
        arrow.innerHTML = '&#9650;'; // up
      } else {
        arrow.innerHTML = '&#9660;';
      }
    });

    // when subcategory clicked, render its products
    subItems.forEach((item) => {
      item.addEventListener('click', () => {
        // remove active from all subitems
        document
          .querySelectorAll('.product-subitem')
          .forEach((s) => s.classList.remove('active'));

        item.classList.add('active');

        const categoryKey = cat.dataset.category;
        const subKey      = item.dataset.sub;
        renderProducts(categoryKey, subKey);
      });
    });
  });

  // ---------- INITIAL STATE ----------
  // Do NOT render any products; just ensure banner is visible
  if (banner) banner.classList.remove('hidden');
  if (grid)   grid.classList.add('hidden');
});