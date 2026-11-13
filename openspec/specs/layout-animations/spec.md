# layout-animations Specification

## Purpose
Espaciado, retícula y comportamiento al hacer scroll de la landing: revelados de secciones, hovers de enlaces y tarjetas, y parallax.

## Requirements

### Requirement: Link Hover Underline Reveal
Los links de navegación y footer SHALL tener un efecto de subrayado que se revela de izquierda a derecha al hover, usando color naranja (`--accent-orange-hover: #f97316`) matching factory.ai.

#### Scenario: Link hover underline naranja
- **WHEN** el usuario hace hover sobre un link en el navbar o footer
- **THEN** el texto cambia a `--accent-orange-hover` (#f97316)
- **AND** un pseudo-elemento `::after` crece de `width: 0` a `width: 100%` debajo del texto
- **AND** la transición es `all 300ms ease-in-out`
- **AND** al salir del hover, el underline se retrae

### Requirement: Card Hover Effects
Las cards MUST tener un hover refinado que eleva, agrega sombra con glow de color accent, y el borde se aclara al hover. Los botones primarios MUST tener scale sutil y gradient shift al hover.

#### Scenario: Feature card hover con glow
- **WHEN** el usuario hace hover sobre una exp-card
- **THEN** la card se eleva `translateY(-4px)`
- **AND** aparece un `box-shadow` con glow sutil del color accent (`0 8px 32px rgba(91, 66, 243, 0.15)`)
- **AND** el borde cambia a `rgba(255, 255, 255, 0.15)` (se aclara sutilmente)
- **AND** la imagen interna hace zoom sutil `scale(1.05)` con transicion 0.5s

#### Scenario: Boton primario hover mejorado
- **WHEN** el usuario hace hover sobre btn-primary
- **THEN** el boton se eleva `translateY(-2px)` y escala `scale(1.02)`
- **AND** el background-position del gradiente se desplaza a `100% 0`
- **AND** aparece box-shadow con glow de brand color

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
