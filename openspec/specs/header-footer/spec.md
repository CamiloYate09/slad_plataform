# header-footer Specification

## Purpose
TBD - created by archiving change redesign-factory-style. Update Purpose after archive.
## Requirements
### Requirement: Transparent-to-Solid Navbar
El navbar MUST iniciar transparente (sin fondo) sobre la sección hero y transicionar a un fondo negro sólido con blur al hacer scroll.

#### Scenario: Navbar transparente en top
- **WHEN** el scroll está en la posición 0 (top de la página)
- **THEN** el navbar tiene `background: transparent` y `border-bottom: none`
- **AND** el logo y los links son visibles en blanco sobre el hero

#### Scenario: Navbar se solidifica al scroll
- **WHEN** el usuario scrollea más de 50px
- **THEN** el navbar transiciona a `background: rgba(10, 10, 10, 0.85)` con `backdrop-filter: blur(16px)`
- **AND** aparece un `border-bottom: 1px solid rgba(255, 255, 255, 0.08)`
- **AND** la transición dura 300ms

#### Scenario: Navbar links con underline-reveal
- **WHEN** el usuario hace hover sobre un link del nav (excepto logo)
- **THEN** un pseudo-elemento `::after` crece de `width: 0%` a `width: 100%` debajo del texto
- **AND** el color del underline es `--accent-cyan`
- **AND** la transición es `all 300ms ease`

### Requirement: Card-Style Rounded Footer
El footer MUST renderizarse como una card con bordes redondeados, separada visualmente del body, con layout multi-columna y fondo secundario oscuro.

#### Scenario: Footer como card flotante en desktop
- **WHEN** la página renderiza en desktop
- **THEN** el footer tiene `border-radius: 24px` (top y bottom)
- **AND** tiene márgenes laterales (`margin-inline: 1.5rem`) para crear efecto de card separada
- **AND** el fondo es `#111111` (gris muy oscuro, diferenciado del negro base)
- **AND** tiene `min-height: 400px` para presencia generosa
- **AND** tiene un `margin-bottom: 1.5rem` para no tocar el borde inferior

#### Scenario: Footer en mobile
- **WHEN** la página renderiza en mobile (<768px)
- **THEN** el footer tiene `border-radius: 16px`
- **AND** los márgenes laterales se reducen a `0.5rem`
- **AND** el grid de columnas colapsa a 1 columna

#### Scenario: Footer links con hover sutil
- **WHEN** el usuario hace hover sobre un link del footer
- **THEN** el color cambia a `--accent-cyan` con transición de `200ms`

### Requirement: Social Icons Refined Style
Los iconos sociales del footer MUST tener un estilo más refinado acorde a la estética negra.

#### Scenario: Social icons sobre fondo negro
- **WHEN** los iconos sociales se renderizan
- **THEN** cada icono tiene fondo `rgba(255, 255, 255, 0.06)` (casi invisible)
- **AND** borde `1px solid rgba(255, 255, 255, 0.1)`
- **AND** al hover, el fondo cambia a `rgba(255, 255, 255, 0.12)` y se eleva `translateY(-2px)`

