// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// SPLITTING.JS — Character split init
// ============================================
if (typeof Splitting !== 'undefined') {
  Splitting({ target: '[data-splitting]' });
}

// ============================================
// DISABLE TRANSITIONS ON MOUNT
// ============================================
requestAnimationFrame(() => {
  document.body.classList.remove('no-transitions');
});

// ============================================
// SPLIT TEXT — hero title handled by Splitting.js
// (data-splitting attribute on .hero-title in HTML)
// ============================================

// ============================================
// NAVBAR — Transparent → Solid on scroll
// ============================================
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

// ============================================
// FLOATING CTA (mobile) — reveal-on-scroll, mecanismo inspirado en circle.so/ai
// Aparece al pasar el hero (donde .nav-cta ya no es visible en mobile), y se
// oculta de nuevo cerca de .cta-section para no duplicar el CTA en pantalla.
// ============================================
const floatingCta = document.getElementById('floating-cta');

if (floatingCta) {
  const heroEl = document.querySelector('.hero');
  const revealThreshold = heroEl ? heroEl.offsetHeight * 0.8 : 500;
  let pastCtaSection = false;

  function updateFloatingCta() {
    const shouldShow = window.pageYOffset > revealThreshold && !pastCtaSection;
    floatingCta.classList.toggle('is-visible', shouldShow);
    // inert, not aria-hidden: hidden links must leave the tab order too
    floatingCta.inert = !shouldShow;
  }

  window.addEventListener('scroll', updateFloatingCta, { passive: true });

  const ctaSectionEl = document.querySelector('.cta-section');
  if (ctaSectionEl && 'IntersectionObserver' in window) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        pastCtaSection = entry.isIntersecting;
        updateFloatingCta();
      });
    }, { threshold: 0.1 });
    ctaObserver.observe(ctaSectionEl);
  }

  updateFloatingCta();
}

// ============================================
// CAPTURA DE CORREO (hero y CTA final) -> /registro.html
// Desde aquí no se envía nada: la cuenta se crea en registro.html, contra el
// API y con sus propias comprobaciones. El correo viaja en sessionStorage y
// no en la URL, para que no quede en el historial ni en los logs. Vacío,
// lleva igual al registro.
// ============================================
document.querySelectorAll('form[data-signup]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && !input.checkValidity()) {
      input.reportValidity();
      return;
    }
    const email = input ? input.value.trim().toLowerCase() : '';
    if (email) {
      try { sessionStorage.setItem('cs.registro.email', email); } catch { /* sin almacenamiento: se escribe allá */ }
    }
    location.assign('/registro.html');
  });
});

// ============================================
// MOBILE HAMBURGER MENU
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  });
}

// Close mobile menu on anchor click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    }
  });
});

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ============================================
// STICKY SCROLL FEATURES — IntersectionObserver
// ============================================
const featuresItems = document.querySelectorAll('.features-item');
const fnavItems = document.querySelectorAll('.fnav-item');

function activateFeature(idx) {
  fnavItems.forEach((nav, i) => nav.classList.toggle('active', i === idx));
  featuresItems.forEach((item, i) => item.classList.toggle('active', i === idx));
}

