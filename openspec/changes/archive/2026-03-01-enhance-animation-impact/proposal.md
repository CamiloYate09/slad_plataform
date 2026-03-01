# Change: Enhance Animation Impact

## Why
La landing page ya tiene animaciones sólidas (GSAP scroll reveals, Splitting.js, parallax, partículas) pero carece de micro-interacciones de alto impacto visual y efectos de entrada más dramáticos que eleven la percepción premium del producto.

## What Changes
- Añadir efecto 3D tilt en tarjetas de experiencia (.exp-card) y tarjetas numeradas (.num-card)
- Añadir mouse parallax en ambient orbs del hero (profundidad con cursor)
- Añadir animación de entrada staggered para stat-items (actualmente solo cuentan sin reveal)
- Añadir clip-path slide-in para .section-label badges
- Añadir data-splitting + char reveal al h2 de value-prop
- Añadir animated gradient border (conic-gradient CSS) en .cta-card
- Añadir glow pulse CSS en .cta-btn
- Añadir shine sweep (::after) en hover de tarjetas de noticias y featured cards

## Impact
- Affected specs: animations/spec.md
- Affected code: static/js/main.js, static/css/style.css, index.html
