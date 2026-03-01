## ADDED Requirements

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