if (featuresItems.length > 0) {
  // Only use observer on desktop — mobile shows all items at full opacity
  const isDesktop = window.matchMedia('(min-width: 1025px)').matches;

  if (isDesktop) {
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(featuresItems).indexOf(entry.target);
          activateFeature(idx);
        }
      });
    }, {
      threshold: 0.4,
      rootMargin: '-5% 0px -40% 0px'
    });

    featuresItems.forEach(item => featureObserver.observe(item));
  }

  // Click nav items to scroll to corresponding item
  fnavItems.forEach((navBtn, i) => {
    navBtn.addEventListener('click', () => {
      if (featuresItems[i]) {
        featuresItems[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

// ============================================
// MOVIMIENTO AL HACER SCROLL — sin librerías
// Las animaciones viven en style.css (bloque MOVIMIENTO); aquí solo se marca
// qué aparece y cuándo. La entrada del hero es CSS puro.
// ============================================

// Runs fn once, when el's top reaches `at` of the viewport height (0.85: its
// top at 85% from the top). An element already scrolled past (a page opened
// at an anchor) runs it straight away instead of staying hidden.
const pendingReveals = new Set();
function whenInView(el, fn, at = 0.85) {
  const pending = { el, run: () => { pendingReveals.delete(pending); io.disconnect(); fn(); } };
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting || e.boundingClientRect.bottom < 0)) pending.run();
  }, { rootMargin: `0px 0px -${Math.round((1 - at) * 100)}% 0px` });
  pendingReveals.add(pending);
  io.observe(el);
}

// A jump straight past an element (a page opened at an anchor, the browser
// restoring the scroll) never makes it intersect, so no observer fires:
// on scroll, whatever is already above the viewport is shown too
function revealPassed() {
  pendingReveals.forEach((p) => { if (p.el.getBoundingClientRect().bottom < 0) p.run(); });
}

// Elements fade and slide in when they (or their `trigger`) come into view;
// `stagger` delays each one after the first, in seconds
function reveal(selector, { trigger, x = 0, y = 40, stagger = 0, at = 0.85 } = {}) {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return;
  els.forEach((el, i) => {
    el.dataset.scrollReveal = '';
    el.style.setProperty('--reveal-x', `${x}px`);
    el.style.setProperty('--reveal-y', `${y}px`);
    el.style.setProperty('--reveal-delay', `${i * stagger}s`);
  });
  const show = (members) => () => members.forEach((m) => m.classList.add('is-revealed'));
  const t = trigger && document.querySelector(trigger);
  if (t) whenInView(t, show(els), at);
  else els.forEach((el) => whenInView(el, show([el]), at));
}

// Stats band — count-up. The HTML holds the final figure (crawlers, no JS):
// it only counts from 0 where it will be seen moving
document.querySelectorAll('.stat-number').forEach((el) => {
  const target = parseFloat(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || '';
  const render = (v) => { el.textContent = Math.round(v).toLocaleString('es-CO') + suffix; };
  if (prefersReducedMotion) return;
  render(0);
  whenInView(el, () => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1600);
      render(target * (1 - (1 - p) ** 3));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 0.9);
});

if (!prefersReducedMotion) {
  reveal('.section-header');
  reveal('.features-sticky-wrap');
  reveal('.cta-card', { trigger: '.cta-section' });
  reveal('.value-prop-content', { trigger: '.value-prop', x: -30, y: 0, at: 0.8 });
  reveal('.num-card', { trigger: '.numbered-grid', stagger: 0.15 });
  reveal('.exp-card', { trigger: '.experiences-grid', stagger: 0.15 });
  reveal('.news-card', { trigger: '.news-grid', stagger: 0.1 });
  reveal('.footer', { y: 30, at: 0.9 });
  reveal('.footer-col', { trigger: '.footer-grid', y: 20, stagger: 0.1, at: 0.9 });

  // Section titles split by Splitting.js: letter by letter
  document.querySelectorAll('.section-header h2[data-splitting], .value-prop-content h2[data-splitting]').forEach((h2) => {
    if (!h2.querySelector('.char')) return;
    h2.classList.add('char-reveal');
    whenInView(h2, () => h2.classList.add('is-revealed'), 0.88);
  });

  // Section labels: a clip that opens left to right, a beat after the header
  document.querySelectorAll('.section-label').forEach((label) => {
    label.classList.add('section-label--reveal-pending');
    whenInView(label, () => label.classList.add('is-revealed'), 0.92);
  });
}

// Scroll progress bar and the hero's "Scroll" hint, on one passive listener
const topProgress = document.getElementById('top-progress');
const scrollIndicator = document.querySelector('.scroll-indicator');
const heroSectionEl = document.querySelector('.hero');
let scrollFrame = 0;
function onScrollFrame() {
  scrollFrame = 0;
  revealPassed();
  if (topProgress && !prefersReducedMotion) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    topProgress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  }
  if (scrollIndicator && heroSectionEl) {
    scrollIndicator.classList.toggle('hidden', window.scrollY > heroSectionEl.offsetHeight * 0.2);
  }
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(onScrollFrame); }, { passive: true });
onScrollFrame();

// Active nav link: the section crossing the middle band of the viewport
const navSections = [
  { id: 'inicio', href: '#inicio' },
  { id: 'features', href: '#features' },
  { id: 'experiencias', href: '#experiencias' },
  { id: 'contacto', href: '#contacto' }
];
const navActive = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach((a) => a.classList.remove('nav-active'));
      link.classList.add('nav-active');
    } else {
      link.classList.remove('nav-active');
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });
navSections.forEach(({ id, href }) => {
  const section = document.getElementById(id);
  if (section && document.querySelector(`.nav-links a[href="${href}"]`)) navActive.observe(section);
});

// ============================================
// HERO ORBS MOUSE PARALLAX (Task 3.2)
// ============================================
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const heroSection = document.querySelector('.hero');
  const orb1 = document.querySelector('.hero-orb--1');
  const orb2 = document.querySelector('.hero-orb--2');
  const orb3 = document.querySelector('.hero-orb--3');

  if (heroSection && orb1 && orb2 && orb3) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const nx = (e.clientX - rect.left - cx) / cx; // -1 to 1
      const ny = (e.clientY - rect.top - cy) / cy;  // -1 to 1

      // Uses top/left offsets (not transform) so float @keyframes don't conflict
      orb1.style.setProperty('--orb-dx', `${-nx * 18}px`);
      orb1.style.setProperty('--orb-dy', `${-ny * 12}px`);
      orb2.style.setProperty('--orb-dy', `${ny * 10}px`);
      orb3.style.setProperty('--orb-dx', `${nx * 10}px`);
      orb3.style.setProperty('--orb-dy', `${-ny * 14}px`);
    });

    heroSection.addEventListener('mouseleave', () => {
      orb1.style.setProperty('--orb-dx', '0px');
      orb1.style.setProperty('--orb-dy', '0px');
      orb2.style.setProperty('--orb-dy', '0px');
      orb3.style.setProperty('--orb-dx', '0px');
      orb3.style.setProperty('--orb-dy', '0px');
    });
  }
}

/* ============================================
   SERVICE WORKER
   Solo en https: en dev local (file:// o http) el
   registro falla y no aporta nada.
   ============================================ */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.info('[sw] registro omitido:', err.message));
  });
}
