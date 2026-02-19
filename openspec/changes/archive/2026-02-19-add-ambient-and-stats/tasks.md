## 1. CSS — Sistema de ambient glow

- [x] 1.1 Añadir custom properties `--glow-purple`, `--glow-blue`, `--glow-cyan` en `:root` de `style.css`
- [x] 1.2 Añadir `position: relative; overflow: hidden;` a `.hero`, `.features`, `.experiences`
- [x] 1.3 Implementar `.hero::before` con radial-gradient purple centrado (`50% -10%`, opacity 0.18)
- [x] 1.4 Implementar `.features::before` con radial-gradient blue derecha-arriba (`100% 0%`, opacity 0.12)
- [x] 1.5 Implementar `.experiences::before` con radial-gradient cyan izquierda-centro (`0% 50%`, opacity 0.08)
- [x] 1.6 Añadir reglas `body.light-theme .hero::before`, `.features::before`, `.experiences::before` con opacity reducida (50%)
- [x] 1.7 Verificar que `z-index: 0` en pseudo-elementos no solapan contenido (contenido necesita `position: relative; z-index: 1`)

## 2. HTML — Sección de estadísticas

- [x] 2.1 Añadir `<section class="stats">` entre `.trusted-by` y `.features` en `index.html`
- [x] 2.2 Incluir 4 `.stat-item` con `data-target` y `data-suffix` en cada elemento
- [x] 2.3 Confirmar con el equipo los valores reales de las métricas (default: 50K+, 5, 100K+, 10K+)

## 3. CSS — Estilos de la sección stats

- [x] 3.1 Implementar `.stats` con `padding`, `border-top` y `border-bottom` (separadores factory.ai)
- [x] 3.2 Implementar `.stats-grid` como `display: flex; gap: 0;` con separadores `border-right` entre items
- [x] 3.3 Implementar `.stat-number` con tipografía grande (`clamp(2rem, 5vw, 3.5rem)`), peso 700, gradient-text
- [x] 3.4 Implementar `.stat-label` con `var(--text-secondary)`, `font-size: var(--fs-sm)`, `text-transform: uppercase`
- [x] 3.5 Media query mobile: `.stats-grid` en 2×2 grid con separadores ajustados
- [x] 3.6 Light-theme overrides para colores de `.stat-number`

## 4. JS — Count-up animation

- [x] 4.1 Añadir función `formatStat(val)` que formatea números: ≥1000 → "50K", ≥1000000 → "1M"
- [x] 4.2 Implementar loop GSAP sobre `.stat-number` con `data-target`, disparo via ScrollTrigger `once: true`
- [x] 4.3 Añadir guard `prefersReducedMotion` — si activo, mostrar valor final directamente sin animación
- [x] 4.4 Verificar que el count-up no interfiere con otras animaciones ScrollTrigger existentes

## 5. Validación visual

- [x] 5.1 Verificar ambient glow en dark mode: glows visibles pero sutiles (no saturados)
- [x] 5.2 Verificar ambient glow en light mode: glows reducidos, no se ven raros sobre fondo claro
- [x] 5.3 Verificar stats section en desktop (fila horizontal con separadores)
- [x] 5.4 Verificar stats section en mobile (grid 2×2)
- [x] 5.5 Verificar count-up animation dispara correctamente al llegar al viewport
- [x] 5.6 Verificar con `prefers-reduced-motion: reduce` — números aparecen directamente sin animación

## 6. Spec alignment

- [x] 6.1 Confirmar que ambient glow cumple `visual-theme` spec (Ambient Glow System)
- [x] 6.2 Confirmar que count-up cumple `layout-animations` spec (Animated Statistics Counter)
- [x] 6.3 Confirmar que sección stats está en el orden correcto según `page-structure` spec
