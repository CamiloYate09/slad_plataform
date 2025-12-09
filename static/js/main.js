// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Navbar scroll effect - adds blur and shadow on scroll
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ScrollReveal animations - Updated for new sections
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  reset: false
};

// Hero Section animations
ScrollReveal().reveal(".hero-content img", {
  ...scrollRevealOption,
  delay: 200,
  origin: "top"
});

ScrollReveal().reveal(".hero-title", {
  ...scrollRevealOption,
  delay: 400,
});

ScrollReveal().reveal(".hero-subtitle", {
  ...scrollRevealOption,
  delay: 600,
});

ScrollReveal().reveal(".hero-cta", {
  ...scrollRevealOption,
  delay: 800,
});

// Decorative cubes
ScrollReveal().reveal(".decorative-cube", {
  ...scrollRevealOption,
  delay: 1000,
  interval: 200,
  origin: "left"
});

// Features Section
ScrollReveal().reveal(".section-header", {
  ...scrollRevealOption,
  delay: 200,
});

ScrollReveal().reveal(".feature-card", {
  ...scrollRevealOption,
  delay: 300,
  interval: 150,
});

// Courses/Cities Section
ScrollReveal().reveal(".course-card", {
  ...scrollRevealOption,
  delay: 200,
  interval: 200,
});

// Newsletter Section
ScrollReveal().reveal(".newsletter-container", {
  ...scrollRevealOption,
  delay: 200,
  scale: 0.95
});

// Footer
ScrollReveal().reveal(".footer-column", {
  ...scrollRevealOption,
  delay: 100,
  interval: 100,
});

ScrollReveal().reveal(".footer-bottom", {
  ...scrollRevealOption,
  delay: 400,
});

// Background slideshow
document.addEventListener('DOMContentLoaded', function() {
  const backgrounds = document.querySelectorAll('.bg-slide');
  let currentIndex = 0;

  function changeBackground() {
    // Remove active class from all backgrounds
    backgrounds.forEach(bg => bg.classList.remove('active'));

    // Increment index
    currentIndex = (currentIndex + 1) % backgrounds.length;

    // Add active class to next background
    backgrounds[currentIndex].classList.add('active');
  }

  // Change background every 5 seconds
  setInterval(changeBackground, 5000);

  // Feature cards hover effect enhancement
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-1rem)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Newsletter form handling
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('.newsletter-input').value;

      // Show success message (you can customize this)
      const button = this.querySelector('button');
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="ri-check-line"></i> <span>Suscrito!</span>';
      button.style.background = 'var(--accent-green)';

      // Reset after 3 seconds
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
        this.reset();
      }, 3000);
    });
  }
});

// Intersection Observer for animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observe elements that should animate
document.querySelectorAll('.feature-card, .course-card, .newsletter-container').forEach(el => {
  observer.observe(el);
});
