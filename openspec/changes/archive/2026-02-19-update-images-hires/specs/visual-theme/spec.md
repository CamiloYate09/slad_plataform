## ADDED Requirements

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
