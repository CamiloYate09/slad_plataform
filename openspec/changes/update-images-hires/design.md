# Design: update-images-hires

## Context

15 fotos nuevas de alta resolución existen en `static/img/new/`. El sitio es estático (GitHub Pages, sin build tools), por lo que la conversión y optimización se hace con herramientas del sistema operativo (macOS `sips`). Las nuevas imágenes tienen orientaciones mixtas:

| Grupo           | Archivos                          | Dimensiones  | Orientación |
|-----------------|-----------------------------------|--------------|-------------|
| Landscape 4:3   | IMG_1086, IMG_1089                | 1280×960     | Horizontal  |
| Landscape 16:9  | IMG_1091–IMG_1096                 | 1280×720     | Horizontal  |
| Portrait 3:4    | IMG_1084, IMG_1085, IMG_1087, IMG_1088 | 960×1280 | Vertical    |
| Portrait 9:16   | IMG_1090, IMG_1097, IMG_1098      | 720×1280     | Muy vertical|

## Goals / Non-Goals
- **Goals**: máxima calidad visual, compatibilidad WebP+JPG, funcionamiento correcto en todos los slots de imagen de la página
- **Non-Goals**: optimización de tamaño extrema (no hay restricciones de ancho de banda definidas), procesamiento server-side

## Decisión 1: Esquema de nombrado

**Decisión**: Renombrar imágenes a `img-01.jpg/webp` — `img-15.jpg/webp` agrupando primero las landscape (mejor para la mayoría de slots fijos), luego las portrait.

**Mapeo IMG → nombre limpio** (orden por orientación, útil para asignación por sección):

| Nombre limpio | Fuente        | Dims     | Orientación |
|---------------|---------------|----------|-------------|
| img-01        | IMG_1086.JPG  | 1280×960 | Landscape   |
| img-02        | IMG_1089.JPG  | 1280×960 | Landscape   |
| img-03        | IMG_1091.JPG  | 1280×720 | Landscape   |
| img-04        | IMG_1092.JPG  | 1280×720 | Landscape   |
| img-05        | IMG_1093.JPG  | 1280×720 | Landscape   |
| img-06        | IMG_1094.JPG  | 1280×720 | Landscape   |
| img-07        | IMG_1095.JPG  | 1280×720 | Landscape   |
| img-08        | IMG_1096.JPG  | 1280×720 | Landscape   |
| img-09        | IMG_1084.JPG  | 960×1280 | Portrait    |
| img-10        | IMG_1085.JPG  | 960×1280 | Portrait    |
| img-11        | IMG_1087.JPG  | 960×1280 | Portrait    |
| img-12        | IMG_1088.JPG  | 960×1280 | Portrait    |
| img-13        | IMG_1090.JPG  | 720×1280 | Portrait    |
| img-14        | IMG_1097.JPG  | 720×1280 | Portrait    |
| img-15        | IMG_1098.JPG  | 720×1280 | Portrait    |

## Decisión 2: Asignación de imágenes por sección

**Decisión**: Priorizar imágenes landscape para slots con altura fija (tab-image: 300px, value-prop: 350px, exp-card: 200px). Las portrait se usan en el carousel (48×48 círculo donde el recorte no es relevante).

| Sección             | Slot          | Imagen asignada | Razón                        |
|---------------------|---------------|-----------------|------------------------------|
| Carousel (Ciudad 1) | 48×48 circle  | img-09          | Portrait OK en círculo       |
| Carousel (Ciudad 2) | 48×48 circle  | img-10          | Portrait OK en círculo       |
| Carousel (Ciudad 3) | 48×48 circle  | img-11          | Portrait OK en círculo       |
| Carousel (Ciudad 4) | 48×48 circle  | img-12          | Portrait OK en círculo       |
| Carousel (Ciudad 5) | 48×48 circle  | img-13          | Portrait OK en círculo       |
| Tab: Ciudades       | 100%×300px    | img-03          | Landscape 16:9, ajuste ideal |
| Tab: Eventos        | 100%×300px    | img-04          | Landscape 16:9               |
| Tab: Personas       | 100%×300px    | img-05          | Landscape 16:9               |
| Tab: Conciertos     | 100%×300px    | img-06          | Landscape 16:9               |
| Value-prop          | 100%×350px    | img-07          | Landscape 16:9, slot alto    |
| Exp. Bogotá         | 100%×200px    | img-01          | Landscape 4:3                |
| Exp. Medellín       | 100%×200px    | img-02          | Landscape 4:3                |
| Exp. Cartagena      | 100%×200px    | img-08          | Landscape 16:9               |

**Nota**: Este mapeo es preliminar. Durante la implementación, el desarrollador debe revisar visualmente cada imagen y reasignar si el contenido de la foto no corresponde a la sección (ej.: si img-03 muestra un evento en lugar de una ciudad, intercambiarla con img-04).

## Decisión 3: Conversión WebP

**Decisión**: Usar `sips` de macOS para conversión WebP + `sips` para redimensionado si necesario.

```bash
# Conversión a WebP (calidad 85)
sips -s format webp -s formatOptions 85 fuente.jpg --out destino.webp

# Redimensionar al máximo 1280px de ancho (si aplica)
sips -Z 1280 fuente.jpg
```

Las imágenes ya son ≤1280px de ancho, por lo que no se necesita redimensionado.

## Decisión 4: Manejo de imágenes portrait en slots landscape

**Problema**: Imágenes portrait (960×1280) en contenedores de altura fija (300px, 200px) con `object-fit: cover` muestran solo la franja central vertical, pudiendo cortar el sujeto principal.

**Decisión**: Agregar `object-position: center top` en los contenedores de imagen (`.tab-image img`, `.value-prop-image img`, `.exp-image img`). Esto prioriza la zona superior de la imagen, que generalmente contiene el sujeto principal en fotos de ciudad/eventos. El carousel usa `object-position: center center` (por defecto) ya que es un círculo pequeño.

**Alternativas consideradas**:
- `center center` (actual, sin cambio): puede cortar caras/sujetos en portrait
- `center top`: favorece sujeto en la parte alta ✓ (elegida)
- `object-position` por clase CSS individual: más control pero más complejidad

## Decisión 5: Destino de imágenes antiguas

**Decisión**: Eliminar imágenes de ciudad antiguas (`1.jpg`, `1.webp`, `5.jpg`, `5.webp`, `7.jpg`, `7.webp`, `8.jpg`, `8.webp`, `background.png`, `background.webp`) después de verificar que ninguna referencia queda en el HTML. Conservar `logo-citystream.png` y `imageConcierto.png` (no relacionadas con este change).

## Risks / Trade-offs
- **Riesgo**: El mapeo visual puede ser incorrecto (no se pueden ver las fotos hasta renderizarlas) → **Mitigación**: la asignación de imágenes es la última tarea de implementación y se valida visualmente en el browser antes de archivar el change.
- **Riesgo**: WebP no compatible en browsers muy antiguos → **Mitigación**: ya se usa `<picture>` con fallback JPG en toda la página.
