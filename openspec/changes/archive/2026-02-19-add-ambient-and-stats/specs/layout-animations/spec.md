## ADDED Requirements

### Requirement: Animated Statistics Counter
La sección de estadísticas SHALL usar animación count-up (GSAP) para revelar los números métricamente cuando entran al viewport, siguiendo el patrón de factory.ai de mostrar social proof de forma dinámica.

#### Scenario: Count-up al entrar al viewport
- **WHEN** el usuario hace scroll hasta la sección `.stats`
- **THEN** cada `.stat-number` anima desde 0 hasta su valor final (`data-target`)
- **AND** la duración de la animación es de 2 segundos con `ease: power2.out`
- **AND** el disparo es `once: true` (no se repite al hacer scroll de vuelta)
- **AND** los números se formatean: ≥1000 usa sufijo "K" (50000 → "50K+")

#### Scenario: Fallback sin animación
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** los números aparecen directamente en su valor final sin transición numérica
- **AND** no hay ningún GSAP tween iniciado para la sección stats
