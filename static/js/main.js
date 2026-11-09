// ============================================
// GSAP + ScrollTrigger Initialization
// ============================================
gsap.registerPlugin(ScrollTrigger);

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
    floatingCta.setAttribute('aria-hidden', String(!shouldShow));
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
// GSAP SCROLL ANIMATIONS
// ============================================
// Stats band — count-up (funciona con o sin reduced-motion)
gsap.utils.toArray('.stat-number').forEach(el => {
  const target = parseFloat(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || '';
  const render = v => { el.textContent = Math.round(v).toLocaleString('es-CO') + suffix; };
  if (prefersReducedMotion) { render(target); return; }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => render(obj.v)
  });
});

if (!prefersReducedMotion) {
  // Hero entrance timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // Sin opacity: el logo es el LCP; si arranca invisible, el LCP espera a GSAP.
  heroTl
    .from('.hero-logo', { y: 30, duration: 0.6 });

  // Char-level animation (Splitting.js) or word fallback
  const heroChars = document.querySelectorAll('.hero-title .char');
  if (heroChars.length > 0) {
    // Workaround: GSAP creates a compositing stacking context on chars (translate/rotate/scale: none)
    // which prevents CSS background-clip:text + background-image from rendering. Apply inline.
    // El valor es var(--grad-brand): sigue siendo inline (que es lo que pide
    // el workaround) pero se resuelve contra el tema activo, asi que cambia
    // solo al alternar dark/light sin repintar nada desde JS.
    heroChars.forEach(c => {
      c.style.background = 'var(--grad-brand)';
      c.style.webkitBackgroundClip = 'text';
      c.style.backgroundClip = 'text';
      c.style.color = 'transparent';
    });
    heroTl.fromTo(heroChars,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' },
      '-=0.3'
    );

    // T1 — Variable font weight bloom: wght 100 → 700 sincronizado con la entrada
    const heroTitleEl = document.querySelector('.hero-title');
    if (heroTitleEl) {
      const wghtProxy = { wght: 100 };
      heroTitleEl.style.fontVariationSettings = '"wght" 100';
      heroTl.to(wghtProxy, {
        wght: 700,
        duration: 0.75,
        ease: 'power2.inOut',
        onUpdate() {
          heroTitleEl.style.fontVariationSettings = `"wght" ${Math.round(wghtProxy.wght)}`;
        }
      }, '<+0.05'); // empieza casi al mismo tiempo que el char reveal
    }
  } else {
    heroTl.from('.hero-title', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');
  }

  heroTl.from('.hero-actions', { opacity: 0, y: 20, duration: 0.4 }, '+=0.2');

  // Section headers — scroll reveal
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Features sticky wrap entrance
  gsap.from('.features-sticky-wrap', {
    scrollTrigger: {
      trigger: '.features-sticky-wrap',
      start: 'top 85%',
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out'
  });

  // CTA card entrance
  gsap.from('.cta-card', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 85%',
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Value proposition — staggered columns
  gsap.from('.value-prop-content', {
    scrollTrigger: {
      trigger: '.value-prop',
      start: 'top 80%',
      once: true
    },
    opacity: 0,
    x: -30,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.from('.value-prop-image', {
    scrollTrigger: {
      trigger: '.value-prop',
      start: 'top 80%',
      once: true
    },
    opacity: 0,
    x: 30,
    duration: 0.8,
    delay: 0.2,
    ease: 'power2.out'
  });

  // Numbered feature cards — staggered reveal
  gsap.from('.num-card', {
    scrollTrigger: {
      trigger: '.numbered-grid',
      start: 'top 85%',
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Experience cards — staggered reveal
  gsap.from('.exp-card', {
    scrollTrigger: {
      trigger: '.experiences-grid',
      start: 'top 85%',
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // News cards — staggered reveal
  gsap.from('.news-card', {
    scrollTrigger: {
      trigger: '.news-grid',
      start: 'top 85%',
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Footer — fade in
  gsap.from('.footer', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      once: true
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Footer columns — stagger
  gsap.from('.footer-col', {
    scrollTrigger: {
      trigger: '.footer-grid',
      start: 'top 90%',
      once: true
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Parallax — hero logo moves slower
  gsap.to('.hero-logo', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: -40,
    ease: 'none'
  });

  // Parallax — value-prop image moves slightly faster
  gsap.to('.value-prop-image', {
    scrollTrigger: {
      trigger: '.value-prop',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    },
    y: -30,
    ease: 'none'
  });
}

// ============================================
// TOP SCROLL PROGRESS BAR
// ============================================
if (!prefersReducedMotion) {
  gsap.to('#top-progress', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });
}

// ============================================
// SCROLL INDICATOR — Hide on scroll
// ============================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: '20% top',
    onLeave: () => scrollIndicator.classList.add('hidden'),
    onEnterBack: () => scrollIndicator.classList.remove('hidden')
  });
}

// ============================================
// ACTIVE NAV SECTION INDICATOR
// ============================================
const navSections = [
  { id: 'inicio',      href: '#inicio' },
  { id: 'features',   href: '#features' },
  { id: 'experiencias', href: '#experiencias' },
  { id: 'contacto',   href: '#contacto' }
];

navSections.forEach(({ id, href }) => {
  const section = document.getElementById(id);
  const link = document.querySelector(`.nav-links a[href="${href}"]`);
  if (!section || !link) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
      link.classList.add('nav-active');
    },
    onEnterBack: () => {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
      link.classList.add('nav-active');
    },
    onLeave: () => link.classList.remove('nav-active'),
    onLeaveBack: () => link.classList.remove('nav-active')
  });
});

// ============================================
// CHAR-LEVEL HEADING REVEAL (Splitting.js)
// ============================================
if (!prefersReducedMotion) {
  document.querySelectorAll('.section-header h2[data-splitting]').forEach(h2 => {
    const chars = h2.querySelectorAll('.char');
    if (chars.length === 0) return;
    gsap.from(chars, {
      scrollTrigger: {
        trigger: h2,
        start: 'top 88%',
        once: true
      },
      yPercent: 110,
      opacity: 0,
      duration: 0.6,
      stagger: 0.025,
      ease: 'power3.out'
    });
  });
}

// ============================================
// EXPERIENCE CARDS PARALLAX
// ============================================
if (!prefersReducedMotion) {
  gsap.utils.toArray('.exp-card .exp-image img').forEach(img => {
    gsap.fromTo(img,
      { y: 12 },
      {
        y: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.exp-card'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

// ============================================
// ============================================
// SECTION LABEL CLIP-PATH REVEAL (Task 3.4)
// Runs AFTER section-header GSAP (which uses opacity+y on the parent).
// The label reveal is triggered independently at a slightly later scroll position
// to create a secondary reveal effect inside the already-visible header.
// ============================================
if (!prefersReducedMotion) {
  gsap.utils.toArray('.section-label').forEach(label => {
    // Set initial hidden state via JS (not CSS) to avoid FOUC
    label.classList.add('section-label--reveal-pending');
    gsap.to(label, {
      scrollTrigger: {
        trigger: label,
        start: 'top 92%',
        once: true
      },
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 0.65,
      ease: 'power3.out',
      delay: 0.15 // slight delay so parent section-header reveal plays first
    });
  });
}

// ============================================
// VALUE-PROP H2 CHAR REVEAL (Task 3.5)
// ============================================
if (!prefersReducedMotion) {
  const valuePropH2 = document.querySelector('.value-prop-content h2[data-splitting]');
  if (valuePropH2) {
    const vpChars = valuePropH2.querySelectorAll('.char');
    if (vpChars.length > 0) {
      gsap.from(vpChars, {
        scrollTrigger: {
          trigger: valuePropH2,
          start: 'top 85%',
          once: true
        },
        yPercent: 110,
        opacity: 0,
        duration: 0.55,
        stagger: 0.02,
        ease: 'power3.out'
      });
    }
  }
}

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

// ============================================
// VIDEO SHOWCASE — lazy autoplay
// ============================================
const showcaseVideo = document.querySelector('.showcase-video');
if (showcaseVideo) {
  if (prefersReducedMotion) {
    // Show poster only — no autoplay for reduced-motion users
    showcaseVideo.removeAttribute('autoplay');
  } else {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showcaseVideo.play().catch(() => {});
        } else {
          showcaseVideo.pause();
        }
      });
    }, { threshold: 0.3 });
    videoObserver.observe(showcaseVideo);
  }
}

/* ============================================
   Botones magnéticos — los CTAs primarios siguen sutilmente el cursor
   (solo desktop con puntero fino; respeta prefers-reduced-motion)
   ============================================ */
if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const MAG_MAX = 8; // desplazamiento máximo en px
  document.querySelectorAll('.btn-primary, .cta-btn').forEach((btn) => {
    if (btn.closest('.hero-actions')) return; // ya gestionado por el bloque magnético GSAP (línea 617)
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * MAG_MAX;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * MAG_MAX;
      btn.style.transition = 'transform 0.12s linear'; // seguimiento rápido durante el hover
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transition = ''; // restaura la transición CSS (retorno suave)
      btn.style.transform = '';
    });
  });
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
