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

// Hide hero subtitle early so scramble can reveal it
const heroSubtitleEl = document.querySelector('.hero-subtitle');
if (heroSubtitleEl && !prefersReducedMotion) {
  heroSubtitleEl.style.opacity = '0';
}

// ============================================
// DISABLE TRANSITIONS ON MOUNT
// ============================================
requestAnimationFrame(() => {
  document.body.classList.remove('no-transitions');
});

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ============================================
// CUSTOM CURSOR — Desktop only
// ============================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const interactiveElements = document.querySelectorAll('a, button, .tab-btn, .exp-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });
  });

  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button').forEach(el => {
    el.style.cursor = 'none';
  });
}

// ============================================
// THEME TOGGLE — Dark/Light
// ============================================
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  const savedTheme = localStorage.getItem('citystream-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('citystream-theme', isLight ? 'light' : 'dark');
    // Reapply gradient inline on hero chars (CSS can't override compositing-layer inline style)
    const grad = isLight
      ? 'linear-gradient(144deg, #7c2dbd, #4338ca 50%, #0891b2)'
      : 'linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb)';
    document.querySelectorAll('.hero-title .char').forEach(c => {
      c.style.background = grad;
      c.style.webkitBackgroundClip = 'text';
      c.style.backgroundClip = 'text';
    });
  });
}

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
// TAB SWITCHING with GSAP transitions
// ============================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;
    const targetPanel = document.getElementById('panel-' + targetTab);

    if (!targetPanel || btn.classList.contains('active')) return;

    // Update button states
    tabButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Get current active panel
    const currentPanel = document.querySelector('.tab-panel.active');

    if (prefersReducedMotion) {
      // No animation — instant switch
      if (currentPanel) {
        currentPanel.classList.remove('active');
        currentPanel.hidden = true;
      }
      targetPanel.hidden = false;
      targetPanel.classList.add('active');
    } else {
      // GSAP animated transition
      if (currentPanel) {
        gsap.to(currentPanel, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            currentPanel.classList.remove('active');
            currentPanel.hidden = true;
            gsap.set(currentPanel, { opacity: 1, y: 0 });

            targetPanel.hidden = false;
            targetPanel.classList.add('active');
            gsap.fromTo(targetPanel,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          }
        });
      } else {
        targetPanel.hidden = false;
        targetPanel.classList.add('active');
      }
    }
  });
});

// ============================================
// TEXT SCRAMBLE — Hero subtitle
// ============================================
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()';

function scrambleText(el, finalText, durationMs) {
  const totalChars = finalText.length;
  const framesPerChar = Math.round((durationMs / 1000 * 60) / totalChars);
  let frame = 0;
  let resolved = 0;

  el.style.opacity = '1';

  function tick() {
    resolved = Math.floor(frame / framesPerChar);
    if (resolved >= totalChars) {
      el.textContent = finalText;
      return;
    }
    let output = finalText.slice(0, resolved);
    for (let i = resolved; i < totalChars; i++) {
      const ch = finalText[i] === ' ' ? ' ' : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      output += ch;
    }
    el.textContent = output;
    frame++;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function startSubtitleScramble() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  const finalText = subtitle.textContent.trim();
  subtitle.style.opacity = '0';
  if (prefersReducedMotion) {
    subtitle.style.opacity = '1';
    return;
  }
  scrambleText(subtitle, finalText, 1200);
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
  // Hero entrance timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  heroTl
    .from('.hero-logo', { opacity: 0, y: 30, duration: 0.6 });

  // Char-level animation (Splitting.js) or word fallback
  const heroChars = document.querySelectorAll('.hero-title .char');
  if (heroChars.length > 0) {
    // Workaround: GSAP creates a compositing stacking context on chars (translate/rotate/scale: none)
    // which prevents CSS background-clip:text + background-image from rendering. Apply inline.
    const isDark = !document.body.classList.contains('light-theme');
    const heroGrad = isDark
      ? 'linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb)'
      : 'linear-gradient(144deg, #7c2dbd, #4338ca 50%, #0891b2)';
    heroChars.forEach(c => {
      c.style.background = heroGrad;
      c.style.webkitBackgroundClip = 'text';
      c.style.backgroundClip = 'text';
      c.style.color = 'transparent';
    });
    heroTl.fromTo(heroChars,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' },
      '-=0.3'
    );
  } else {
    heroTl.from('.hero-title', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');
  }

  heroTl
    .call(() => { startSubtitleScramble(); }, null, '+=0.1')
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.4 }, '+=0.35');

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

  // Features tabs container
  gsap.from('.features-tabs', {
    scrollTrigger: {
      trigger: '.features-tabs',
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

  // CTA section — fade in
  gsap.from('.cta-section', {
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
// MAGNETIC CTA BUTTON — Desktop only
// ============================================
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const magnetBtn = document.querySelector('.hero-actions .btn-primary');
  if (magnetBtn) {
    magnetBtn.addEventListener('mousemove', (e) => {
      const rect = magnetBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      gsap.to(magnetBtn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    magnetBtn.addEventListener('mouseleave', () => {
      gsap.to(magnetBtn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  }
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
// COUNT-UP — Stats section
// ============================================
function formatStat(val) {
  if (val >= 1000000) return Math.round(val / 1000000) + 'M';
  if (val >= 1000) return Math.round(val / 1000) + '';
  return Math.round(val) + '';
}

const statNumbers = document.querySelectorAll('.stat-number');

if (prefersReducedMotion) {
  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    el.textContent = formatStat(target) + suffix;
  });
} else {
  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true
      },
      onUpdate() {
        el.textContent = formatStat(Math.round(proxy.val)) + suffix;
      }
    });
  });
}
