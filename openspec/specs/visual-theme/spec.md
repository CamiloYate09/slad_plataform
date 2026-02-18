# visual-theme Specification

## Purpose
TBD - created by archiving change redesign-factory-style. Update Purpose after archive.
## Requirements
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

### Requirement: Preserved CityStream Color Identity
Todos los colores de marca CityStream MUST mantenerse sin alteración. Se agrega `--accent-orange-hover: #f97316` como nuevo color interactivo para hovers y underlines, separado del `--accent-orange` de branding.

#### Scenario: Colores intactos con nuevo accent hover
- **WHEN** el usuario interactúa con la página
- **THEN** el gradiente principal (`#af40ff → #5b42f3 → #00ddeb`) aparece en: body border, `.gradient-text`, `.btn-primary`
- **AND** `--accent-cyan` (#00ddeb) se usa en: `.course-tag`, `.footer-column h3`, focus outlines
- **AND** `--accent-blue` (#3b82f6) se preserva como variable CSS disponible
- **AND** `--accent-green` (#34d399) y `--accent-orange` (#d97706) se mantienen en los feature icons
- **AND** `--accent-orange-hover` (#f97316) se usa exclusivamente para: link hover color, underline-reveal color, interactive feedback

### Requirement: Geist Sans Typography
El sitio SHALL usar la familia tipografica Geist Sans (la misma de factory.ai: `--font-geist-sans`), cargada desde Google Fonts CDN con pesos 100-900 (variable). El tamano base MUST ser 14px para body text, con headings significativamente mas grandes siguiendo una escala agresiva tipo factory.ai para maximo impacto visual.

#### Scenario: Jerarquia tipografica factory.ai agresiva
- **WHEN** la pagina renderiza
- **THEN** el hero title usa `clamp(3rem, 8vw, 5.5rem)` con peso 900 y letter-spacing `-0.03em`
- **AND** section headings (h2) usan `clamp(2rem, 5vw, 3.5rem)` con peso 700 y letter-spacing `-0.03em`
- **AND** body text usa tamano base `14px` con leading `1.5`
- **AND** nav links usan peso 500 con tamano 14px
- **AND** la fuente se precarga con `<link rel="preload">` para evitar FOIT

#### Scenario: Animaciones respetan prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** `font-display: swap` previene FOIT durante la carga
- **AND** no hay animaciones tipograficas

