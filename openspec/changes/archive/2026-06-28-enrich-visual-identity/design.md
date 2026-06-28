# Design — enrich-visual-identity

## Decisiones

### Display font (titulares)
- **Criterio**: variable, self-hostable, subset latin, licencia OFL/libre, complementa
  a Geist (geométrica/grotesca con más carácter en displays grandes). Candidatas:
  **Clash Display**, **Satoshi** (display weights) o **Bricolage Grotesque** (variable,
  OFL, buen rasgo editorial). Decisión final en apply; default sugerido:
  **Bricolage Grotesque** (OFL, variable, fácil de subset).
- **Alcance**: solo `h1.hero-title` y `h2` de `.section-header` / `.value-prop`. El
  resto (h3, body, nav, stats, labels) sigue en Geist.
- **Carga (decisión de implementación)**: se carga por Google Fonts CDN, el mismo
  mecanismo que Geist usa HOY (`@import` + `<link preload+stylesheet>`). Self-hostear
  solo la display font mientras Geist sigue en CDN sería prematuro y duplicaría infra;
  la migración a self-host/subset de AMBAS fuentes es tarea de `add-launch-readiness-2026`
  (2.3/2.4). La CSP existente ya permite `fonts.googleapis.com`/`fonts.gstatic.com`.
- **Riesgo**: dos familias = +1 asset. Mitigado con subset latin (un solo peso variable,
  ~15–25KB woff2). No se carga vía CDN (evita request extra + cumple CSP existente).

### Overlay duotone de imagen
- **Técnica**: pseudo-elemento `::after` sobre el contenedor de imagen con
  `linear-gradient` morado→cyan y `mix-blend-mode: soft-light` (o `overlay`),
  opacidad ~12%. No toca el `<img>` ni su `alt`. `pointer-events: none`.
- **Por qué pseudo y no `filter`**: `filter` sobre `<img>` afecta nitidez y es más caro;
  el overlay como capa preserva la foto y se atenúa en `body.light-theme`.
- **Radios**: introducir/usar tokens `--radius-md: 16px`, `--radius-lg: 24px` y aplicar
  consistentemente; eliminar 32/36px ad-hoc salvo el phone-mockup (forma de hardware).

### Botones magnéticos
- **Alcance**: `.btn-primary` y `.cta-btn` (CTAs principales), no todos los enlaces.
- **Implementación**: ~20 líneas vanilla en `main.js` — en `pointermove` dentro del
  botón, trasladar con `transform` hacia el cursor (máx ±8px), reset en `pointerleave`.
- **Guardas**: solo `(hover: hover) and (pointer: fine)`; desactivado con
  `prefers-reduced-motion: reduce`. Sin librería.

### Reveal de media ligado a scroll
- **Técnica**: CSS nativo `animation-timeline: view()` con `animation-range` para
  animar `opacity`/`scale` de `.features-item-image` y `.value-prop-image` según su
  posición en viewport. Alinea con el eje "CSS nativo vs GSAP" de launch-readiness.
- **Fallback**: navegadores sin `animation-timeline` muestran la imagen estática
  (estado final). `@media (prefers-reduced-motion: reduce)` desactiva la animación.
- **Por qué nativo y no GSAP**: no añade JS al main thread; ScrollTrigger ya está
  saturado de responsabilidades. Si el soporte fuera insuficiente, el fallback estático
  es aceptable (no es contenido crítico).

## Secuencia
1. Tokens de radio + overlay (CSS puro, sin dependencias) — independiente.
2. Display font (asset + `@font-face` + aplicar a h1/h2) — coordinar con
   `add-launch-readiness-2026` si corre antes.
3. tabular-nums en stats — trivial, independiente.
4. Magnético (JS) y reveal nativo (CSS) — independientes entre sí.

## Trade-offs aceptados
- Display font solo en 2 niveles: deliberado, evita saturar y mantiene legibilidad.
- Reveal nativo puede no correr en navegadores viejos: aceptado vía fallback estático.
