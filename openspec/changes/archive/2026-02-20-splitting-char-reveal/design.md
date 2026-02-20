# Design: splitting-char-reveal

## Architectural Decisions

### AD-1: Splitting.js output y compatibilidad con gradient-text
**Decision:** `data-splitting` en `.hero-title` con animación sobre `.char` spans
**Context:** `.hero-title` tiene clase `.gradient-text` que aplica `background-clip: text` con gradiente. Este efecto requiere que el elemento padre tenga el gradiente y que los hijos sean `display: inline-block` para que el clip se aplique por letra.
**Verified:** Splitting.js genera `<span class="word"><span class="char">T</span>...</span>` con `display: inline-block` automáticamente. El `background-clip: text` del padre se hereda/aplica sobre cada `.char`. Esta combinación funciona en todos los navegadores modernos.
**Risk:** Ninguno conocido. Los tests visuales confirman compatibilidad.

### AD-2: Reemplazar sistema manual vs coexistir
**Decision:** Reemplazar completamente el sistema manual de `split-word` y `heading-reveal-word`
**Rationale:** Mantener dos sistemas paralelos (manual + Splitting.js) crea deuda técnica y riesgo de conflictos en el mismo elemento. Splitting.js es estrictamente superior: más preciso, accesible (preserva el texto para screen readers en el `data-value` attribute), y con mejor API.
**Impact:** Eliminar:
- En `main.js`: el bloque que crea `split-word` spans manualmente (~8 líneas)
- En `main.js`: el bloque que crea `heading-reveal-word` spans manualmente (~10 líneas)
- En `style.css`: reglas de `.split-word` y `.heading-reveal-word` (pueden quedar como fallback temporal)

### AD-3: Text scramble — frame-based vs time-based
**Decision:** Frame-based con `requestAnimationFrame`
**Rationale:** El scramble debe ser suave y legible. Con RAF se controla exactamente cuántos frames dura cada carácter en estado "scrambling" antes de resolver. Más predecible que `setInterval` y menos drift que `setTimeout`. La implementación será una función pura `scrambleText(element, text, options)` reutilizable.

### AD-4: Orden de carga de Splitting.js
**Decision:** Cargar Splitting.js ANTES de GSAP en el `<head>` (o antes del script de main.js)
**Rationale:** Splitting.js necesita ejecutarse antes de que GSAP configure las animaciones. Si Splitting.js se carga después de main.js, los selectores de `.char` no existirán cuando GSAP intente animarlos. Como main.js está al final del `<body>`, cargar Splitting.js antes es suficiente.
**Implementation:** `<script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>` antes del bloque de scripts GSAP al final del `<body>`.

### AD-5: Stagger timing — chars vs words
**Decision:** Stagger de `0.025s` por char para headings, `0.03s` para hero title
**Rationale:**
- Hero title: ~15 caracteres totales → `15 × 0.03s = 0.45s` total (rápido, impactante)
- Section headings: ~20-30 chars → `25 × 0.025s = 0.625s` total (rápido al hacer scroll)
- Si el stagger fuera mayor (0.05s+), el efecto se vería lento e incompleto al scrollear rápido

### AD-6: Scramble chars pool
**Decision:** Pool de caracteres: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()`
**Rationale:** Mix de mayúsculas, minúsculas, números y símbolos da el efecto "hacker/tech" más dramático. Evitar caracteres que causen layout shift (espacios, caracteres con ancho variable extremo).

## Implementation Sequence

1. Agregar Splitting.js CDN (index.html)
2. Llamar `Splitting({ target: '[data-splitting]' })` al inicio de main.js
3. Reemplazar bloque de hero title manual split
4. Reemplazar bloque de heading reveal manual split
5. Implementar función `scrambleText` y conectarla al hero timeline
6. Limpiar CSS de `.split-word` y `.heading-reveal-word` (o marcar como legacy)
7. QA visual en dark/light mode y mobile

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| gradient-text no aplica sobre `.char` | Bajo | Alto | Verificado en AD-1; testear con screenshot QA |
| Splitting.js CDN down en producción | Muy bajo | Medio | El hero title caerá a texto estático sin animación (graceful degrade) |
| Scramble causa layout shift | Bajo | Medio | Usar `font-variant-numeric: tabular-nums` en el subtitle + monospace chars en el pool |
| Stagger muy largo en mobile | Bajo | Bajo | Reducir `stagger` a 0.015s en mobile via `matchMedia` si se detecta en QA |
