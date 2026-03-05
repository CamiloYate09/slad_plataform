## ADDED Requirements

### Requirement: Glassmorphism Card Layer
Las tarjetas `.exp-card`, `.num-card`, `.news-card` SHALL recibir un fondo glass con `backdrop-filter: blur(8px)` y opacidad de fondo ligeramente mayor que el estado actual, siguiendo el patrón premium de `backdrop-blur` visible en referencias como AI Summit. La app provee variables CSS centralizadas `--glass-bg`, `--glass-border`, `--glass-blur` para controlar el efecto de forma consistente.

#### Scenario: Card glass en dark mode
- **WHEN** el usuario visualiza las secciones de experiences, numbered-features o news en dark mode
- **THEN** las tarjetas muestran `backdrop-filter: blur(8px)` con fondo `rgba(255,255,255,0.05)` (levemente mayor que el 0.03 actual)
- **AND** el borde pasa de `rgba(255,255,255,0.08)` a `rgba(255,255,255,0.12)` para mayor contraste
- **AND** el efecto glass es CSS puro (sin JS), aplicado mediante las variables `--glass-bg`, `--glass-border`, `--glass-blur`

#### Scenario: Card glass en light mode
- **WHEN** el usuario activa `body.light-theme`
- **THEN** `--glass-bg` se redefine a `rgba(255,255,255,0.7)` en el override de light-theme
- **AND** `--glass-border` se redefine a `rgba(0,0,0,0.08)` para mantener contraste sobre fondo claro
- **AND** el blur se mantiene en 8px sin cambios

#### Scenario: Browser sin soporte backdrop-filter
- **WHEN** el navegador no soporta `backdrop-filter`
- **THEN** la card usa el fondo `--glass-bg` como fallback sólido con opacidad ligeramente mayor
- **AND** la experiencia visual es aceptable aunque sin el blur

### Requirement: Premium Shadow Token System
El CSS SHALL definir tokens de sombra con tinte de marca para aplicar profundidad premium a elementos destacados. Los tokens siguen el patrón de `--shadow-premium` y `--shadow-glow` observados en referencias de alta calidad.

#### Scenario: Tokens disponibles en :root
- **WHEN** se inspecciona el `:root` del CSS
- **THEN** existen las variables:
  - `--shadow-premium: 0 20px 50px -10px rgba(175, 64, 255, 0.25)` — sombra larga con tinte purple
  - `--shadow-glow: 0 0 30px rgba(175, 64, 255, 0.35)` — glow purple alrededor de elemento
  - `--shadow-cyan-glow: 0 0 20px rgba(0, 221, 235, 0.2)` — glow cyan para acentos
- **AND** en `body.light-theme` los mismos tokens tienen opacidad reducida al 40% del valor dark

#### Scenario: Premium shadow aplicado en exp-cards y CTA
- **WHEN** el usuario hace hover sobre una `.exp-card`
- **THEN** la card usa `box-shadow: var(--shadow-premium)` combinado con el translateY existente
- **AND** el `.cta-card` usa `box-shadow: var(--shadow-glow)` como sombra base continua (sin hover)

### Requirement: Hero Heading Drop-Shadow Glow
El `.hero-title` SHALL usar `filter: drop-shadow()` para añadir un halo luminoso sutil alrededor del texto del heading principal, compensando visualmente la ausencia de una fuente custom ultra-bold como ASFALLT Sans o Breite Grotesk.

#### Scenario: Hero h1 cargado en dark mode
- **WHEN** la página carga en dark mode
- **THEN** el `.hero-title` tiene `filter: drop-shadow(0 0 20px rgba(175, 64, 255, 0.4))`
- **AND** el glow es sutil (no borroso) — para dar profundidad, no reemplazar legibilidad
- **AND** el efecto no interfiere con la animación de Splitting.js (drop-shadow en el contenedor, no en los `.char`)

#### Scenario: Glow en light mode
- **WHEN** el usuario activa `body.light-theme`
- **THEN** `filter: drop-shadow(0 0 12px rgba(91, 66, 243, 0.2))` (menor intensidad, tinte azul-índigo)

#### Scenario: prefers-reduced-motion
- **WHEN** `prefers-reduced-motion: reduce` está activo
- **THEN** el drop-shadow estático permanece (no es una animación — es un efecto visual estático)

### Requirement: Section Label Enhanced Contrast
Los badges `.section-label` SHALL tener mayor contraste visual en su estado visible (post-reveal) mediante border más prominente y background con mayor opacidad, sin alterar la animación clip-path-reveal existente.

#### Scenario: Section label post-reveal en dark mode
- **WHEN** el `.section-label` ha completado su animación de entrada (clip-path reveal)
- **THEN** el borde pasa de `rgba(255,255,255,0.15)` a `rgba(255,255,255,0.25)`
- **AND** el background pasa de `rgba(255,255,255,0.06)` a `rgba(255,255,255,0.10)`
- **AND** la tipografía y el padding no cambian

#### Scenario: Section label en light mode
- **WHEN** `body.light-theme` está activo
- **THEN** el borde usa `rgba(0,0,0,0.15)` y el background `rgba(0,0,0,0.06)`

### Requirement: Carousel Item Glass Treatment
Los `.carousel-item` de la sección "Trusted-by" SHALL recibir un tratamiento visual glass con border redondeado tipo pill (borde circular) y background más visible, siguiendo el patrón de badge redondeado de referencias premium.

#### Scenario: Carousel items visualizados
- **WHEN** el usuario ve la franja de ciudades (carousel)
- **THEN** cada `.carousel-item` tiene `border-radius: 9999px` (pill completo)
- **AND** background `rgba(255,255,255,0.07)` con `border: 1px solid rgba(255,255,255,0.15)`
- **AND** padding horizontal incrementado a `1.25rem` para mejor proporción pill
- **AND** la imagen circular y el texto tienen mayor contraste sobre el fondo glass
