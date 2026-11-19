// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// DISABLE TRANSITIONS ON MOUNT
// ============================================
requestAnimationFrame(() => {
  document.body.classList.remove('no-transitions');
});

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
// SELECTOR DE CIUDAD — pestañas (patrón ARIA tabs)
// Sin JS la barra queda oculta y los tres paneles se ven seguidos, cada uno
// con su título; aquí se convierten en pestañas con flechas, Inicio y Fin.
// ============================================
const cityPicker = document.querySelector('.city-picker');
const cityTabs = cityPicker && cityPicker.querySelector('.city-tabs');
if (cityTabs) {
  const citySelect = cityTabs.closest('.city-select');
  const tabs = [...cityTabs.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  panels.forEach((panel, i) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[i].id);
    panel.tabIndex = 0;
  });

  let shownCity = 0;
  let cityEntered = false; // la primera selección (al cargar) no anima
  function selectCity(index, focus) {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (focus) tabs[index].focus();
    // El mapa (city-map.js) sigue a la pestaña elegida
    cityPicker.dispatchEvent(new CustomEvent('citychange', { detail: { index } }));
    // El panel entra con su animación (CSS), hacia el lado al que se va
    if (cityEntered && !prefersReducedMotion && index !== shownCity) {
      const panel = panels[index];
      panel.dataset.dir = index > shownCity ? '1' : '-1';
      panel.querySelectorAll('.city-plan').forEach((plan, n) => plan.style.setProperty('--n', n));
      panel.classList.remove('is-entering');
      void panel.offsetWidth;
      panel.classList.add('is-entering');
    }
    shownCity = index;
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => selectCity(i, false)));
  cityTabs.addEventListener('keydown', (e) => {
    // Alt+← y similares son del navegador (atrás, adelante)
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const current = tabs.indexOf(document.activeElement);
    const target = { ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (current === -1 || target === undefined) return;
    e.preventDefault();
    selectCity((target + tabs.length) % tabs.length, true);
  });

  // Los enlaces con data-city (hero, pie) eligen su ciudad; el ancla hace el scroll
  document.querySelectorAll('a[data-city]').forEach((link) => {
    link.addEventListener('click', () => {
      const index = tabs.findIndex((tab) => tab.id === `tab-${link.dataset.city}`);
      if (index !== -1) selectCity(index, false);
    });
  });

  cityPicker.classList.add('is-enhanced');
  citySelect.hidden = false;
  selectCity(0, false);
  cityEntered = true;
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
// `stagger` delays each one after the first, in seconds; `tilt` starts them
// leaning back that many degrees (their container sets the perspective)
function reveal(selector, { trigger, x = 0, y = 40, tilt = 0, stagger = 0, at = 0.85 } = {}) {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return;
  els.forEach((el, i) => {
    el.dataset.scrollReveal = '';
    el.style.setProperty('--reveal-x', `${x}px`);
    el.style.setProperty('--reveal-y', `${y}px`);
    if (tilt) el.style.setProperty('--reveal-tilt', `${tilt}deg`);
    el.style.setProperty('--reveal-delay', `${i * stagger}s`);
  });
  const show = (members) => () => members.forEach((m) => m.classList.add('is-revealed'));
  const t = trigger && document.querySelector(trigger);
  if (t) whenInView(t, show(els), at);
  else els.forEach((el) => whenInView(el, show([el]), at));
}

if (!prefersReducedMotion) {
  reveal('.section-header');
  reveal('.bento-card', { trigger: '.bento', stagger: 0.08 });
  reveal('.cta-card', { trigger: '.cta-section' });
  reveal('.how-step', { trigger: '.how-steps', tilt: 35, stagger: 0.1 });
  reveal('.film-card', { trigger: '.film' });
  reveal('.news-card', { trigger: '.news-grid', stagger: 0.1 });
  reveal('.footer', { y: 30, at: 0.9 });
  reveal('.footer-col', { trigger: '.footer-grid', y: 20, stagger: 0.1, at: 0.9 });

  // Section labels: a clip that opens left to right, a beat after the header
  document.querySelectorAll('.section-label').forEach((label) => {
    label.classList.add('section-label--reveal-pending');
    whenInView(label, () => label.classList.add('is-revealed'), 0.92);
  });
}

// Scroll progress bar and pending reveals, on one passive listener
const topProgress = document.getElementById('top-progress');
let scrollFrame = 0;
function onScrollFrame() {
  scrollFrame = 0;
  revealPassed();
  if (topProgress && !prefersReducedMotion) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    topProgress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  }
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(onScrollFrame); }, { passive: true });
onScrollFrame();

