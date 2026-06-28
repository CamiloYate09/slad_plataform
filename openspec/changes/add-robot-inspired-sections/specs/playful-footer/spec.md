## ADDED Requirements

### Requirement: Acento Animado en Footer
El footer SHALL incluir un acento animado sutil junto al `footer-badge` que refuerce el tono lúdico de la marca, implementado solo con CSS y sin penalizar el rendimiento.

#### Scenario: Usuario ve el footer
- **WHEN** el usuario llega al footer
- **THEN** un motivo animado sutil (`@keyframes` CSS) acompaña al `footer-badge`
- **AND** la animación no usa JavaScript ni assets GIF pesados
- **AND** no introduce layout shift (CLS) en el footer

#### Scenario: Usuario con movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** la animación del acento del footer se desactiva y el elemento permanece estático
