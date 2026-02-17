# visual-theme Specification

## Purpose
TBD - created by archiving change redesign-factory-style. Update Purpose after archive.
## Requirements
### Requirement: Black Base Theme
El sitio MUST usar un fondo base negro (`#0a0a0a`) en lugar del azul oscuro actual, manteniendo todos los colores de acento CityStream (`#af40ff`, `#5b42f3`, `#00ddeb`, `--accent-blue`, `--accent-green`, `--accent-orange`, `--accent-cyan`) sin modificaciones.

#### Scenario: Fondo negro con gradiente border preservado
- **WHEN** el usuario carga la página
- **THEN** el fondo principal es `#0a0a0a` (negro casi puro)
- **AND** el borde de 3px con gradiente CityStream (`#af40ff → #5b42f3 → #00ddeb`) sigue visible alrededor del body
- **AND** los textos con clase `.gradient-text` mantienen el gradiente CityStream original

#### Scenario: Cards sobre fondo negro
- **WHEN** se renderizan las feature-cards y course-cards
- **THEN** el fondo de las cards usa `rgba(255, 255, 255, 0.03)` (casi transparente, sutil contraste sobre negro)
- **AND** el borde de las cards usa `rgba(255, 255, 255, 0.08)` (borde sutil claro)

### Requirement: Inter Typography
El sitio SHALL usar la familia tipográfica Inter como fuente principal, cargada desde Google Fonts CDN con pesos 300, 400, 500, 600, 700, 800.

#### Scenario: Jerarquía tipográfica actualizada
- **WHEN** la página renderiza
- **THEN** headings (h1, h2) usan peso 700-800 con tamaños generosos (h1: clamp 3rem-5rem, h2: clamp 2rem-3.5rem)
- **AND** body text usa peso 400 con tamaño base `clamp(1rem, 2vw, 1.125rem)`
- **AND** nav links usan peso 500
- **AND** letter-spacing en headings es `-0.02em` (tracking apretado, estilo factory.ai)

### Requirement: Preserved CityStream Color Identity
Todos los colores de marca CityStream MUST mantenerse sin alteración en el rediseño.

#### Scenario: Colores intactos
- **WHEN** el usuario interactúa con la página
- **THEN** el gradiente principal (`#af40ff → #5b42f3 → #00ddeb`) aparece en: body border, `.gradient-text`, `.btn-primary`, `.feature-card::before`
- **AND** `--accent-cyan` (#00ddeb) se usa en: `.course-tag`, `.footer-column h3`, focus outlines
- **AND** `--accent-blue` (#3b82f6) se preserva como variable CSS disponible (skip-link, extensiones futuras)
- **AND** `--accent-green` (#34d399) y `--accent-orange` (#d97706) se mantienen en los feature icons

