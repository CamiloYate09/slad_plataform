## ADDED Requirements

### Requirement: Hero Particle Grid Animation

El hero section SHALL mostrar una animación de fondo de nodos interactivos usando tsParticles. Los nodos SHALL:
- Incluir partículas naranja (`#f97316`) como accent y partículas neutras para el resto
- Conectarse con líneas tenues cuando están cerca
- Moverse lentamente de forma aleatoria
- Responder al hover del cursor (repulse)
- Respetar `prefers-reduced-motion`
- Reducir cantidad en mobile para no degradar performance

#### Scenario: Animación visible en desktop

- **WHEN** el usuario carga la página en desktop (>768px)
- **THEN** el hero muestra partículas animadas de fondo con nodos y líneas conectoras

#### Scenario: prefers-reduced-motion

- **WHEN** el sistema operativo tiene activada la preferencia de movimiento reducido
- **THEN** las partículas están visibles pero estáticas (sin movimiento)

#### Scenario: Mobile reducido

- **WHEN** el viewport es ≤768px
- **THEN** se muestran máximo 20 partículas para preservar rendimiento
