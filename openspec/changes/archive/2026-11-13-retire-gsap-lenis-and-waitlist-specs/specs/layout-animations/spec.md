## ADDED Requirements

### Requirement: Espaciado y Ancho de la Página
El `html` MUST tener `max-width: 1920px` centrado. Las secciones MUST usar `padding: var(--section-gap) var(--px-desktop)`, con `--section-gap: 5rem` y `--px-desktop: 2.25rem` (36px).

#### Scenario: Escritorio
- **WHEN** el viewport mide más de 768px
- **THEN** las secciones tienen 5rem de padding vertical y 36px de padding lateral

#### Scenario: Pantallas muy anchas
- **WHEN** el viewport mide 1920px o más
- **THEN** `--px-desktop` pasa a 3rem (48px) y la página no crece más de 1920px

#### Scenario: Móvil
- **WHEN** el viewport mide 768px o menos
- **THEN** `--section-gap` pasa a 3.5rem y el padding lateral usa `--px-mobile` (16px)

### Requirement: Revelado al Hacer Scroll
Los bloques que aparecen al hacer scroll SHALL marcarse desde `main.js` con `[data-scroll-reveal]` y un `IntersectionObserver`, sin librerías, y SHALL animarse con transiciones CSS de `opacity` y `translate`. La entrada del hero SHALL ser CSS puro.

#### Scenario: Bloque entra en pantalla
- **WHEN** el borde superior de un bloque marcado alcanza el 85% de la altura del viewport
- **THEN** recibe `.is-revealed` y pasa de `opacity: 0` y 40px más abajo a su posición, en 0,8 s con `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **AND** en los grupos de tarjetas cada una se retrasa respecto a la anterior (0,15 s en números y experiencias, 0,1 s en eventos, 0,08 s en el bento)

#### Scenario: Bloque ya superado
- **WHEN** la página se abre en un ancla o el navegador restaura el scroll más abajo
- **THEN** los bloques que quedan por encima del viewport se muestran sin esperar a cruzarlo

#### Scenario: Entrada del hero
- **WHEN** la página carga
- **THEN** el título sube y aparece en 0,6 s tras 0,1 s, y la captura de correo en 0,4 s tras 0,5 s

#### Scenario: Sin JavaScript o con movimiento reducido
- **WHEN** JavaScript no se ejecuta o el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** ningún bloque se marca y todo el contenido se ve completo y quieto

### Requirement: Parallax de Fotos de Ciudad
Las fotos de las tarjetas de experiencias (`.exp-card .exp-image img`) SHALL desplazarse levemente dentro de su tarjeta según su posición en el viewport, con scroll-driven animations de CSS (`animation-timeline: view()`) sobre la propiedad `translate`.

#### Scenario: Foto atraviesa el viewport
- **WHEN** una tarjeta de experiencia cruza el viewport en un navegador con soporte de `animation-timeline`
- **THEN** su foto pasa de `translate: 0 12px` a `translate: 0 -12px`

#### Scenario: Sin soporte o movimiento reducido
- **WHEN** el navegador no soporta `animation-timeline` o el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** la foto queda quieta

## REMOVED Requirements

### Requirement: Generous Spacing and 12-Column Grid

**Reason**: Las secciones no usan una retícula de 12 columnas y Funcionalidades ya no son cuatro cards en `span 3`.

**Migration**: Ver "Espaciado y Ancho de la Página" y, para Funcionalidades, `features-bento`.

### Requirement: Smooth Scroll Reveal Animations

**Reason**: El sitio ya no usa GSAP ni ScrollTrigger.

**Migration**: Ver "Revelado al Hacer Scroll".

### Requirement: Lenis Smooth Scroll

**Reason**: Lenis se retiró junto con GSAP; el scroll es el nativo del navegador.

**Migration**: Ninguna.

### Requirement: Subtle Parallax Effects

**Reason**: El hero ya no tiene logo con parallax y la imagen de la propuesta de valor se revela (ver "Reveal de Media Ligado a Scroll" en `animations`); no hay GSAP.

**Migration**: Ver "Parallax de Fotos de Ciudad".
