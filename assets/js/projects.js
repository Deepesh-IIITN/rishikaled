document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return; // Only run on projects page
  
    fetch('data/projects.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load project data');
        return response.json();
      })
      .then(data => {
        renderProjects(data);
      })
      .catch(err => {
        grid.innerHTML = `<div class="col-span-full p-8 text-center text-red-400">Error loading projects: ${err.message}. Please refresh.</div>`;
      });
  
    function renderProjects(items) {
      if (items.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-16 text-center text-slate-500">No projects to display.</div>`;
        return;
      }
      grid.innerHTML = items.map((p, index) => `
        <article class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden group fade-in-up delay-${(index % 3) * 100}">
          <div class="aspect-video bg-slate-950 relative overflow-hidden">
            <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <span class="inline-block bg-blue-600/90 text-white text-xs px-2.5 py-1 rounded shadow-sm mb-2 backdrop-blur-sm">
                ${p.location}
              </span>
              <h3 class="text-xl font-bold text-white shadow-sm">${p.title}</h3>
            </div>
          </div>
          <div class="p-6">
            <p class="text-slate-400 text-sm mb-4 leading-relaxed">${p.scope}</p>
            <div class="bg-slate-800/50 rounded p-4 border border-slate-700/50">
              <div class="flex items-start gap-3 mb-2">
                 <svg class="w-5 h-5 text-gold-500 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 <span class="text-slate-300 text-sm font-medium">Fixtures: <span class="text-white">${p.fixturesUsed}</span></span>
              </div>
              <div class="flex items-start gap-3">
                 <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 <span class="text-slate-400 text-sm italic">${p.metrics}</span>
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }
  });
