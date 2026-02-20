# Tasks: ux-impact-animations

## 1. CSS — Hero Ambient Orbs

- [x] 1.1 Agregar 3 `<div class="hero-orb hero-orb--{1,2,3}">` dentro de `.hero` en index.html
- [x] 1.2 Agregar estilos CSS para `.hero-orb`: posición absoluta, border-radius: 50%, filter blur, pointer-events none
- [x] 1.3 Definir `@keyframes floatOrb{1,2,3}` con translate X/Y suaves
- [x] 1.4 Aplicar `prefers-reduced-motion` para desactivar animación de orbes

## 2. CSS — Hero Scroll Indicator

- [x] 2.1 Agregar `<div class="scroll-indicator">` al final de `.hero-content` en index.html
- [x] 2.2 Agregar estilos CSS para `.scroll-indicator`: texto "Scroll" + ícono chevron animado
- [x] 2.3 Definir `@keyframes bounceScroll` para el chevron
- [x] 2.4 Agregar clase `.scroll-indicator.hidden` que se aplica vía JS al hacer scroll > 80px del hero

## 3. CSS — Top Scroll Progress Bar

- [x] 3.1 Agregar `<div id="top-progress">` como primer hijo de `<body>` en index.html
- [x] 3.2 Agregar estilos: `position: fixed; top: 0; left: 0; width: 0%; height: 3px; z-index: 9999; background: linear-gradient(...)` con colores brand

## 4. CSS — Active Nav Link Indicator

- [x] 4.1 Agregar estilos para `.nav-links a.nav-active`: color naranja + underline animado
- [x] 4.2 Los estilos de `::after` ya existen; solo se activan con la clase `nav-active`

## 5. CSS — Experience Card Hover Overlay

- [x] 5.1 El hover de imagen ya existía (`.exp-card:hover .exp-image img { transform: scale(1.05) }`)
- [x] 5.2 El overlay `::after` ya existía con gradiente en `.exp-image`
- [x] 5.3 `overflow: hidden` confirmado en `.exp-image` ✓
- [x] 5.4 Agregado `transform: translateY(-4px)` en `.exp-card:hover .exp-content` con `transition`

## 6. CSS — Clip-Path Heading Reveal (estilos)

- [x] 6.1 Agregar clase `.heading-reveal-word { display: inline-block; overflow: hidden; vertical-align: bottom }`
- [x] 6.2 El JS maneja la animación `yPercent: 110 → 0`

## 7. JS — Top Scroll Progress Bar (GSAP)

- [x] 7.1 `gsap.to('#top-progress', { scrollTrigger: { scrub: 0.3, start: 'top top', end: 'bottom bottom' }, width: '100%' })`

## 8. JS — Hero Scroll Indicator (hide on scroll)

- [x] 8.1 ScrollTrigger que agrega `.scroll-indicator.hidden` al hacer scroll fuera del 20% inicial del hero

## 9. JS — Magnetic CTA Button

- [x] 9.1 Seleccionar `.hero-actions .btn-primary`
- [x] 9.2 `mousemove`: calcular offset al centro y aplicar `gsap.to(btn, { x, y, duration: 0.3 })`
- [x] 9.3 `mouseleave`: `gsap.to(btn, { x: 0, y: 0, ease: 'elastic.out(1, 0.4)' })`
- [x] 9.4 Solo en `pointer: fine` (desktop)

## 10. JS — Active Nav Section Indicator

- [x] 10.1 ScrollTrigger para #inicio, #features, #experiencias, #contacto
- [x] 10.2 `onEnter` / `onEnterBack`: clase `nav-active` al link correspondiente
- [x] 10.3 `onLeave` / `onLeaveBack`: remueve la clase

## 11. JS — Clip-Path Heading Reveal

- [x] 11.1 Seleccionar `.section-header h2:not(.gradient-text)`
- [x] 11.2 Split por palabras, wrappear en `.heading-reveal-word > span`
- [x] 11.3 `yPercent: 110 → 0` con stagger 0.07s por ScrollTrigger
- [x] 11.4 Guard: `!prefersReducedMotion`

## 12. JS — Experience Cards Parallax

- [x] 12.1 `gsap.utils.toArray('.exp-card .exp-image img')` con ScrollTrigger scrub
- [x] 12.2 `fromTo({ y: 12 }, { y: -12 })` — el contenedor `overflow:hidden` corta el exceso
- [x] 12.3 Image height fijada a 260px con margin-top -30px para centrado y buffer suficiente
- [x] 12.4 Guard: `!prefersReducedMotion`

## 13. QA

- [x] 13.1 Verificado desktop 1512px en Chrome: todos los efectos funcionan, 0 errores de consola
- [x] 13.2 Light mode y dark mode verificados visualmente
- [x] 13.3 Top progress bar funciona (cresce con el scroll)
- [x] 13.4 Nav active link resalta en naranja al hacer scroll por secciones
- [x] 13.5 Ambient orbs visibles en ambos temas
- [x] 13.6 Scroll indicator visible en hero, desaparece al bajar
