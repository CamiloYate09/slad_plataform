# layout-animations Specification

## Purpose
TBD - created by archiving change redesign-factory-style. Update Purpose after archive.
## Requirements
### Requirement: Generous Spacing and 12-Column Grid
El layout MUST usar un sistema de grid de 12 columnas con CSS Grid nativo, max-width de 1440px, y padding lateral generoso.

#### Scenario: Contenedor principal con spacing factory.ai
- **WHEN** la página renderiza en desktop (>1024px)
- **THEN** el contenedor principal tiene `max-width: 1440px` con `margin: 0 auto`
- **AND** el padding lateral es `2.25rem` (36px) en desktop, `1rem` en mobile
- **AND** las secciones tienen `padding-block` de al menos `6rem` (96px) en desktop

#### Scenario: Grid de features en 12 columnas
- **WHEN** la sección features renderiza en desktop
- **THEN** las 4 cards se distribuyen en columnas del grid de 12 (3 cols cada una)
- **AND** el gap entre cards es `1.5rem`

### Requirement: Smooth Scroll Reveal Animations
Las animaciones de scroll MUST ser suaves, con fade-in + translateY, escalonadas entre elementos hermanos, usando IntersectionObserver nativo.

#### Scenario: Elementos aparecen al scroll con stagger
- **WHEN** un grupo de cards entra en el viewport (threshold 0.1)
- **THEN** cada card se anima con fade-in (opacity 0→1) y slide-up (translateY 40px→0)
- **AND** el delay entre cards hermanas es de 100ms (stagger)
- **AND** la duración de la animación es 600ms con easing `cubic-bezier(0.16, 1, 0.3, 1)`

#### Scenario: Animación respeta prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** todas las animaciones y transiciones se reducen a `0.01ms`

### Requirement: Link Hover Underline Reveal
Los links de navegación SHALL tener un efecto de subrayado que se revela de izquierda a derecha al hover.

#### Scenario: Nav link hover underline
- **WHEN** el usuario hace hover sobre un link en el navbar
- **THEN** aparece un underline que crece de `width: 0` a `width: 100%` con `transition: 300ms`
- **AND** el underline usa el color `--accent-cyan`
- **AND** al salir del hover, el underline se retrae

### Requirement: Card Hover Effects
Las cards MUST tener un hover sutil que eleva y agrega sombra, sin el movimiento exagerado actual de `-1rem`.

#### Scenario: Feature card hover refinado
- **WHEN** el usuario hace hover sobre una feature-card
- **THEN** la card se eleva `translateY(-4px)` (sutil, no -1rem)
- **AND** aparece un `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)` (sombra profunda sobre negro)
- **AND** el borde cambia a `rgba(255, 255, 255, 0.15)` (se aclara sutilmente)
- **AND** la línea gradient top (::before) se revela con `scaleX(0→1)`

