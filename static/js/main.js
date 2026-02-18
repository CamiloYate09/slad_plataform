// ============================================
// GSAP + ScrollTrigger Initialization
// ============================================
gsap.registerPlugin(ScrollTrigger);

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  });
}

// ============================================
// SPLIT TEXT ANIMATION — Hero title
// ============================================
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && !prefersReducedMotion) {
  const text = heroTitle.textContent;
  const words = text.split(' ');
  heroTitle.innerHTML = words.map(word =>
    '<span class="split-word" style="display:inline-block;opacity:0">' + word + '</span>'
  ).join(' ');
}

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
// GSAP SCROLL ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
  // Hero entrance timeline
  const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  heroTl
    .from('.hero-logo', { opacity: 0, y: 30, duration: 0.6 });

  // Split text word animation or fallback
  const splitWords = document.querySelectorAll('.split-word');
  if (splitWords.length > 0) {
    heroTl.fromTo(splitWords,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
      '-=0.3'
    );
  } else {
    heroTl.from('.hero-title', { opacity: 0, y: 30, duration: 0.6 }, '-=0.3');
  }

  heroTl
    .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.4 }, '-=0.2');

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
