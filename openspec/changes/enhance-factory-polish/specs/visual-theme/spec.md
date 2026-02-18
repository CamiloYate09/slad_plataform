## MODIFIED Requirements

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
