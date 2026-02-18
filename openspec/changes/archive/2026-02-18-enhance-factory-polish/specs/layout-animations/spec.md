## ADDED Requirements

### Requirement: Lenis Smooth Scroll
El sitio SHALL integrar la libreria Lenis para smooth scrolling tipo butter, conectada con GSAP ScrollTrigger para mantener sincronizacion de animaciones.

#### Scenario: Smooth scroll activo
- **WHEN** el usuario scrollea la pagina
- **THEN** el scroll se interpola suavemente con Lenis (lerp: 0.1, duration: 1.2)
- **AND** ScrollTrigger se actualiza en cada frame via `lenis.on('scroll', ScrollTrigger.update)`
- **AND** el requestAnimationFrame de GSAP sincroniza Lenis con `gsap.ticker.add()`

#### Scenario: Lenis respeta prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** Lenis NO se inicializa
- **AND** el scroll nativo del navegador se mantiene

### Requirement: Subtle Parallax Effects
El sitio SHALL incluir efectos de parallax sutiles en el hero y la seccion value-prop para agregar profundidad visual sin distraer.

#### Scenario: Parallax en hero
- **WHEN** el usuario scrollea pasando el hero
- **THEN** el hero-logo se mueve a velocidad 0.8x respecto al scroll (ligeramente mas lento)
- **AND** el efecto es controlado por GSAP ScrollTrigger con scrub: true

#### Scenario: Parallax en value-prop image
- **WHEN** el usuario scrollea pasando la seccion value-prop
- **THEN** la imagen se mueve a velocidad 1.1x (ligeramente mas rapido que el contenido)
- **AND** el efecto es sutil (max 30px de desplazamiento)

#### Scenario: Parallax respeta prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** no hay efecto parallax — los elementos se posicionan estaticamente

## MODIFIED Requirements

### Requirement: Card Hover Effects
Las cards MUST tener un hover refinado que eleva, agrega sombra con glow de color accent, y el borde se aclara al hover. Los botones primarios MUST tener scale sutil y gradient shift al hover.

#### Scenario: Feature card hover con glow
- **WHEN** el usuario hace hover sobre una exp-card
- **THEN** la card se eleva `translateY(-4px)`
- **AND** aparece un `box-shadow` con glow sutil del color accent (`0 8px 32px rgba(91, 66, 243, 0.15)`)
- **AND** el borde cambia a `rgba(255, 255, 255, 0.15)` (se aclara sutilmente)
- **AND** la imagen interna hace zoom sutil `scale(1.05)` con transicion 0.5s

#### Scenario: Boton primario hover mejorado
- **WHEN** el usuario hace hover sobre btn-primary
- **THEN** el boton se eleva `translateY(-2px)` y escala `scale(1.02)`
- **AND** el background-position del gradiente se desplaza a `100% 0`
- **AND** aparece box-shadow con glow de brand color
