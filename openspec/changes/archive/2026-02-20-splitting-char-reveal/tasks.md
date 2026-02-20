# Tasks: splitting-char-reveal

## 1. Dependencias — Agregar Splitting.js

- [x] 1.1 Agregar `<script src="https://unpkg.com/splitting/dist/splitting.min.js"></script>` en `index.html`, justo antes del bloque de scripts GSAP al final del `<body>`
- [x] 1.2 Agregar `data-splitting` al elemento `.hero-title` en `index.html`
- [x] 1.3 Agregar `data-splitting` a todos los `.section-header h2:not(.gradient-text)` en `index.html` (2 elementos: "Construido diferente" y "Lo ultimo de CityStream")

## 2. JS — Inicialización de Splitting.js

- [x] 2.1 Al inicio de `main.js`, después de `gsap.registerPlugin(ScrollTrigger)`, llamar `if (typeof Splitting !== 'undefined') Splitting({ target: '[data-splitting]' });`
- [x] 2.2 Guard: si Splitting no está disponible (CDN fallo), los elementos muestran texto estático sin crash

## 3. JS — Reemplazar hero title animation (char-level)

- [x] 3.1 Eliminar el bloque manual de split-word (líneas ~101-108 en main.js: `const heroTitle = ...`)
- [x] 3.2 Actualizar el hero timeline para animar `.hero-title .char` en lugar de `.split-word`
- [x] 3.3 Config: `fromTo({ opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power3.out' })`
- [x] 3.4 Mantener fallback para `prefersReducedMotion`: animar `.hero-title` como bloque si Splitting no corrió

## 4. JS — Reemplazar section heading animation (char-level)

- [x] 4.1 Eliminar el bloque manual de heading-reveal-word (líneas ~509-528 en main.js)
- [x] 4.2 En su lugar, usar `gsap.utils.toArray('.section-header h2[data-splitting]')` y animar `.char` dentro de cada uno
- [x] 4.3 Config por heading: `from({ yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.025, ease: 'power3.out' })` + ScrollTrigger `start: 'top 88%', once: true`
- [x] 4.4 Guard: `!prefersReducedMotion`

## 5. JS — Text Scramble en hero subtitle

- [x] 5.1 Implementar función `scrambleText(el, finalText, { duration, chars })` que usa `requestAnimationFrame`
- [x] 5.2 Pool de chars: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()`
- [x] 5.3 Algoritmo: revelar un carácter cada N frames (izquierda a derecha); los caracteres no resueltos muestran un char aleatorio del pool que cambia cada frame
- [x] 5.4 Duración total: ~1.2s; comenzar en el hero timeline después de la animación del subtitle fade (delay 0.1s después del inicio del subtitle)
- [x] 5.5 Guard: si `prefersReducedMotion`, mostrar `el.textContent = finalText` directamente sin scramble

## 6. CSS — Ajustes de compatibilidad

- [x] 6.1 Verificar que `.gradient-text .char` tiene `display: inline-block` (Splitting.js lo hace automáticamente; confirmar que el CSS no lo anula)
- [x] 6.2 El `background-clip: text` en `.gradient-text` aplica al contenedor padre — confirmar visualmente que los chars muestran el gradiente (workaround: inline style via JS por bug de compositing con GSAP)
- [x] 6.3 Marcar `.split-word` y `.heading-reveal-word` como legacy con comentario `/* @legacy: replaced by splitting-char-reveal */`; no eliminar aún hasta confirmar QA

## 7. QA

- [x] 7.1 Desktop dark mode: hero title anima letra por letra con gradiente visible ✓
- [x] 7.2 Desktop dark mode: hero subtitle muestra scramble antes del texto final ✓
- [x] 7.3 Desktop dark mode: section headings "Construido diferente" y "Lo ultimo de CityStream" revelan letra por letra ✓
- [x] 7.4 Light mode: mismos efectos, colores de gradiente correctos ✓
- [x] 7.5 Mobile 375px: animaciones activas, sin layout shift por scramble ✓
- [x] 7.6 `prefers-reduced-motion`: texto aparece estático, sin animación, sin scramble ✓ (guards en JS verificados)
- [x] 7.7 Sin errores de consola JS ✓
- [x] 7.8 Splitting.js CDN load time < 100ms (96ms verificado en Network tab) ✓
