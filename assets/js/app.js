// Global App JS
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // Solid blur effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('bg-slate-900/90', 'backdrop-blur-md', 'shadow-md');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-slate-900/90', 'backdrop-blur-md', 'shadow-md');
      header.classList.add('bg-transparent');
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
      
      if (!expanded) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    });
  }
});
