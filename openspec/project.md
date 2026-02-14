# Project Context

## Purpose
Landing page para CityStream, la primera red social de Colombia. El sitio presenta la marca, sus funcionalidades principales (ciudades, eventos, personas, conciertos) y experiencias destacadas en ciudades colombianas.

## Tech Stack
- HTML5 (single page: index.html)
- CSS3 vanilla (static/css/style.css)
- JavaScript vanilla (static/js/main.js)
- Google Fonts: Public Sans (300, 400, 500, 600, 700)
- RemixIcon v4.2.0 (CDN)
- GitHub Pages (hosting en citystream.co)

## Project Conventions

### Code Style
- Idioma del contenido: espanol (lang="es")
- CSS: variables custom properties, mobile-first breakpoints
- Animaciones: solo CSS transitions + IntersectionObserver nativo (no librerias externas)
- Gradient text: solo via clase `.gradient-text` en h1/h2

### Architecture Patterns
- Single HTML page con secciones ancla (#inicio, #features, #cursos, #newsletter, #contacto)
- CSS organizado por secciones con comentarios de separacion
- JS modular sin dependencias externas

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
- Sin framework JS (vanilla only)

## External Dependencies
- Google Fonts CDN (fonts.googleapis.com)
- RemixIcon CDN (cdn.jsdelivr.net)