// Active nav link: the section crossing the middle band of the viewport
const navSections = [
  { id: 'inicio', href: '#inicio' },
  { id: 'features', href: '#features' },
  { id: 'ciudades', href: '#ciudades' },
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

// ============================================
// INCLINACIÓN 3D — teléfono del hero y tarjetas del bento
// Aquí solo se escribe dónde está el puntero (--tilt-x / --tilt-y, de -1 a 1)
// sobre `area`; los ángulos y el reflejo viven en style.css ([data-tilt]).
// ============================================
function tilt(el, area = el) {
  let frame = 0;
  let nx = 0;
  let ny = 0;
  el.dataset.tilt = '';

  area.addEventListener('pointermove', (e) => {
    const rect = area.getBoundingClientRect();
    nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      el.style.setProperty('--tilt-x', nx.toFixed(3));
      el.style.setProperty('--tilt-y', ny.toFixed(3));
      el.style.setProperty('--tilt-on', '1');
    });
  });

  // Back to neutral: without the variables the CSS falls back to 0
  area.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    el.style.removeProperty('--tilt-x');
    el.style.removeProperty('--tilt-y');
    el.style.removeProperty('--tilt-on');
  });
}

if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const heroDemo = document.querySelector('.hero-demo');
  if (heroDemo) tilt(heroDemo, heroDemo.closest('.hero'));
  document.querySelectorAll('.bento-card').forEach((card) => tilt(card));
}

// ============================================
// EVENTOS (cuenta atrás) Y BENTO (escenas) — movimiento interno
// El CSS (bloque MOVIMIENTO INTERNO) pone lo que se ve; aquí solo se cuentan
// las cifras y se activan las tarjetas del bento al entrar en pantalla.
// ============================================
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Cifra que sube de 0 a `to`; `format` la pinta
function countUp(el, to, format, ms = 1300) {
  let t0;
  const step = (t) => {
    t0 ??= t;
    const p = Math.min(1, (t - t0) / ms);
    el.textContent = format(Math.round(to * easeOutCubic(p)));
    if (p < 1) el.countFrame = requestAnimationFrame(step);
  };
  cancelAnimationFrame(el.countFrame);
  el.countFrame = requestAnimationFrame(step);
}

// Tarjetas con fecha cierta (data-date): "Faltan N días" con la cifra subiendo.
// Sin fecha ("por confirmar") no se pone nada; pasada la fecha tampoco.
document.querySelectorAll('.news-card[data-date]').forEach((card) => {
  const days = Math.ceil((new Date(`${card.dataset.date}T00:00:00`) - Date.now()) / 864e5);
  if (days <= 0) return;
  const chip = document.createElement('span');
  chip.className = 'news-countdown';
  const num = document.createElement('b');
  num.textContent = days;
  chip.append('Faltan ', num, days === 1 ? ' día' : ' días');
  card.querySelector('.news-tag').after(chip);
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    countUp(num, days, String, 1500);
  }, { threshold: 0.6 });
  io.observe(card);
});

