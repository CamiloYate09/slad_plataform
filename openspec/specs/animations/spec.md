# animations Specification

## Purpose
Animaciones y microinteracciones de la landing: tarjetas, CTA, navbar, cambio de tema, revelados ligados al scroll y su respeto a prefers-reduced-motion.

## Requirements

### Requirement: Hero Orbs Mouse Parallax
Los ambient orbs del hero SHALL responder al movimiento del mouse desplazándose suavemente en dirección opuesta al cursor, creando una sensación de profundidad espacial.

#### Scenario: Mouse se mueve en el hero
- **WHEN** el usuario mueve el mouse sobre la sección hero en desktop
- **THEN** los orbs se desplazan con un parallax sutil (max ±20px) en dirección opuesta al cursor

### Requirement: Stats Section Entrance Animation
Las cifras de `.stats-band` (`.stat-number` con `data-count`) SHALL contar desde 0 hasta su valor final cuando entran en pantalla. Las tarjetas (`.stat-card`) no tienen animación de entrada propia. El HTML SHALL contener ya la cifra final, para que se lea sin JavaScript.

#### Scenario: Stats entran al viewport
- **WHEN** el borde superior de una `.stat-number` alcanza el 90% de la altura del viewport
- **THEN** cuenta de 0 a `data-count` en 1,6 s con easing de salida y añade `data-suffix` (por ejemplo "%")
- **AND** el número usa el formato `es-CO`

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** la cifra se muestra con su valor final, sin contar

### Requirement: Section Label Clip-Path Reveal
Los badges .section-label SHALL aparecer con una animación clip-path slide-in (de izquierda a derecha) al entrar al viewport, más cinematográfica que un simple fade+y.

#### Scenario: Section label entra al viewport
- **WHEN** un .section-label entra al viewport durante el scroll
- **THEN** el badge se revela con clip-path desde izquierda (0% width → 100% width)

### Requirement: CTA Card Gradient Border Animation
El `.cta-card` SHALL tener un brillo de borde animado con `box-shadow` (`@keyframes cta-border-glow`) que alterna morado, azul y cian en un ciclo de 5 s, reforzando el call-to-action.

#### Scenario: Usuario llega al CTA
- **WHEN** el `.cta-card` está en viewport
- **THEN** el borde brilla y pasa de morado a azul y a cian en un ciclo continuo de 5 s

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** el borde no se anima

### Requirement: CTA Button Glow Pulse
El .cta-btn SHALL tener una animación CSS de pulsación de glow (box-shadow) continua que llama la atención hacia el botón de acción principal.

#### Scenario: CTA en viewport
- **WHEN** el .cta-btn está visible
- **THEN** el botón pulsa con un halo naranja/violeta de forma suave y continua

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
Las secciones con animaciones complejas SHALL usar `contain: style paint` para aislar su renderizado y mejorar el scroll performance, sin `layout` para no alterar el posicionamiento de su contenido.

#### Scenario: Render de secciones animadas
- **WHEN** el navegador renderiza `.cta-section` o `.news`
- **THEN** los cambios internos de estilo y pintado no provocan recálculos en el resto del DOM

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

### Requirement: Brillo al Pasar sobre Eventos
Las tarjetas de próximos eventos (`.news-card`) SHALL mostrar un destello que recorre la tarjeta de izquierda a derecha al pasar el cursor.

#### Scenario: Hover sobre una tarjeta de evento
- **WHEN** el cursor entra en una `.news-card`
- **THEN** aparece un destello luminoso que recorre la tarjeta de izquierda a derecha

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** no aparece el destello
