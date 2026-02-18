# Change: Enhance Factory.ai Polish — Smooth Scroll, Typography & Micro-Interactions

## Why
El rebuild de factory.ai esta completo estructuralmente, pero faltan detalles de polish que hacen que factory.ai se sienta premium: smooth scroll suave, tipografia mas agresiva en headings, y micro-interacciones refinadas. Estos cambios cierran la brecha visual restante.

## What Changes
- Integrar Lenis smooth scroll para desplazamiento suave tipo butter
- Tipografia mas agresiva: display headings mas grandes, tracking mas apretado
- Micro-interacciones mejoradas: hover states mas ricos en botones y cards
- Efecto parallax sutil en el hero y value-prop images
- Performance: preload de fuente critica, optimizacion de CSS

## Impact
- Affected specs: visual-theme, layout-animations
- Affected code: index.html (CDN script), static/css/style.css (typography, hover states), static/js/main.js (Lenis init, parallax)
- Sin breaking changes — todo es enhancement incremental
