## MODIFIED Requirements
### Requirement: Black Base Theme
El sitio MUST usar un fondo base negro (`#0a0a0a`) con max-width `1920px` en el html. Los colores de acento CityStream se mantienen para gradientes y branding, pero se agrega un naranja brillante (`#f97316`) como color interactivo principal para hovers, siguiendo el patrón de factory.ai.

#### Scenario: Fondo negro con constrainted viewport
- **WHEN** el usuario carga la página
- **THEN** el fondo principal es `#0a0a0a` (negro casi puro)
- **AND** el elemento `html` tiene `max-width: 1920px` con `margin: 0 auto`
- **AND** el borde de 3px con gradiente CityStream (`#af40ff → #5b42f3 → #00ddeb`) sigue visible alrededor del body
- **AND** los textos con clase `.gradient-text` mantienen el gradiente CityStream original

#### Scenario: Cards sobre fondo negro
- **WHEN** se renderizan las cards de features y experiencias
- **THEN** el fondo de las cards usa `rgba(255, 255, 255, 0.03)` (casi transparente, sutil contraste sobre negro)
- **AND** el borde de las cards usa `rgba(255, 255, 255, 0.08)` (borde sutil claro)

### Requirement: Geist Sans Typography
El sitio SHALL usar la familia tipográfica Geist Sans (la misma de factory.ai: `--font-geist-sans`), cargada desde Google Fonts CDN con pesos 300, 400, 500, 600, 700, 800. El tamaño base MUST ser 14px para body text, con headings más grandes siguiendo la escala de factory.ai.

#### Scenario: Jerarquía tipográfica factory.ai
- **WHEN** la página renderiza
- **THEN** body text usa tamaño base `14px` con `leading: 100%` para texto compacto
- **AND** headings (h1, h2) usan pesos 700-800 con tamaños generosos (h1: clamp 3rem-5rem, h2: clamp 2rem-3.5rem)
- **AND** nav links usan peso 500 con tamaño 14px
- **AND** letter-spacing en headings es `-0.02em` (tracking apretado)
- **AND** `font-display: swap` previene FOIT durante la carga

### Requirement: Preserved CityStream Color Identity
Todos los colores de marca CityStream MUST mantenerse sin alteración. Se agrega `--accent-orange-hover: #f97316` como nuevo color interactivo para hovers y underlines, separado del `--accent-orange` de branding.

#### Scenario: Colores intactos con nuevo accent hover
- **WHEN** el usuario interactúa con la página
- **THEN** el gradiente principal (`#af40ff → #5b42f3 → #00ddeb`) aparece en: body border, `.gradient-text`, `.btn-primary`
- **AND** `--accent-cyan` (#00ddeb) se usa en: `.course-tag`, `.footer-column h3`, focus outlines
- **AND** `--accent-blue` (#3b82f6) se preserva como variable CSS disponible
- **AND** `--accent-green` (#34d399) y `--accent-orange` (#d97706) se mantienen en los feature icons
- **AND** `--accent-orange-hover` (#f97316) se usa exclusivamente para: link hover color, underline-reveal color, interactive feedback
