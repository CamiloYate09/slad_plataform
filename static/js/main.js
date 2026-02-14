// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    // Close mobile menu if open
    const navRight = document.querySelector('.nav__right');
    const navOverlay = document.querySelector('.nav__overlay');
    if (navRight) navRight.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile hamburger menu toggle
const navToggle = document.querySelector('.nav__toggle');
const navRight = document.querySelector('.nav__right');
const navOverlay = document.querySelector('.nav__overlay');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navRight.classList.toggle('active');
    navOverlay.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
  });
}

if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    navRight.classList.remove('active');
    navOverlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  });
}

// Background slideshow
const backgrounds = document.querySelectorAll('.bg-slide');
let currentSlide = 0;

function changeBackground() {
  backgrounds.forEach(bg => bg.classList.remove('active'));
  currentSlide = (currentSlide + 1) % backgrounds.length;
  backgrounds[currentSlide].classList.add('active');
}

if (backgrounds.length > 1) {
  setInterval(changeBackground, 5000);
}

// IntersectionObserver for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const button = this.querySelector('button');
    const originalHTML = button.innerHTML;

    button.innerHTML = '<i class="ri-check-line"></i> <span>Suscrito!</span>';
    button.style.background = 'var(--accent-green)';

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
      this.reset();
    }, 3000);
  });
}
