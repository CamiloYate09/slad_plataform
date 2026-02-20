# Proposal: ux-impact-animations

## Summary

Elevar el impacto visual y la experiencia de usuario de la landing page de CityStream mediante 8 mejoras de animación e interacción de alto impacto, inspiradas en las mejores prácticas de sitios como factory.ai. Todas las mejoras son client-side puras (CSS + GSAP), sin dependencias nuevas, y respetan `prefers-reduced-motion`.

## Motivation

La página ya tiene una base sólida: Geist Sans, gradiente de borde, Lenis, GSAP scroll reveals y count-up. El siguiente nivel de impacto requiere:

1. **Orientar al usuario** desde el primer segundo (scroll indicator en hero)
2. **Feedback interactivo inmediato** en elementos CTA (magnetic button)
3. **Sentido de ubicación** mientras navega (active nav section indicator)
4. **Reveals más dramáticos** para headings de sección (clip-path character reveal)
5. **Profundidad en cards** de experiencias (image zoom + overlay reveal en hover)
6. **Progreso visual** del scroll (progress bar en top)
7. **Atmósfera de sección** con partículas/orbes de color en hero
8. **Parallax en experience cards** para sensación de profundidad

## Changes

### 1. Hero Scroll Indicator
- Agregar un indicador "Scroll" animado (flecha/chevron con bounce) en la parte inferior del `.hero`
- Se desvanece automáticamente cuando el usuario hace scroll
- CSS-only animation, no requiere JS

### 2. Magnetic CTA Button
- Aplicar efecto magnético en el botón `.btn-primary` del hero
- Con `mousemove` de GSAP, el botón se desplaza suavemente hacia el cursor cuando este está cerca
- Regresa a posición original cuando el cursor se aleja
- Desktop only (pointer: fine)

### 3. Active Section Nav Indicator
- Resaltar dinámicamente el link activo en la navbar según la sección visible
- Usa ScrollTrigger `toggleClass` para agregar clase `nav-active` al link correspondiente
- Indicador visual: underline naranja animado bajo el link activo

### 4. Clip-Path Heading Reveal
- Reemplazar el fade simple de `.section-header h2` por una animación de reveal con `clipPath`
- Las palabras aparecen desde abajo siendo "descubiertas" por una máscara (mask slide-up)
- Stagger por palabra para efecto más dramático

### 5. Experience Card Hover Overlay
- Al hacer hover en `.exp-card`, la imagen escala suavemente (1.0 → 1.05)
- El contenido de texto (`.exp-content`) se desliza ligeramente hacia arriba
- Una capa de gradiente oscuro aparece sobre la imagen (overlay semitransparente)
- Totalmente CSS con `transition`

### 6. Top Scroll Progress Bar
- Barra delgada (3px) en el top fijo de la página que crece de 0% → 100% según el scroll
- Gradiente naranja/purple/cyan (brand colors)
- Implementada con GSAP ScrollTrigger `scrub`

### 7. Hero Ambient Orbs
- 3 orbes animados de colores (purple, blue, cyan) que flotan sutilmente en el background del hero
- CSS-only `@keyframes` con `transform: translate` y `opacity`
- `filter: blur(80px)` para efecto difuso
- Totalmente decorativos, no interfieren con el contenido

### 8. Experience Cards Parallax
- Aplicar parallax suave (scrub) en las imágenes de `.exp-card` dentro de `.experiences-grid`
- La imagen se mueve más lento que el scroll (`y: -20px`) para sensación de profundidad
- Usa GSAP ScrollTrigger `scrub: true`

## Acceptance Criteria

- [ ] El scroll indicator aparece en el hero y desaparece al hacer scroll
- [ ] El botón CTA del hero responde magnéticamente al cursor en desktop
- [ ] Los links de la navbar se resaltan según la sección visible
- [ ] Los H2 de sección se revelan con clip-path (no simple fade)
- [ ] Las experience cards tienen hover con zoom de imagen + overlay
- [ ] La barra de progreso de scroll es visible y funciona en toda la página
- [ ] Los orbes del hero se animan sutilmente sin distraer del contenido
- [ ] Las imágenes de experience cards tienen parallax al hacer scroll
- [ ] Todas las animaciones se desactivan con `prefers-reduced-motion: reduce`
- [ ] Sin regresiones visuales en mobile (375px, 768px)
- [ ] Sin nuevas dependencias externas

## Out of Scope

- Typewriter/scramble text effect (requeriría librería adicional o implementación compleja)
- Horizontal scroll section (cambio estructural mayor)
- Page loader / splash screen
- Cambios al contenido o copy
