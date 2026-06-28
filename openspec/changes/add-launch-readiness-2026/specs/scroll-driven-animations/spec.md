## ADDED Requirements

### Requirement: Feature Detection y Carga Condicional de GSAP ScrollTrigger
El sitio SHALL detectar soporte nativo de `animation-timeline: scroll()` y `view()` antes de cargar el plugin GSAP ScrollTrigger. En navegadores con soporte nativo, ScrollTrigger NO se carga, reduciendo el JS bundle transferido.

#### Scenario: Navegador moderno con soporte nativo
- **WHEN** la pagina carga en Chrome 115+, Firefox 144+, Safari 26+
- **THEN** `CSS.supports('animation-timeline', 'scroll()')` retorna true
- **AND** el script tag de `gsap/ScrollTrigger.min.js` NO es inyectado al DOM
- **AND** las animaciones scroll-driven migradas usan CSS nativo

#### Scenario: Navegador sin soporte
- **WHEN** la pagina carga en Safari 17 o Firefox <144
- **THEN** la deteccion retorna false
- **AND** ScrollTrigger se inyecta dinamicamente como antes
- **AND** las animaciones usan el path GSAP de fallback

### Requirement: Hero Progress Bar con animation-timeline
La barra de progreso del scroll global (`#top-progress`) SHALL animarse usando `animation-timeline: scroll(root block)` en navegadores con soporte, reemplazando el calculo JS-driven actual.

#### Scenario: Usuario hace scroll desde el top
- **WHEN** el usuario scrollea de 0 a 100% del documento
- **THEN** el ancho de `#top-progress` se actualiza linealmente sin intervencion de JS
- **AND** no hay listener `scroll` registrado en JS para esta barra
- **AND** el rendering corre en el compositor (no en el main thread)

### Requirement: Background Texture Parallax CSS Nativo
El elemento `.bg-texture` SHALL hacer parallax via `animation-timeline: scroll()` en navegadores compatibles, eliminando el ScrollTrigger correspondiente.

#### Scenario: Scroll en navegador moderno
- **WHEN** el usuario hace scroll en Chrome 130
- **THEN** `.bg-texture` se desplaza con parallax sin que un listener JS calcule transforms
- **AND** el `transform: translateY()` se interpola via CSS

### Requirement: News Cards Fade-in via view() Timeline
Las `.news-card` SHALL hacer fade-in (opacity 0→1 + translateY) usando `animation-timeline: view()` con `animation-range: entry 0% entry 80%` en navegadores compatibles.

#### Scenario: News card entra al viewport
- **WHEN** una `.news-card` cruza el `entry 0%` del viewport en scroll
- **THEN** comienza a animar opacity y transform
- **AND** al llegar a `entry 80%` esta completamente visible
- **AND** la animacion NO se ejecuta en main thread JS

### Requirement: Numbered Cards Stagger Entrance CSS
Las `.num-card` SHALL entrar al viewport con stagger usando `animation-timeline: view()` y `animation-delay: calc(var(--card-index) * 0.1s)` definido como custom property por tarjeta.

#### Scenario: Tres tarjetas entran simultaneamente
- **WHEN** las 3 `.num-card` entran al viewport
- **THEN** la primera anima sin delay
- **AND** la segunda con 100ms de delay
- **AND** la tercera con 200ms de delay
- **AND** el delay se calcula via CSS custom property en cada `.num-card[style="--card-index: N"]`

### Requirement: Fallback GSAP Preservado por Sprint
Por cada efecto migrado a CSS nativo, el codigo GSAP original SHALL mantenerse comentado o detras de un flag por al menos un sprint, permitiendo rollback rapido si se detecta regresion visual en algun navegador.

#### Scenario: Bug detectado en Chrome Canary
- **WHEN** se detecta una regresion visual en `.news-card` migrada
- **THEN** se puede revertir el efecto reactivando el bloque GSAP comentado
- **AND** el comentario indica fecha y razon de la migracion

### Requirement: prefers-reduced-motion Respetado en Ambos Paths
Todas las animaciones migradas a CSS scroll-driven SHALL respetar `@media (prefers-reduced-motion: reduce)`, igual que las versiones GSAP anteriores.

#### Scenario: Usuario con motion reducida
- **WHEN** el OS del usuario tiene "Reduce motion" activado
- **THEN** las animaciones scroll-driven se reemplazan por estados estaticos (opacity 1 directo, sin transform)
- **AND** el comportamiento es identico al fallback GSAP
