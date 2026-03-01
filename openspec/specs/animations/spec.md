# animations Specification

## Purpose
TBD - created by archiving change enhance-animation-impact. Update Purpose after archive.
## Requirements
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

### Requirement: Variable Font Weight Bloom
El hero title SHALL animar el font-weight de los caracteres individuales desde 100 (ultralight) hasta 700 (bold) sincronizado con la entrada stagger de chars, creando un efecto "bloom" tipográfico.

#### Scenario: Carga inicial de hero
- **WHEN** la página carga y la hero timeline inicia
- **THEN** los chars del hero title revelan con font-weight progresivo de 100 a 700

### Requirement: Glassmorphism Navbar on Scroll
El navbar en estado `.scrolled` SHALL usar `backdrop-filter: blur(20px) saturate(180%)` con fondo semitransparente y noise texture para un efecto glassmorphism premium.

#### Scenario: Usuario scrollea más de 50px
- **WHEN** el scroll supera 50px
- **THEN** el navbar muestra glassmorphism con blur y borde inferior sutil

#### Scenario: Usuario vuelve al top
- **WHEN** el scroll vuelve a 0
- **THEN** el navbar vuelve a transparente sin backdrop-filter

### Requirement: Animated Gradient Text via @property
Los elementos `.gradient-text` SHALL tener el ángulo del gradiente animándose continuamente mediante `@property --gradient-angle` para dar la sensación de gradient "fluido".

#### Scenario: Heading gradient-text visible
- **WHEN** un elemento con clase `.gradient-text` está en el DOM
- **THEN** el gradiente rota sutilmente en un ciclo continuo de 8s

### Requirement: View Transition on Theme Toggle
El cambio de tema dark/light SHALL usar `document.startViewTransition()` para una transición de clip circular que se expande desde el botón del tema, con degradación elegante si el API no está disponible.

#### Scenario: Usuario activa View Transitions API disponible
- **WHEN** el usuario hace click en theme-toggle y `startViewTransition` existe
- **THEN** el tema cambia con un clip-path circle expand animado desde el botón

#### Scenario: View Transitions API no disponible
- **WHEN** el usuario hace click en theme-toggle y `startViewTransition` no existe
- **THEN** el tema cambia instantáneamente (comportamiento previo)

### Requirement: Button Active Press Feedback
Todos los botones primarios SHALL responder al `:active` con `scale(0.96)` en 100ms para simular feedback táctil de presión.

#### Scenario: Usuario hace click en botón primario
- **WHEN** el usuario presiona un botón `.btn-primary`, `.btn-primary-sm`, `.btn-outline-sm` o `.cta-btn`
- **THEN** el botón escala a 0.96 en 100ms y regresa en 250ms al soltar

### Requirement: CSS Containment on Heavy Sections
Las secciones con animaciones complejas SHALL usar `contain: layout style paint` para aislar su renderizado y mejorar el scroll performance.

#### Scenario: Render de secciones animadas
- **WHEN** el navegador renderiza `.features`, `.experiences`, `.numbered-features`, `.cta-section`, `.news`
- **THEN** los cambios internos no provocan recalculations en el resto del DOM

