# Project Context

## Purpose
Landing page para CityStream, la primera red social de Colombia. El sitio presenta la marca, sus funcionalidades principales (ciudades, eventos, personas, conciertos) y experiencias destacadas en ciudades colombianas.

## Tech Stack
- HTML5 (single page: index.html)
- CSS3 vanilla (static/css/style.css)
- JavaScript vanilla (static/js/main.js)
- Google Fonts: Geist Sans (100-900, variable)
- RemixIcon v4.2.0 (CDN)
- GSAP v3.12.5 + ScrollTrigger (CDN: cdnjs.cloudflare.com)
- GitHub Pages (hosting en citystream.co)

## Project Conventions

### Code Style
- Idioma del contenido: espanol (lang="es")
- CSS: variables custom properties, responsive breakpoints (1024px, 768px, 480px)
- Animaciones: GSAP + ScrollTrigger para scroll-driven animations, CSS @keyframes para carousel y progress bar
- Gradient text: solo via clase `.gradient-text` en h1/h2
- Link hover: naranja `#f97316` (--accent-orange-hover) con underline-reveal

### Architecture Patterns
- Single HTML page con secciones ancla (#inicio, #features, #experiencias, #contacto)
- Secciones en orden factory.ai: navbar → hero → trusted-by → features (tabs) → value-prop → experiences → footer
- CSS organizado por secciones con comentarios de separacion
- JS: GSAP para animaciones, vanilla para interacciones (tabs, menu)

### Git Workflow
- Branch principal: main
- Deploy automatico via GitHub Pages

## Domain Context
- Audiencia: Colombia (locale es_CO)
- Dominio: citystream.co
- Redes sociales: YouTube, Facebook, Instagram, Twitter

## Important Constraints
- Sitio estatico (sin backend, sin build tools)
- Hosting en GitHub Pages (sin server-side processing)
- Sin framework JS (vanilla + GSAP)

## External Dependencies
- Google Fonts CDN (fonts.googleapis.com) — Geist Sans
- RemixIcon CDN (cdn.jsdelivr.net)
- GSAP CDN (cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/)
- ScrollTrigger CDN (cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/)