// Bento: .is-playing mientras la tarjeta se ve; al salir se quita, y al volver
// la escena se repite. Los estados de partida del CSS cuelgan de .is-animated.
const bento = document.querySelector('.bento');
if (bento && !prefersReducedMotion && 'IntersectionObserver' in window) {
  bento.classList.add('is-animated');
  const numberFormat = new Intl.NumberFormat('es-CO');
  const timers = new Map();

  // Mueve la clase is-active por los elementos, como si alguien los tocara
  const cycle = (items, after) => {
    let i = items.findIndex((el) => el.classList.contains('is-active'));
    return setInterval(() => {
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
      if (after) after(items[i]);
    }, 2200);
  };

  const play = (card) => {
    card.classList.add('is-playing');
    const big = card.querySelector('.bento-big');
    if (big) {
      big.dataset.final ??= big.textContent;
      const [, prefix, digits, suffix] = big.dataset.final.match(/^(\$?)([\d.]+)(.*)$/);
      countUp(big, parseInt(digits.replace(/\./g, ''), 10), (n) => `${prefix}${numberFormat.format(n)}${suffix}`);
    }
    const running = [];
    const filters = [...card.querySelectorAll('.bento-tabs span')];
    if (filters.length) running.push(cycle(filters));
    const cities = [...card.querySelectorAll('.bento-row')].slice(0, 3);
    if (cities.length) {
      const arrow = card.querySelector('.bento-row__end');
      running.push(cycle(cities, (row) => arrow && row.appendChild(arrow)));
    }
    timers.set(card, running);
  };

  const stop = (card) => {
    card.classList.remove('is-playing');
    (timers.get(card) || []).forEach(clearInterval);
    timers.delete(card);
    const big = card.querySelector('.bento-big');
    if (big && big.dataset.final) {
      cancelAnimationFrame(big.countFrame);
      big.textContent = big.dataset.final;
    }
  };

  const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? play(e.target) : stop(e.target)));
  }, { threshold: 0.6 });
  bento.querySelectorAll('.bento-card').forEach((card) => bentoObserver.observe(card));
}

// ============================================
// BANDA DEL BLOG — video silencioso, 2 repeticiones y luego reposo
// Arranca al entrar en pantalla y se detiene al salir. Con movimiento reducido
// o ahorro de datos no arranca solo: queda el póster y un botón de reproducir
// (WCAG 2.2.2: el botón de pausa está siempre a la vista). Sin JS, solo el póster.
// ============================================
const filmCard = document.querySelector('.film-card');
if (filmCard) {
  const film = filmCard.querySelector('.film-video');
  const toggle = filmCard.querySelector('.film-toggle');
  const PLAYS = 2;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const autoplay = !prefersReducedMotion && !saveData;
  let plays = 0;
  let wantsPlay = false; // el visitante lo pausó: no se reanuda solo

  const setState = (state) => {
    filmCard.dataset.state = state;
    toggle.setAttribute('aria-label', { playing: 'Pausar video', paused: 'Reproducir video', rest: 'Repetir video' }[state]);
  };
  const play = () => film.play().catch(() => setState('paused'));

  film.addEventListener('play', () => setState('playing'));
  film.addEventListener('pause', () => { if (!film.ended) setState('paused'); });
  // El video trae su propia tarjeta final (data-endcard, en segundos): el texto de la banda se aparta
  const endCard = parseFloat(film.dataset.endcard) || Infinity;
  film.addEventListener('timeupdate', () => filmCard.classList.toggle('is-endcard', film.currentTime >= endCard));
  film.addEventListener('ended', () => {
    plays += 1;
    film.currentTime = 0;
    if (plays < PLAYS) play(); else setState('rest'); // en reposo vuelve al primer fotograma
  });

  toggle.addEventListener('click', () => {
    if (filmCard.dataset.state === 'playing') { wantsPlay = false; film.pause(); return; }
    wantsPlay = true;
    if (filmCard.dataset.state === 'rest') plays = 0;
    film.preload = 'auto';
    play();
  });

  setState('paused');
  toggle.hidden = false;
  wantsPlay = autoplay;

  if ('IntersectionObserver' in window) {
    // El video empieza a cargarse algo antes de verse; solo se reproduce si toca
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          film.preload = 'auto';
          if (wantsPlay && plays < PLAYS && film.paused) play();
        } else if (!film.paused) {
          film.pause();
        }
      });
    }, { threshold: 0.5, rootMargin: '200px 0px' }).observe(filmCard);
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
