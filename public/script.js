const filterButtons = [...document.querySelectorAll('.filter-button')];
const projectCards = [...document.querySelectorAll('.project-card')];

// Accessible project filters.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach((card) => {
      const shouldHide = filter !== 'all' && card.dataset.category !== filter;
      card.classList.toggle('is-hidden', shouldHide);
      card.setAttribute('aria-hidden', String(shouldHide));
    });
  });
});

// Mobile navigation closes after selection and keeps its ARIA state in sync.
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const closeMobileMenu = () => {
  if (!menuButton || !mobileMenu) return;
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
};

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

// Current year.
const yearNode = document.querySelector('#year');
if (yearNode) yearNode.textContent = new Date().getFullYear();

// Copy contact details with a clear, announced confirmation.
const toast = document.querySelector('.toast');
let toastTimeout;
const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
};

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    const label = button.dataset.copyLabel || 'Texte';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API indisponible');
      await navigator.clipboard.writeText(value);
      showToast(`${label} copié${label === 'Adresse e-mail' ? 'e' : ''} : ${value}`);
    } catch {
      showToast(`${label} : ${value}`);
    }
  });
});

// Scroll progress indicator. Updates are coalesced into one animation frame.
const progressBar = document.querySelector('.scroll-progress span');
let progressScheduled = false;
const updateScrollProgress = () => {
  if (!progressBar || progressScheduled) return;
  progressScheduled = true;
  window.requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    progressScheduled = false;
  });
};
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Motion is progressive enhancement: content remains visible without JS,
// without IntersectionObserver, or when reduced motion is requested.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('has-motion');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

  document.querySelectorAll(
    '.section-heading, .project-card, .project-transparency, .service-card, .service-footnote, .principle, .workflow-step, .faq-intro, .faq-item, .profile-left, .profile-right'
  ).forEach((element) => {
    element.dataset.reveal = '';
    revealObserver.observe(element);
  });

  // Subtle depth on the hero illustration for pointer devices only.
  const heroVisual = document.querySelector('.hero-visual');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (heroVisual && finePointer) {
    heroVisual.addEventListener('pointermove', (event) => {
      const bounds = heroVisual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroVisual.style.setProperty('--pointer-x', `${(x * 5).toFixed(2)}deg`);
      heroVisual.style.setProperty('--pointer-y', `${(y * -5).toFixed(2)}deg`);
    });
    heroVisual.addEventListener('pointerleave', () => {
      heroVisual.style.setProperty('--pointer-x', '0deg');
      heroVisual.style.setProperty('--pointer-y', '0deg');
    });
  }
}
