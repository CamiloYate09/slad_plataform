## ADDED Requirements

### Requirement: Botones Magnéticos
Los CTAs primarios (`.btn-primary`, `.cta-btn`) SHALL responder al puntero en desktop
desplazándose sutilmente hacia el cursor (efecto magnético), reforzando el feedback
directo sin librerías. El efecto MUST respetar capacidades de entrada y
`prefers-reduced-motion`.

#### Scenario: Cursor se acerca a un CTA en desktop
- **WHEN** el puntero se mueve dentro de un CTA primario en un dispositivo `(hover: hover) and (pointer: fine)`
- **THEN** el botón se traslada hacia el cursor con un máximo de ±8px usando `transform`
- **AND** al salir el puntero (`pointerleave`) el botón vuelve a su posición neutral con transición suave

#### Scenario: Touch o movimiento reducido
- **WHEN** el dispositivo es táctil o el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** el efecto magnético está desactivado y el botón permanece estático

### Requirement: Reveal de Media Ligado a Scroll
Las imágenes clave (`.features-item-image`, `.value-prop-image`) SHALL revelar con una
animación de `opacity`/`scale` ligada a su posición en el viewport usando scroll-driven
animations nativas de CSS, sin sumar trabajo al main thread.

#### Scenario: Imagen entra al viewport
- **WHEN** una imagen clave entra al viewport durante el scroll en un navegador con soporte de `animation-timeline: view()`
- **THEN** la imagen anima `opacity` y `scale` en función de `animation-range` (de entrada a posición de reposo)

#### Scenario: Sin soporte o movimiento reducido
- **WHEN** el navegador no soporta `animation-timeline` o el usuario tiene `prefers-reduced-motion: reduce`
- **THEN** la imagen se muestra en su estado final estático sin animación
