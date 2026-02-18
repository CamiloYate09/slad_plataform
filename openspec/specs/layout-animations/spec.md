# layout-animations Specification

## Purpose
TBD - created by archiving change redesign-factory-style. Update Purpose after archive.
## Requirements
### Requirement: Generous Spacing and 12-Column Grid
El layout MUST usar un sistema de grid CSS de 12 columnas, max-width de 1920px en el html, y padding lateral siguiendo el patrón de factory.ai: `px-4` (16px) en mobile, `px-9` (36px) en desktop.

#### Scenario: Contenedor principal con spacing factory.ai
- **WHEN** la página renderiza en desktop (>1024px)
- **THEN** el html tiene `max-width: 1920px` con `margin: 0 auto`
- **AND** las secciones usan `display: grid; grid-template-columns: repeat(12, 1fr)` con `gap: 1.5rem`
- **AND** el padding lateral es `36px` (`px-9`) en desktop, `16px` (`px-4`) en mobile
- **AND** las secciones principales tienen `margin-block` de al menos `5rem` (80px) entre ellas

#### Scenario: Grid de features en 12 columnas
- **WHEN** la sección features renderiza en desktop
- **THEN** las 4 cards se distribuyen usando `grid-column: span 3` cada una en el grid de 12
- **AND** el gap entre cards es `1.5rem`

### Requirement: Smooth Scroll Reveal Animations
Las animaciones de scroll MUST ser controladas por GSAP + ScrollTrigger, reemplazando el IntersectionObserver actual. Cada sección se revela con animaciones profesionales al entrar en el viewport.

#### Scenario: Secciones se revelan con GSAP ScrollTrigger
- **WHEN** una sección entra en el viewport (trigger: top 80% del viewport)
- **THEN** GSAP anima los elementos con `opacity: 0 → 1` y `y: 40 → 0`
- **AND** la duración es `0.8s` con easing `power2.out`
- **AND** elementos hijos (cards, items) tienen stagger de `0.15s` entre ellos

#### Scenario: Hero entrance animation con timeline
- **WHEN** la página termina de cargar
- **THEN** GSAP ejecuta un timeline: headline fade-in (0.6s) → subtitle fade-in (0.4s) → CTA fade-in (0.4s)
- **AND** cada elemento se anima con `y: 30 → 0` y `opacity: 0 → 1`

#### Scenario: Animaciones respetan prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** GSAP se inicializa con `gsap.config({ nullTargetWarn: false })` y todas las animaciones se desactivan via `ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" })` y `gsap.globalTimeline.timeScale(0)` o equivalente
- **AND** los elementos aparecen en su estado final sin animación

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

### Requirement: Lenis Smooth Scroll
El sitio SHALL integrar la libreria Lenis para smooth scrolling tipo butter, conectada con GSAP ScrollTrigger para mantener sincronizacion de animaciones.

#### Scenario: Smooth scroll activo
- **WHEN** el usuario scrollea la pagina
- **THEN** el scroll se interpola suavemente con Lenis (lerp: 0.1, duration: 1.2)
- **AND** ScrollTrigger se actualiza en cada frame via `lenis.on('scroll', ScrollTrigger.update)`
- **AND** el requestAnimationFrame de GSAP sincroniza Lenis con `gsap.ticker.add()`

#### Scenario: Lenis respeta prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** Lenis NO se inicializa
- **AND** el scroll nativo del navegador se mantiene

### Requirement: Subtle Parallax Effects
El sitio SHALL incluir efectos de parallax sutiles en el hero y la seccion value-prop para agregar profundidad visual sin distraer.

#### Scenario: Parallax en hero
- **WHEN** el usuario scrollea pasando el hero
- **THEN** el hero-logo se mueve a velocidad 0.8x respecto al scroll (ligeramente mas lento)
- **AND** el efecto es controlado por GSAP ScrollTrigger con scrub: true

#### Scenario: Parallax en value-prop image
- **WHEN** el usuario scrollea pasando la seccion value-prop
- **THEN** la imagen se mueve a velocidad 1.1x (ligeramente mas rapido que el contenido)
- **AND** el efecto es sutil (max 30px de desplazamiento)

#### Scenario: Parallax respeta prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** no hay efecto parallax — los elementos se posicionan estaticamente

