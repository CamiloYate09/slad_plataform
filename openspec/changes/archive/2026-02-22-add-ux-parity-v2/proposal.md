# Change: UX Parity v2 — Cerrar la brecha visual con factory.ai

## Why

CityStream ya incorporó las fundaciones de la experiencia factory.ai (Splitting.js, ambient orbs, scroll progress bar, Lenis, stats count-up, imágenes hi-res). Sin embargo, al comparar lado a lado persisten cinco brechas de UX/UI que diferencian a factory.ai como referente del estado del arte: el scroll narrativo tipo "sticky-scroll", la textura de fondo diagonal, la banda oscura de contraste mid-page, la tarjeta CTA pre-footer oscura, y la indicación de sección activa en el navbar. Aplicar estas cinco mejoras llevaría la landing de CityStream al mismo nivel de refinamiento perceptual que factory.ai.

## What Changes

- **[1] sticky-scroll-features**: Reemplaza el sistema de tabs horizontal de Features por un scroll narrativo vertical: el heading queda pinned y los paneles de contenido se revelan secuencialmente mientras el usuario hace scroll — exactamente como la sección "Droids meet you wherever you work" en factory.ai. Usa GSAP ScrollTrigger pinning con `scrub`.
- **[2] background-texture**: Añade una textura diagonal sutil (líneas cruzadas con SVG data-URI o CSS `repeating-linear-gradient`) como overlay en el `body`, replicando el efecto de fondo de factory.ai que da profundidad sin distraer.
- **[3] dark-contrast-band**: Convierte la sección `numbered-features` ("Construido diferente") en una banda de fondo oscuro full-width (`#1a1a1a` / `var(--bg-dark-band)`), creando el mismo ritmo visual claro-oscuro-claro que usa factory.ai.
- **[4] cta-dark-card**: Eleva la sección `.cta-section` actual a una tarjeta oscura prominente estilo factory.ai: fondo negro, texto blanco grande, subtexto monospace, y un botón de acción destacado. Reemplaza la implementación ligera actual.
- **[5] navbar-active-section**: Mientras el usuario hace scroll, el enlace de navegación que corresponde a la sección visible se marca con estado activo (font-weight + acento naranja), usando ScrollTrigger o IntersectionObserver.

## Impact

- Affected specs: `layout-animations`, `visual-theme`, `header-footer`, `page-structure`
- Affected code: `index.html`, `static/css/style.css`, `static/js/main.js`
- No dependencias externas nuevas (todo con GSAP ya cargado + CSS puro)
- Compatible con modo claro/oscuro y `prefers-reduced-motion`
- No breaking changes — mejoras aditivas o upgrades de secciones existentes

## Reference Benchmark

factory.ai visitado el 2026-02-21. Patrones observados:
- Sticky scroll section (items 01–05, dashed border, right panel cambia)
- Background: textura diagonal fina sobre `#f0f0f0`
- Dark band: sección "ENTERPRISE" con `background: #1c1c1c`
- Pre-footer: tarjeta `BUILD WITH US / START BUILDING →` en negro
- Navbar: ítem activo en naranja mientras se navega
