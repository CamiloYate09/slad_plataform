## MODIFIED Requirements

### Requirement: Geist Sans Typography
El sitio SHALL usar la familia Geist Sans (`--font-geist-sans`) para body text, UI,
nav, labels y cifras, con tamaño base 14px y escala de headings agresiva tipo
factory.ai. Adicionalmente SHALL usar UNA fuente display variable, self-hosted, solo en
los titulares principales (h1 del hero y h2 de sección) para aportar carácter de marca
sin afectar la legibilidad del cuerpo. Las cifras de stats/contadores MUST usar cifras
tabulares para no causar salto de layout durante la animación de conteo.

#### Scenario: Jerarquia tipografica con display en titulares
- **WHEN** la pagina renderiza
- **THEN** el hero title (`h1.hero-title`) usa la fuente display con `clamp(3rem, 8vw, 5.5rem)` y letter-spacing `-0.03em`
- **AND** los section headings (`h2`) usan la fuente display con `clamp(2rem, 5vw, 3.5rem)` y letter-spacing `-0.03em`
- **AND** body text, nav links (peso 500, 14px), labels y h3 siguen usando Geist Sans
- **AND** ambas familias se precargan con `<link rel="preload">` para evitar FOIT

#### Scenario: Cifras tabulares en stats
- **WHEN** un `.stat-number` (u otro contador) anima su conteo ascendente
- **THEN** el elemento usa `font-variant-numeric: tabular-nums`
- **AND** el ancho del número no cambia entre dígitos, sin salto de layout durante el conteo

#### Scenario: Carga coherente con Geist
- **WHEN** se sirve la display font
- **THEN** se carga por el mismo mecanismo que Geist en ese momento (hoy: Google Fonts CDN, con `display=swap` y `preload`)
- **AND** la migración a self-host/subset latin ocurre junto con la de Geist en `add-launch-readiness-2026`, sin self-hostear una sola fuente de forma aislada

#### Scenario: Animaciones respetan prefers-reduced-motion
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** `font-display: swap` previene FOIT durante la carga
- **AND** no hay animaciones tipograficas

## ADDED Requirements

### Requirement: Tratamiento Visual de Imagen
Las imágenes de contenido SHALL integrarse a la paleta de marca mediante un overlay
duotone sutil y SHALL usar una escala de radios consistente basada en tokens, evitando
radios ad-hoc dispersos.

#### Scenario: Overlay duotone sobre imágenes de contenido
- **WHEN** se renderiza una imagen de contenido (`.exp-image`, `.features-item-image`, `.value-prop-image`)
- **THEN** una capa pseudo-elemento aplica un gradiente morado→cyan con `mix-blend-mode` y opacidad ~10–15%
- **AND** la capa tiene `pointer-events: none` y no altera el `<img>` ni su `alt`
- **AND** en `body.light-theme` el overlay se atenúa para mantener contraste

#### Scenario: Escala de radios consistente
- **WHEN** se inspeccionan los contenedores de imagen y cards
- **THEN** los radios provienen de tokens (`--radius-md` para cards, `--radius-lg` para media)
- **AND** no quedan valores de `border-radius` ad-hoc duplicados (ej. 32px/36px sueltos), salvo formas intencionales como el phone-mockup
