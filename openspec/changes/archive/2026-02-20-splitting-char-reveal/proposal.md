# Proposal: splitting-char-reveal

## Summary

Elevar las animaciones de texto de nivel "palabra" a nivel "carácter" usando **Splitting.js** (gratis, CDN, ~3KB gzip), replicando el efecto de reveal letra por letra que caracteriza a sitios como factory.ai. Adicionalmente, agregar un **text scramble** en el subtítulo del hero: las letras "glitchean" con caracteres aleatorios antes de revelar el texto real — sin plugins de pago.

## Motivation

El change `ux-impact-animations` ya implementó reveals por palabra. El salto a nivel carácter es lo que visualmente separa una landing page profesional de una de nivel top-tier. Splitting.js proporciona esta capacidad de forma gratuita, ligera y compatible con GSAP. El text scramble del hero subtitle es el efecto más icónico de sitios como factory.ai: genera tensión visual y atención inmediata.

## Current State

| Elemento | Animación actual |
|----------|-----------------|
| `.hero-title.gradient-text` | Split manual por palabras (`split-word` spans), fade + y por palabra |
| `.section-header h2:not(.gradient-text)` | Split manual por palabras (`heading-reveal-word`), `yPercent: 110→0` por palabra |
| `.hero-subtitle` | Fade simple `opacity: 0→1, y: 20→0` en hero timeline |

## Changes

### 1. Añadir Splitting.js via CDN
Agregar `<script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>` en `index.html`, antes de los scripts de GSAP. Splitting.js expone el objeto global `Splitting` y no tiene dependencias.

### 2. Reemplazar split de hero title por char-level (Splitting.js)
- Eliminar el bloque JS manual que crea `.split-word` spans en el hero title
- Agregar atributo `data-splitting` al `.hero-title`
- Llamar `Splitting()` para que genere `.word > .char` automáticamente
- Actualizar GSAP para animar `.hero-title .char` con stagger de `0.03s` (vs 0.08s actual por palabra)
- La clase `.gradient-text` con `background-clip: text` sigue funcionando porque los `.char` son `display: inline-block` dentro del elemento padre que tiene el gradiente

### 3. Reemplazar split de section headings por char-level (Splitting.js)
- Los `h2:not(.gradient-text)` en `.section-header` actualmente usan el sistema manual `heading-reveal-word`
- Reemplazar con `data-splitting` + `Splitting()` y animar `.char` con `yPercent: 110→0`, stagger `0.025s`
- El efecto es más fluido y con más "peso" visual al ser letra por letra

### 4. Text Scramble en hero subtitle (custom, sin pago)
- Al cargar la página, el `.hero-subtitle` muestra caracteres aleatorios (ASCII printable, ~10-15 iteraciones por carácter)
- Progresivamente "resuelve" cada carácter de izquierda a derecha hasta mostrar el texto real
- Implementado con `requestAnimationFrame` y un contador de frames por carácter (sin librerías adicionales)
- Duración total: ~1.2s, comenzando después del hero title animation (en la misma timeline)
- Se desactiva completamente con `prefers-reduced-motion`

## Acceptance Criteria

- [ ] Splitting.js cargado via CDN, sin errores de consola
- [ ] `.hero-title` animado letra por letra (visible stagger de chars individuales)
- [ ] La propiedad `gradient-text` (background-clip) sigue aplicándose correctamente sobre los chars
- [ ] `.section-header h2:not(.gradient-text)` revelan letra por letra al hacer scroll
- [ ] `.hero-subtitle` muestra efecto scramble antes de revelar el texto real
- [ ] Scramble se desactiva con `prefers-reduced-motion` (texto aparece directamente)
- [ ] El sistema manual de `split-word` y `heading-reveal-word` es reemplazado completamente (sin código muerto)
- [ ] No hay regresiones en mobile (375px, 768px)
- [ ] Sin nuevas dependencias más allá de Splitting.js CDN

## Out of Scope

- Scramble en section headings (solo en el subtitle del hero por ahora)
- Three.js WebGL backgrounds
- Scramble en otros textos dinámicos de la página
- Splitting.js en el footer o nav links

## Dependencies

- Requiere que `ux-impact-animations` esté implementado (el change actual remplaza su sistema de heading reveal)
