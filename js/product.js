document.addEventListener('DOMContentLoaded', () => {
  // ---------- PRODUCT DATA ----------
  // Update these paths with your real image files
  const productData = {
    mens: {
      Formal: [
        { src: 'assets/icons/products/FS01.png', alt: 'Mens Formal Shirt 1' },
        { src: 'assets/icons/products/FS02.png', alt: 'Mens Formal Shirt 2' },
        { src: 'assets/icons/products/FS03.png', alt: 'Mens Formal Shirt 3' },
        { src: 'assets/icons/products/FS04.png', alt: 'Mens Formal Shirt 4' },
        // { src: 'assets/icons/products/FS05.png', alt: 'Mens Formal Shirt 5' },
        { src: 'assets/icons/products/FS06.png', alt: 'Mens Formal Shirt 6' },
        { src: 'assets/icons/products/FS07.png', alt: 'Mens Formal Shirt 7' },
        { src: 'assets/icons/products/FS08.png', alt: 'Mens Formal Shirt 8' },
        { src: 'assets/icons/products/FS09.png', alt: 'Mens Formal Shirt 9' },
        // { src: 'assets/icons/products/FS10.png', alt: 'Mens Formal Shirt 10' },
        { src: 'assets/icons/products/FS11.png', alt: 'Mens Formal Shirt 11' },
        { src: 'assets/icons/products/FS12.png', alt: 'Mens Formal Shirt 12' },
        { src: 'assets/icons/products/FS13.png', alt: 'Mens Formal Shirt 13' }
      ],
      // Casual: [
      //   { src: 'assets/Placeholder/casual1.jpg', alt: '' },
      //   { src: 'assets/Placeholder/casual2.jpg', alt: '' },
      //   { src: 'assets/Placeholder/casual3.jpg', alt: '' }
      // ]
    },
    Women: {
        Kurtis: [
        { src: 'assets/icons/products/K01.png', alt: 'Female Kurti 01' },
        { src: 'assets/icons/products/K02.png', alt: 'Female Kurti 02' },
        { src: 'assets/icons/products/K03.png', alt: 'Female Kurti 03' },
        { src: 'assets/icons/products/K04.png', alt: 'Female Kurti 04' },
        { src: 'assets/icons/products/K05.png', alt: 'Female Kurti 05' },
        { src: 'assets/icons/products/K06.png', alt: 'Female Kurti 06' },
        { src: 'assets/icons/products/K07.png', alt: 'Female Kurti 07' },
        { src: 'assets/icons/products/K08.png', alt: 'Female Kurti 08' },
        { src: 'assets/icons/products/K09.png', alt: 'Female Kurti 09' },
        { src: 'assets/icons/products/K10.png', alt: 'Female Kurti 10' },
        { src: 'assets/icons/products/K11.png', alt: 'Female Kurti 11' },
        { src: 'assets/icons/products/K12.png', alt: 'Female Kurti 12' },
        { src: 'assets/icons/products/K13.png', alt: 'Female Kurti 13' },
        { src: 'assets/icons/products/K14.png', alt: 'Female Kurti 14' }   
    ],
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