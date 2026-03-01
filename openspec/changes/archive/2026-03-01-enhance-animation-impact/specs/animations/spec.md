## ADDED Requirements

### Requirement: 3D Tilt Card Effect
Las tarjetas .exp-card y .num-card SHALL responder al movimiento del mouse con una rotación 3D sutil (max 8deg) que crea sensación de profundidad y premium UI. Al salir el cursor, el card vuelve a neutral con ease elástico.

#### Scenario: Hover sobre exp-card
- **WHEN** el usuario mueve el cursor sobre una .exp-card en desktop
- **THEN** la tarjeta rota en 3D siguiendo el cursor con máximo 8 grados en X e Y

#### Scenario: Cursor fuera de card
- **WHEN** el cursor sale de la tarjeta
- **THEN** la tarjeta vuelve a rotación 0 con animación elástica suave

### Requirement: Hero Orbs Mouse Parallax
Los ambient orbs del hero SHALL responder al movimiento del mouse desplazándose suavemente en dirección opuesta al cursor, creando una sensación de profundidad espacial.

#### Scenario: Mouse se mueve en el hero
- **WHEN** el usuario mueve el mouse sobre la sección hero en desktop
- **THEN** los orbs se desplazan con un parallax sutil (max ±20px) en dirección opuesta al cursor

### Requirement: Stats Section Entrance Animation
Los .stat-item SHALL tener una animación de entrada staggered al hacer scroll (actualmente solo se anima el contador numérico, no el contenedor).

#### Scenario: Stats entran al viewport
- **WHEN** la sección .stats entra al viewport
- **THEN** los stat-items aparecen con stagger de 0.12s desde abajo con fade-in

### Requirement: Section Label Clip-Path Reveal
Los badges .section-label SHALL aparecer con una animación clip-path slide-in (de izquierda a derecha) al entrar al viewport, más cinematográfica que un simple fade+y.

#### Scenario: Section label entra al viewport
- **WHEN** un .section-label entra al viewport durante el scroll
- **THEN** el badge se revela con clip-path desde izquierda (0% width → 100% width)

### Requirement: Value-Prop Heading Character Reveal
El h2 de .value-prop-content SHALL tener animación de caracteres individuales igual que los demás headings con data-splitting.

#### Scenario: Value-prop h2 entra al viewport
- **WHEN** el h2 de value-prop entra al viewport
- **THEN** los caracteres aparecen en stagger desde abajo (yPercent 110 → 0)

### Requirement: CTA Card Gradient Border Animation
El .cta-card SHALL tener un borde animado de gradiente rotativo (conic-gradient CSS @keyframes) que da sensación de energía y movimiento, reforzando el call-to-action.

#### Scenario: Usuario llega al CTA
- **WHEN** el .cta-card está en viewport
- **THEN** el borde muestra un gradiente animado en rotación continua

### Requirement: CTA Button Glow Pulse
El .cta-btn SHALL tener una animación CSS de pulsación de glow (box-shadow) continua que llama la atención hacia el botón de acción principal.

#### Scenario: CTA en viewport
- **WHEN** el .cta-btn está visible
- **THEN** el botón pulsa con un halo naranja/violeta de forma suave y continua

### Requirement: Card Shine Sweep on Hover
Las .news-card y .num-card SHALL mostrar un efecto de brillo (shine sweep) al hacer hover, simulando una luz deslizándose sobre la superficie de la tarjeta.

#### Scenario: Hover sobre news-card o num-card
- **WHEN** el cursor entra en una .news-card o .num-card
- **THEN** aparece un destello luminoso que recorre la tarjeta de izquierda a derecha
