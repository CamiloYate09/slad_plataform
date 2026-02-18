# Change: Mejorar Landing Page de CityStream

## Why
La landing page actual de CityStream (citystream.co) tiene problemas criticos de rendimiento (imagenes de 1.5MB sin optimizar, animaciones duplicadas), SEO incompleto (sin sitemap, sin datos estructurados, sin robots.txt), recursos rotos (imagen 7.jpg eliminada, directorios responsive inexistentes) y conflictos en el sistema de animaciones (ScrollReveal + IntersectionObserver + JS inline). Estas mejoras son necesarias para posicionar la marca como la primera red social colombiana con una presencia web profesional.

## What Changes
- **UI/UX**: Eliminar atributos `data-text` redundantes, unificar sistema de animaciones (quitar conflictos ScrollReveal/IntersectionObserver/JS inline), corregir imagenes rotas, mejorar jerarquia visual de tipografia, aplicar font Public Sans segun style-guide
- **SEO**: Agregar schema.org JSON-LD, sitemap.xml, robots.txt, canonical URL, mejorar titulo de pagina, corregir meta tags Open Graph
- **Rendimiento**: Optimizar/comprimir imagenes a WebP, implementar lazy loading nativo, eliminar dependencias CDN innecesarias o self-host, minificar CSS/JS, limpiar CSS/JS muerto
- **Responsividad**: Crear breakpoints intermedios adecuados, generar imagenes responsive reales (mobile/tablet), corregir layout en dispositivos intermedios, hacer formulario newsletter full responsive

## Impact
- Affected specs: `ui-ux`, `seo-meta`, `performance`, `responsive-layout`
- Affected code:
  - `index.html` (estructura HTML, meta tags, imagenes, scripts)
  - `static/css/style.css` (variables, tipografia, responsive, animaciones, cleanup)
  - `static/js/main.js` (unificar animaciones, lazy loading, cleanup)
  - `static/img/` (optimizacion de imagenes, formatos WebP, directorios responsive)
  - Nuevos archivos: `sitemap.xml`, `robots.txt`
