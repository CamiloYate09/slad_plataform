# Design: UX Parity v2

## Context

Proyecto estático: HTML + CSS + JS vanilla, GSAP 3.12.5 + ScrollTrigger, Lenis smooth scroll. Sin build tools. Hosting GitHub Pages.

## Goals / Non-Goals

**Goals:**
- Replicar los cinco patrones de UX de factory.ai más distintivos
- Mantener compatibilidad con Lenis (el `scrub` de ScrollTrigger debe conectarse al ticker de Lenis)
- Modo claro/oscuro funcional en todos los cambios
- Accesibilidad: `prefers-reduced-motion` respetado, navegación por teclado intacta

**Non-Goals:**
- Animaciones de cursor customizado (ya implementado)
- Cambios en el contenido de copy o imágenes
- Internacionalización

## Decisions

### [1] Sticky-scroll con GSAP ScrollTrigger Pin

**Decisión**: Usar `ScrollTrigger.pin()` en el wrapper de la sección features. Cada panel de contenido se muestra/oculta con `toggleClass` o `gsap.set(visibility)` al llegar a su scroll milestone.

**Por qué no CSS position:sticky**: ScrollTrigger da control preciso del timeline y se integra con Lenis sin hacks. CSS sticky no permite triggering de cambios de panel.

**Integración con Lenis**: ScrollTrigger ya está conectado al ticker de Lenis en el `main.js` actual (`gsap.ticker.add((time) => lenis.raf(time * 1000))`). El pin GSAP funciona correctamente con esta integración.

**Estructura HTML resultante**:
```
.features-sticky-wrap (el wrapper que se pina)
  .features-sticky-left  (permanece visible — heading + numbered list)
  .features-sticky-right (panel que cambia de imagen/contenido)
.features-scroll-items   (altura extra que da el "espacio" de scroll)
  .features-item (x4, uno por cada funcionalidad)
```

**Mobile**: En breakpoint ≤768px, se revierte a layout vertical sin sticky (los 4 items apilados), equivalente al tab system actual pero más limpio.

### [2] Background Texture

**Decisión**: CSS puro con `repeating-linear-gradient` en el `body::before` pseudo-elemento.

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.015) 3px,
    rgba(0,0,0,0.015) 4px
  );
  pointer-events: none;
  z-index: 0;
}
```

**Por qué no SVG**: El gradient CSS no necesita carga externa, es más liviano y ajustable via variables.

**Dark mode**: En dark mode la opacidad sube a `rgba(255,255,255,0.02)` para ser visible sobre fondo oscuro.

### [3] Dark Contrast Band

**Decisión**: Añadir `background: var(--bg-dark-band)` y los colores de texto correspondientes a `.numbered-features`. La variable se define en `:root` con fallback `#1a1a1a`.

**Por qué `.numbered-features`**: Es la sección mid-page más corta y autónoma — sin imágenes externas, sin tabs. Ideal para el contraste. Además los números `01/02/03` ya son un patrón que factory.ai usa en sus dark sections.

### [4] CTA Dark Card

**Decisión**: Reescribir `.cta-section` como una tarjeta oscura de ancho limitado (max 760px) con borde sutil, al estilo del "BUILD WITH US" de factory.ai. Centrada horizontalmente, con padding generoso y tipografía monospace en el label.

**Estructura**:
```
.cta-section
  .cta-card  (dark card, border, border-radius)
    span.cta-label  ("• ÚNETE")
    h2.cta-title    (heading principal)
    a.cta-btn       ("COMENZAR →")
```

### [5] Navbar Active Section

**Decisión**: IntersectionObserver (no ScrollTrigger) — más liviano para este uso específico. Cada sección ancla (`#inicio`, `#features`, `#experiencias`, `#noticias`, `#contacto`) se observa. Cuando entra al viewport (threshold 0.3), el enlace correspondiente recibe clase `.nav-active`.

**Estilo activo**: `color: var(--accent-orange)` + `font-weight: 600`. Sin underline extra (ya existe underline-reveal en hover, no queremos conflicto).

## Risks / Trade-offs

- **Sticky scroll + Lenis en mobile Safari**: Lenis puede causar jank con elementos pinned en iOS. Mitigation: deshabilitar sticky-scroll en mobile (≤768px) y renderizar el layout vertical.
- **Dark band + light mode**: La banda oscura siempre será oscura (no invierte en light mode) — es una decisión de diseño deliberada para crear contraste, igual que factory.ai.
- **Scroll narrative vs tabs**: Los tabs permiten navegación directa al usuario. El sticky-scroll es más pasivo. Mitigation: añadir la lista numerada clickeable en el lado izquierdo (clic en ítem avanza el scroll a ese panel).

## Open Questions

- ¿Se mantiene el texto "Todo lo que necesitas, en una app" como heading de la sección sticky? (Recomendado: sí)
- ¿El numbered list de la izquierda debe ser clickeable para saltar al panel? (Recomendado: sí, como en factory.ai)
