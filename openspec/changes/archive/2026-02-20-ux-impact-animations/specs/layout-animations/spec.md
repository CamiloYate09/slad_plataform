# Spec Delta: layout-animations — ux-impact-animations

## Capability: scroll-driven-animations

### MODIFIED: hero-entrance
**Before:** Fade + Y-offset para logo, título, subtítulo, CTA
**After:** Igual + scroll indicator visible en hero que desaparece al hacer scroll

### ADDED: ambient-orbs
El hero incluye 3 orbes decorativos de fondo (purple, blue, cyan) animados con CSS `@keyframes`. No interfieren con la interactividad. Se desactivan con `prefers-reduced-motion`.

### ADDED: top-progress-bar
Una barra delgada (3px) fija en el top del viewport que crece de 0 a 100% según el progreso de scroll de la página. Gradiente con colores brand (naranja, purple, cyan). Animada con GSAP ScrollTrigger scrub.

### ADDED: magnetic-cta
El botón `.btn-primary` dentro de `.hero-actions` responde magnéticamente al cursor en dispositivos desktop (`pointer: fine`). Rango de desplazamiento: máximo ±20px. Retorna con `elastic.out` ease.

### ADDED: active-nav-indicator
Los links de navegación en `.nav-links` reciben clase `nav-active` cuando su sección destino es la activa según el viewport. Implementado con GSAP ScrollTrigger `toggleClass`. Solo un link activo a la vez.

### MODIFIED: section-header-reveal
**Before:** `.section-header` anima como bloque con `opacity: 0, y: 40`
**After:** Los `h2` dentro de `.section-header` (excepto los `.gradient-text`) aplican clip-path reveal por palabras. Los elementos `.gradient-text` mantienen su animación existente (split-word). El párrafo descriptivo continúa con fade simple.

### ADDED: experience-parallax
Las imágenes dentro de `.exp-card .exp-image img` tienen parallax suave (`y: -20px, scrub: true`) sincronizado con el scroll. El contenedor `.exp-image` mantiene `overflow: hidden`.

## Capability: hover-interactions

### MODIFIED: experience-card-hover
**Before:** Sin hover state definido
**After:**
- `.exp-card:hover .exp-image img`: `transform: scale(1.05)`, `transition: 0.6s ease-out`
- `.exp-image::after` (overlay): aparece con `opacity: 0.3` al hover (gradiente oscuro de abajo hacia arriba)
- `.exp-card:hover .exp-content`: `transform: translateY(-4px)`, `transition: 0.3s ease-out`
