## ADDED Requirements

### Requirement: CTA Card Premium Glow Pulse
El `.cta-card` SHALL usar `var(--shadow-glow)` como sombra base continua (siempre visible, no solo en hover) para aumentar el peso visual del bloque de conversión. La intensidad del glow pulsa suavemente vía `@keyframes` para llamar la atención de forma orgánica.

#### Scenario: CTA card en viewport
- **WHEN** el `.cta-card` está visible en el viewport
- **THEN** el elemento tiene `box-shadow: var(--shadow-glow)` como sombra base
- **AND** la animación `glowPulse` cicla la intensidad del glow entre 0.25 y 0.45 de opacidad cada 4s
- **AND** la animación es `infinite alternate ease-in-out` (no loop brusco)

#### Scenario: prefers-reduced-motion activo
- **WHEN** `prefers-reduced-motion: reduce` está activo
- **THEN** la animación `glowPulse` está pausada (`animation-play-state: paused`)
- **AND** el shadow estático permanece con la opacidad media del ciclo

### Requirement: Experience Card Premium Shadow on Hover
Las `.exp-card` SHALL usar `var(--shadow-premium)` al hacer hover para añadir la sombra larga con tinte de marca, complementando el `translateY(-4px)` existente y el 3D-tilt de JavaScript.

#### Scenario: Hover sobre exp-card en desktop
- **WHEN** el cursor entra en una `.exp-card` en un dispositivo con `pointer: fine`
- **THEN** `box-shadow` transiciona a `var(--shadow-premium)` en `300ms ease`
- **AND** el 3D-tilt de JS sigue activo sin conflicto (la shadow es propiedad independiente)

#### Scenario: Cursor sale de exp-card
- **WHEN** el cursor sale de la `.exp-card`
- **THEN** `box-shadow` regresa al valor base en `300ms ease`
