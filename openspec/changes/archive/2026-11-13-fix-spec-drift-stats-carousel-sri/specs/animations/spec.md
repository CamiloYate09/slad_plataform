## MODIFIED Requirements

### Requirement: Stats Section Entrance Animation
Las cifras de `.stats-band` (`.stat-number` con `data-count`) SHALL contar desde 0 hasta su valor final cuando entran en pantalla. Las tarjetas (`.stat-card`) no tienen animación de entrada propia. El HTML SHALL contener ya la cifra final, para que se lea sin JavaScript.

#### Scenario: Stats entran al viewport
- **WHEN** el borde superior de una `.stat-number` alcanza el 90% de la altura del viewport
- **THEN** cuenta de 0 a `data-count` en 1,6 s con easing de salida y añade `data-suffix` (por ejemplo "%")
- **AND** el número usa el formato `es-CO`

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** la cifra se muestra con su valor final, sin contar
