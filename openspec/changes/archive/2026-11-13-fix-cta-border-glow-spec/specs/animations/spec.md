## MODIFIED Requirements

### Requirement: CTA Card Gradient Border Animation
El `.cta-card` SHALL tener un brillo de borde animado con `box-shadow` (`@keyframes cta-border-glow`) que alterna morado, azul y cian en un ciclo de 5 s, reforzando el call-to-action.

#### Scenario: Usuario llega al CTA
- **WHEN** el `.cta-card` está en viewport
- **THEN** el borde brilla y pasa de morado a azul y a cian en un ciclo continuo de 5 s

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** el borde no se anima
