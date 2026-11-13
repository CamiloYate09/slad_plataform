## MODIFIED Requirements

### Requirement: Tipografía de Titulares
El sitio SHALL usar la familia Geist Sans para body text, UI, nav, labels y h3, con tamaño base 14px. Los titulares principales (h1 del hero y h2 de sección y del CTA) SHALL usar una serif del sistema (`--font-serif`) en peso 400, con una palabra o frase en `<em>` que se muestra en cursiva.

#### Scenario: Titulares editoriales
- **WHEN** la página renderiza
- **THEN** `h1.hero-title` usa `--font-serif` en peso 400 con `font-size: var(--fs-display)` y letter-spacing `-0.02em`
- **AND** los h2 de `.section-header` y `.cta-card` usan `--font-serif` en peso 400 con `font-size: var(--fs-h2)`
- **AND** cada uno de esos titulares lleva un `<em>` y no lleva texto con degradado
- **AND** body text, nav links, labels y h3 siguen usando Geist Sans

#### Scenario: Serif del sistema sin descarga
- **WHEN** se cargan los titulares
- **THEN** la pila `--font-serif` (ui-serif, Iowan Old Style, Palatino, Georgia, serif) resuelve a una fuente instalada
- **AND** no se descarga ni se precarga ningún archivo de fuente para los titulares

#### Scenario: Sin animación por letras
- **WHEN** la página carga o el usuario hace scroll
- **THEN** ningún titular se divide en letras ni se anima letra a letra
- **AND** con `prefers-reduced-motion: reduce` los titulares se muestran sin animación de entrada
