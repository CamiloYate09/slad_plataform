# Design: ux-impact-animations

## Architectural Decisions

### AD-1: CSS vs JS para orbes del hero
**Decision:** CSS puro (`@keyframes`) para los orbes del hero
**Rationale:** Los orbes son puramente decorativos. CSS no bloquea el hilo principal y se ejecuta antes de que el JS cargue, dando una experiencia inmediata. GSAP sería overkill para un simple float animation.

### AD-2: Magnetic button — scope limitado
**Decision:** Solo aplicar el efecto magnético al `.btn-primary` dentro de `.hero-actions`, no a todos los botones
**Rationale:** Demasiados elementos magnéticos simultáneos se vuelven confusos. El CTA del hero es el elemento más importante; ahí tiene máximo impacto.

### AD-3: Clip-path reveal — palabras, no caracteres
**Decision:** Animar por palabras (como ya hace el hero), no por caracteres individuales
**Rationale:** La animación por caracteres requiere split-text más complejo. Por palabras se puede reutilizar el patrón existente de `split-word` en el hero. Menos código, misma energía visual.

### AD-4: Parallax en experience cards — `overflow: hidden` en contenedor
**Decision:** El parallax de imágenes usa `y` negativo; el contenedor `.exp-image` necesita `overflow: hidden` para que la imagen no salga del card
**Rationale:** Si el contenedor no tiene overflow hidden, la imagen en parallax saldrá visualmente del card cuando el `y` sea negativo. El CSS ya tiene `overflow: hidden` en `.exp-image`; confirmar y mantener.

### AD-5: Progress bar — elemento existente vs nuevo
**Decision:** Reutilizar el `<div class="progress-bar">` ya existente en el HTML como top progress bar
**Rationale:** Ya existe un elemento `.progress-bar` en el hero. Sin embargo, tiene posicionamiento relativo al hero. Se creará un nuevo elemento fijo en el `<body>` para el top progress bar global, para no romper el diseño del hero.

### AD-6: Active nav — ScrollTrigger `toggleClass` vs Intersection Observer
**Decision:** ScrollTrigger con `toggleClass`
**Rationale:** Ya se usa GSAP/ScrollTrigger en el proyecto. Mantener consistencia en lugar de agregar Intersection Observer.

## Implementation Plan

### Archivos modificados:
1. `index.html` — agregar hero scroll indicator, hero ambient orbs, top progress bar element
2. `static/css/style.css` — estilos para orbes, scroll indicator, progress bar, hover cards, active nav, clip-path
3. `static/js/main.js` — magnetic button, active nav ScrollTrigger, clip-path reveal, exp parallax, progress bar GSAP

### Orden de implementación:
1. CSS-only features primero (orbes, scroll indicator, hover cards, progress bar styles)
2. HTML additions (progress bar element, scroll indicator, orbes divs)
3. JS features (magnetic, nav active, clip-path reveal, parallax, progress bar)
4. QA en múltiples breakpoints

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Magnetic button interfiere con click | Bajo | Alto | Usar `pointer-events: none` en overlay, aplicar transform solo al button visual |
| Clip-path reveal rompe layout en Safari | Medio | Medio | Testar con `clip-path: inset(0)` como fallback; prefixear si necesario |
| Parallax en exp cards causa layout shift | Bajo | Medio | El contenedor ya tiene `overflow: hidden`; mantener `y` range conservador (±20px) |
| Orbes del hero afectan performance | Bajo | Bajo | `will-change: transform` + `filter: blur` en GPU; solo 3 orbes |
