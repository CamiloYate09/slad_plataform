## MODIFIED Requirements

### Requirement: Tipografía Editorial
El sitio SHALL usar la familia Geist Sans para body text, UI, nav, labels, h3 y cifras, con tamaño base 14px. Los titulares principales (h1 del hero y h2 de sección y del CTA) SHALL usar una serif del sistema (`--font-serif`) en peso 400, con una palabra o frase en `<em>` que se muestra en cursiva. Las cifras de stats/contadores MUST usar cifras tabulares para no causar salto de layout durante la animación de conteo.

#### Scenario: Titulares editoriales
- **WHEN** la página renderiza
- **THEN** `h1.hero-title` usa `--font-serif` en peso 400 con `font-size: var(--fs-display)` y letter-spacing `-0.02em`
- **AND** los h2 de `.section-header` y `.cta-card` usan `--font-serif` en peso 400 con `font-size: var(--fs-h2)`
- **AND** cada uno de esos titulares lleva un `<em>` y no lleva degradado (`.gradient-text`)
- **AND** body text, nav links, labels y h3 siguen usando Geist Sans

#### Scenario: Cifras tabulares en stats
- **WHEN** un `.stat-number` (u otro contador) anima su conteo ascendente
- **THEN** el elemento usa `font-variant-numeric: tabular-nums`
- **AND** el ancho del número no cambia entre dígitos, sin salto de layout durante el conteo

#### Scenario: Serif del sistema sin descarga
- **WHEN** se cargan los titulares
- **THEN** la pila `--font-serif` (ui-serif, Iowan Old Style, Palatino, Georgia, serif) resuelve a una fuente instalada
- **AND** no se descarga ni se precarga ningún archivo de fuente para los titulares

#### Scenario: Sin animación por letras
- **WHEN** la página carga o el usuario hace scroll
- **THEN** ningún titular se divide en letras ni se anima letra a letra
- **AND** con `prefers-reduced-motion: reduce` los titulares se muestran sin animación de entrada

### Requirement: Tratamiento Visual de Imagen
Las imágenes de contenido SHALL integrarse a la paleta de marca mediante un overlay duotone sutil y SHALL usar una escala de radios consistente basada en tokens, evitando radios ad-hoc dispersos.

#### Scenario: Overlay duotone sobre imágenes de contenido
- **WHEN** se renderiza una imagen de contenido (`.exp-image`)
- **THEN** una capa pseudo-elemento aplica un gradiente morado→cyan con `mix-blend-mode` y opacidad ~10–15%
- **AND** la capa tiene `pointer-events: none` y no altera el `<img>` ni su `alt`
- **AND** en `body.light-theme` el overlay se atenúa para mantener contraste

#### Scenario: Escala de radios consistente
- **WHEN** se inspeccionan los contenedores de imagen y cards
- **THEN** los radios provienen de tokens (`--radius-md` para cards, `--radius-lg` para media)
- **AND** no quedan valores de `border-radius` ad-hoc duplicados (ej. 32px/36px sueltos), salvo formas intencionales como el phone-mockup
