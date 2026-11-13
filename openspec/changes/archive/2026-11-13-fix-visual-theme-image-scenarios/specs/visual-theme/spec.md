## MODIFIED Requirements

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
- **AND** `.exp-image img` usa `object-position: center center`, así que el recorte se reparte por igual arriba y abajo
- **AND** el resultado visual es aceptable en todos los breakpoints definidos (1024px, 768px, 480px)

### Requirement: Tratamiento Visual de Imagen
Las imágenes de contenido SHALL integrarse a la paleta de marca mediante un overlay duotone sutil y SHALL usar una escala de radios consistente basada en tokens, evitando radios ad-hoc dispersos.

#### Scenario: Overlay duotone sobre imágenes de contenido
- **WHEN** se renderiza una imagen de contenido (`.exp-image`)
- **THEN** un `::before` aplica un gradiente morado→cian (alfa 0.55) con `mix-blend-mode: soft-light` y `opacity: 0.5`
- **AND** la capa tiene `pointer-events: none` y no altera el `<img>` ni su `alt`
- **AND** en `body.light-theme` el overlay baja a `opacity: 0.28` para mantener contraste

#### Scenario: Escala de radios consistente
- **WHEN** se inspeccionan los contenedores de imagen y cards
- **THEN** los radios provienen de tokens (`--radius-md` para cards, `--radius-lg` para media)
- **AND** no quedan valores de `border-radius` ad-hoc duplicados (ej. 32px/36px sueltos), salvo formas intencionales como el phone-mockup
