# Tasks — Elementos inspirados en robot.com

## 1. Stats band (proof-points)
- [x] 1.1 ~~Definir métricas reales~~ → PLACEHOLDERS marcados (cifras 2 y 3 con tag visible "placeholder" + comentario TODO); reemplazar antes de publicar
- [x] 1.2 Añadir `<section class="stats-band">` en `index.html` entre `trusted-by` y `features`, con grid de `.stat` (número + label)
- [x] 1.3 Estilos en `static/css/style.css`: número grande con `.gradient-text`, label muted, responsive (768/480), tokens existentes
- [x] 1.4 Animación de conteo en scroll con ScrollTrigger en `static/js/main.js`, reutilizando GSAP; sin animar si `prefers-reduced-motion`
- [x] 1.5 Contraste vía tokens existentes; sección sin `id` → no rompe anclas del navbar

## 2. Footer con personalidad
- [x] 2.1 Acento animado (`.footer-badge-dot`) junto a `.footer-badge` con `@keyframes` CSS (sin JS, sin GIF)
- [x] 2.2 Animación desactivada en `@media (prefers-reduced-motion: reduce)`
- [x] 2.3 Punto inline de 7px con `aria-hidden` → sin layout shift relevante

## 3. Copy directo (microcopy)
- [x] 3.1 Hero subtitle reescrito a tono directo ("vivir tu ciudad hoy, no algún día"); CTA "Explorar Ahora" ya imperativo
- [x] 3.2 Ortografía/acentos revisados (lang="es")

## 4. Validación
- [x] 4.1 `openspec validate add-robot-inspired-sections --strict`
- [x] 4.2 `node --check` del JS OK; render del contador verificado (es-CO + sufijo)
- [ ] 4.3 Revisión visual manual desktop/móvil + `prefers-reduced-motion` (pendiente del usuario en navegador)
