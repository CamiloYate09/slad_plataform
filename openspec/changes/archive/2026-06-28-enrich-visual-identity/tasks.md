# Tasks — enrich-visual-identity

## 1. Tokens de forma + overlay de imagen (CSS puro, independiente)
- [x] 1.1 Tokens `--radius-md: 16px` y `--radius-lg: 24px` definidos; `--radius-lg` aplicado a
      los contenedores de media (`.features-item-image`, `.value-prop-image`). Cards siguen en
      16px (ya consistente); 32/36px del phone-mockup se mantienen (forma de hardware)
- [x] 1.2 Overlay duotone morado→cyan vía `::before` agrupado en `.exp-image`,
      `.features-item-image`, `.value-prop-image` (mix-blend-mode soft-light, opacidad 0.5, pointer-events none)
- [x] 1.3 Overlay atenuado en `body.light-theme` (0.28); contraste AA del texto → pendiente
      verificación visual en vivo (ver 6.3)

## 2. Display font en titulares
- [x] 2.1 Display font elegida: **Bricolage Grotesque** (OFL, variable)
- [x] 2.2 Cargada vía Google Fonts CDN (mismo mecanismo que Geist hoy) en `@import` y
      `<link preload+stylesheet>`. **Desviación de design.md**: NO self-hosteada aún —
      Geist tampoco lo está; el self-host/subset de AMBAS fuentes es tarea de
      `add-launch-readiness-2026` (2.3/2.4). Self-hostear solo una ahora sería prematuro y duplicado
- [x] 2.3 `--font-display` aplicada a `h1.hero-title`, `.section-header h2`,
      `.value-prop-content h2` y `.cta-card h2`; h3/body/nav/labels siguen en Geist
- [x] 2.4 Splitting.js (char reveal del hero title) sigue funcionando con la nueva fuente
      (verificado en render)

## 3. Cifras tabulares
- [x] 3.1 `font-variant-numeric: tabular-nums` ya presente en `.stat-number` — sin cambios

## 4. Botones magnéticos (JS vanilla)
- [x] 4.1 ~16 líneas en `static/js/main.js`: magnético en `.btn-primary`/`.cta-btn` con
      `transform` (máx ±8px), transición rápida durante el follow, reset suave en `pointerleave`
- [x] 4.2 Guardas: `!prefersReducedMotion` + `(hover: hover) and (pointer: fine)`

## 5. Reveal de media nativo (CSS scroll-driven)
- [x] 5.1 `animation-timeline: view()` + `animation-range: entry 5% cover 30%` en
      `.features-item-image` y `.value-prop-image` (opacity/scale, dentro de `@supports`)
- [x] 5.2 Fallback estático sin soporte (`@supports`) y desactivado con
      `@media (prefers-reduced-motion: no-preference)`

## 6. Validación
- [x] 6.1 `openspec validate enrich-visual-identity --strict` pasa
- [x] 6.2 `node --check static/js/main.js` OK
- [ ] 6.3 Revisión visual en navegador EN VIVO: display font OK (verificado en headless);
      pendiente overlay de imagen, magnético, reveal nativo, light mode, reduced-motion,
      mobile 375px — requieren scroll/pointer reales que headless estático no cubre
