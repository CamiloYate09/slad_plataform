# Change: Añadir ambient glow, sección de estadísticas y hero enriquecido

## Por qué

Comparando CityStream con factory.ai, el sitio ya tiene implementado lo más difícil: Geist Sans, GSAP, Lenis, custom cursor, estructura de secciones, OG tags, SEO y schema.org. Los **tres gaps visuales más notables que quedan** son:

1. **Fondo plano sin profundidad** — factory.ai tiene radial gradient glows detrás de sus secciones que le dan un aspecto premium al tema oscuro. CityStream tiene fondo `#0a0a0a` completamente plano.
2. **Sin sección de métricas/social proof** — factory.ai muestra "Trusted by Podium, Groq, Chainguard". CityStream menciona "50,000 conexiones" enterrada en una news card. Una sección dedicada de estadísticas con contadores animados agrega credibilidad inmediata.
3. **Hero sin contraste visual de fondo** — factory.ai tiene un orb/glow detrás del hero que lo ancla visualmente. CityStream tiene texto flotando sobre negro puro.

## Qué cambia

- **CSS**: Sistema de ambient glow con custom properties `--glow-*`. Pseudo-elementos `::before` en hero, features y experiences con `radial-gradient` + `filter: blur()`. No agrega JS.
- **HTML**: Nueva sección `.stats` entre `.trusted-by` y `.features` con 4 métricas (usuarios, ciudades, eventos, conexiones) separadas por líneas verticales factory.ai-style.
- **JS**: Animación count-up con GSAP ScrollTrigger para los números de estadísticas. Respeta `prefers-reduced-motion`.
- **CSS del hero**: Orb de glow centrado detrás del contenido del hero (solo CSS).

## Impacto

- Affected specs: `visual-theme` (ambient glow system), `layout-animations` (count-up animation), `page-structure` (nueva sección stats en el orden)
- Affected code: `static/css/style.css`, `index.html`, `static/js/main.js`
- No hay breaking changes — se agrega, no se modifica estructura existente

## Qué NO cambia (fuera de scope)

- Mobile experience refinements (propuesta separada)
- Performance/lazy loading optimization (propuesta separada)
- Contenido de screenshots de producto en tabs (decisión editorial)
- Glassmorphism avanzado en cards (bajo impacto relativo)
