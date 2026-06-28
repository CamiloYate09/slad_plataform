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

### Requirement: Image Asset Management
Los assets de imagen de contenido del sitio MUST seguir una convención de nombrado limpia y estar centralizados en `static/img/` con conversión WebP para rendimiento óptimo.

#### Scenario: Convención de nombrado de imágenes de contenido
- **WHEN** se inspeccionan los archivos en `static/img/`
- **THEN** las imágenes de contenido de ciudad/evento siguen el patrón `img-NN.jpg` / `img-NN.webp` (NN = 01 a 15)
- **AND** las imágenes de marca (`logo-citystream.png`) mantienen su nombre original
- **AND** no existen imágenes de ciudad antiguas con nombres numéricos cortos (`1.jpg`, `5.jpg`, `7.jpg`, `8.jpg`, `background.png`)

#### Scenario: Compatibilidad de orientaciones mixtas
- **WHEN** una imagen portrait (960×1280 o 720×1280) se coloca en un slot landscape (ancho fijo, altura fija)
- **THEN** `object-fit: cover` recorta la imagen para llenar el contenedor sin distorsión
- **AND** `object-position: center top` asegura que la zona superior (sujeto principal) sea visible
- **AND** el resultado visual es aceptable en todos los breakpoints definidos (1024px, 768px, 480px)

### Requirement: Ambient Section Glow System
El sitio SHALL usar radial-gradient pseudo-elementos en secciones clave para añadir profundidad luminosa al fondo oscuro, replicando el aspecto premium de factory.ai. Los glows son CSS puro (sin JS) y no interfieren con `prefers-reduced-motion`.

#### Scenario: Glows en dark mode (default)
- **WHEN** la página renderiza en dark mode (default)
- **THEN** la sección `.hero` muestra un radial-gradient purple (`rgba(175, 64, 255, 0.18)`) centrado arriba
- **AND** la sección `.features` muestra un glow azul-índigo (`rgba(91, 66, 243, 0.12)`) desde la esquina derecha
- **AND** la sección `.experiences` muestra un glow cyan (`rgba(0, 221, 235, 0.08)`) desde la izquierda
- **AND** todos los glows son implementados como `::before` con `position: absolute`, `pointer-events: none`, `z-index: 0`
- **AND** el contenido de las secciones tiene `position: relative; z-index: 1` para renderizar sobre los glows

#### Scenario: Glows reducidos en light mode
- **WHEN** el usuario activa `body.light-theme`
- **THEN** los glows de todas las secciones tienen opacidad máxima del 50% respecto al dark mode
- **AND** no hay colores saturados visibles sobre el fondo claro

#### Scenario: Glows no afectan performance
- **WHEN** se inspecciona el render de la página
- **THEN** los glows son elementos CSS composited (GPU) sin JavaScript
- **AND** no hay layout thrashing ni repaints causados por los glows

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

