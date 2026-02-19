# Change: Reemplazar imágenes con fotos de alta resolución optimizadas

## Why
Se han agregado 15 nuevas fotos de alta resolución en `static/img/new/` que reemplazarán las imágenes actuales (1.jpg, 5.jpg, 7.jpg, 8.jpg, background.png), las cuales son de menor calidad y no representan fielmente el contenido visual de CityStream. Las nuevas imágenes deben funcionar correctamente en todos los contextos visuales de la página (carousel, tabs, cards, value-prop).

## What Changes
- Convertir los 15 JPGs de `static/img/new/` a formato WebP (optimización de peso ~30-40%)
- Mover y renombrar imágenes a `static/img/` con esquema limpio (`img-01` a `img-15`)
- Reemplazar todas las referencias de imágenes en `index.html` (carousel, feature tabs, value-prop, experience cards)
- Añadir `object-position: center top` en contenedores de imagen para mejorar el encuadre de fotos portrait en slots landscape
- Eliminar las imágenes antiguas de `static/img/` una vez validada la sustitución (1.jpg/webp, 5.jpg/webp, 7.jpg/webp, 8.jpg/webp, background.png/webp)

## Impact
- Affected specs: `page-structure` (carousel images, tab images, experience card images, value-prop image), `visual-theme` (image quality standards)
- Affected code: `index.html` (todas las referencias a imágenes de ciudades), `static/css/style.css` (object-position en contenedores de imagen)
- Archivos nuevos: 15 WebP + mantener 15 JPG como fallback en `static/img/`
- Archivos eliminados: imágenes antiguas de ciudades (1, 5, 7, 8, background)

## Open Questions
- Ninguna — el mapeo preliminar de imágenes por sección está definido en `design.md` y puede ajustarse visualmente durante la implementación
