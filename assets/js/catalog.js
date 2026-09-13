document.addEventListener('DOMContentLoaded', () => {
  let products = [];
  const grid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!grid) return; // Only run on catalog page

  // 1. Fetch Dynamic JSON
  fetch('data/products.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load inventory data');
      return response.json();
    })
    .then(data => {
      products = data;
      renderCards(products);
      checkUrlParams();
    })
    .catch(err => {
      grid.innerHTML = `<div class="col-span-full p-8 text-center text-red-400">Error loading catalog: ${err.message}. Please refresh.</div>`;
    });

  // 2. Render Cards Function
  function renderCards(items) {
    if (items.length === 0) {
      grid.innerHTML = `<div class="col-span-full py-16 text-center text-slate-500">No lighting fixtures matched your criteria.</div>`;
      return;
    }
    grid.innerHTML = items.map((p, index) => `
      <article class="product-card bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col fade-in-up delay-${(index % 4) * 100}">
        <div class="aspect-square bg-slate-950 p-6 flex items-center justify-center relative group">
          <img src="${p.thumbnail}" alt="${p.name}" class="max-h-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy">
          <span class="absolute top-3 left-3 bg-blue-600/20 text-blue-400 text-xs px-2.5 py-1 rounded border border-blue-500/30">
            ${p.categoryLabel}
          </span>
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-white mb-1">${p.name}</h3>
          <p class="text-slate-400 text-sm mb-4 line-clamp-2">${p.tagline}</p>
          
          <div class="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-6 bg-slate-950/60 p-3 rounded">
            <div><strong class="text-slate-500 block">Wattage:</strong> ${p.specs.Wattage || 'N/A'}</div>
            <div><strong class="text-slate-500 block">Output:</strong> ${p.specs['Luminous Output'] || p.specs.Brightness || 'N/A'}</div>
            <div><strong class="text-slate-500 block">IP Grade:</strong> ${p.specs['Ingress Protection'] || 'N/A'}</div>
            <div><strong class="text-slate-500 block">Warranty:</strong> 5 Years</div>
          </div>

          <div class="mt-auto flex items-center gap-3">
            <button onclick="openProductModal('${p.id}')" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 px-4 rounded text-center transition w-full">
              Full Technical Specs
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  // 3. Category Filter Action
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        btn.classList.add('bg-blue-600', 'text-white');
        const cat = btn.dataset.category;
        const filtered = (cat === 'all') ? products : products.filter(p => p.category === cat);
        renderCards(filtered);
      });
    });
  }

  // 4. Live Search Action
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const matched = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.tagline.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
      renderCards(matched);
    });
  }

  // 5. Deep Link Modal Handling (?id=re-st-1000w)
  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (productId) openProductModal(productId);
  }

  // 6. Global Modal Populator
  window.openProductModal = function(id) {
    const item = products.find(p => p.id === id);
    if (!item) return;

    const modal = document.getElementById('spec-modal');
    if(!modal) return;
    
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-img').src = item.thumbnail;
    document.getElementById('modal-cat').textContent = item.categoryLabel;
    document.getElementById('modal-pdf').href = item.specSheetUrl;
    document.getElementById('modal-inquire').href = `contact.html?model=${encodeURIComponent(item.name)}`;

    const specsTbody = document.getElementById('modal-specs-tbody');
    specsTbody.innerHTML = Object.entries(item.specs).map(([k, v]) => `
      <tr class="border-b border-slate-800">
        <td class="py-3 px-4 text-slate-400 font-medium text-sm w-1/2">${k}</td>
        <td class="py-3 px-4 text-white text-sm text-right font-semibold">${v}</td>
      </tr>
    `).join('');

    modal.classList.remove('hidden');
    // small timeout to allow display block to process before opacity
    setTimeout(() => {
        modal.querySelector('.modal-backdrop').classList.replace('opacity-0', 'opacity-100');
        modal.querySelector('.modal-content').classList.replace('scale-95', 'scale-100');
        modal.querySelector('.modal-content').classList.replace('opacity-0', 'opacity-100');
    }, 10);
  };

  window.closeModal = function() {
    const modal = document.getElementById('spec-modal');
    if(!modal) return;
    modal.querySelector('.modal-backdrop').classList.replace('opacity-100', 'opacity-0');
    modal.querySelector('.modal-content').classList.replace('scale-100', 'scale-95');
    modal.querySelector('.modal-content').classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // match transition duration
  };
});
