## 1. Corregir Recursos Rotos (Prioridad Critica)
- [x] 1.1 Restaurar o reemplazar `static/img/7.jpg` (imagen de Cartagena) referenciada en el slideshow y la card de experiencias
- [x] 1.2 Eliminar referencias a directorios inexistentes `static/img/mobile/` y `static/img/tablet/` en los `<source srcset>` del slideshow
- [x] 1.3 Limpiar imagenes no referenciadas (`2.jpg`, `3.jpg`, `4.jpg`, `6.jpg`, `logoSlad.jpg`) o documentar su proposito

## 2. Optimizacion de Imagenes (Rendimiento)
- [x] 2.1 Comprimir todas las imagenes JPG a tamaños web-appropriate (background < 200KB, cards < 100KB)
- [x] 2.2 Generar versiones WebP de todas las imagenes de contenido
- [x] 2.3 Actualizar `index.html` con `<picture>` elements que incluyan WebP + fallback JPG
- [x] 2.4 Agregar `loading="lazy"` a todas las imagenes debajo del fold (cards de cursos, etc.)
- [x] 2.5 Agregar `width` y `height` attributes a todas las `<img>` tags para evitar layout shift

## 3. Limpieza HTML y Semantica
- [x] 3.1 Eliminar todos los atributos `data-text` redundantes de los elementos HTML
- [x] 3.2 Eliminar los pseudo-elementos CSS `::before` que duplicaban el texto via `data-text`
- [x] 3.3 Actualizar el `<title>` a formato optimizado: `CityStream - La Red Social de Colombia`
- [x] 3.4 Agregar `<link rel="canonical" href="https://citystream.co/">`
- [x] 3.5 Agregar `og:locale`, `og:site_name` meta tags faltantes
- [x] 3.6 Corregir `<link rel="icon">` type attribute de `favicon.png` a `image/png`
- [x] 3.7 Actualizar copyright del footer de 2025 a 2026

## 4. SEO Tecnico
- [x] 4.1 Crear `robots.txt` en la raiz con Allow all + referencia al sitemap
- [x] 4.2 Crear `sitemap.xml` en la raiz con la URL principal y lastmod
- [x] 4.3 Agregar JSON-LD structured data `Organization` + `WebSite` en el `<head>`
- [x] 4.4 Agregar `twitter:image` meta tag faltante

## 5. Tipografia y Legibilidad (UI/UX)
- [x] 5.1 Aplicar Public Sans como font-family principal en `body` (actualmente usa Noto Sans JP)
- [x] 5.2 Limitar efecto gradient-text solo a `h1` hero y `h2` de secciones; aplicar color solido al resto
- [x] 5.3 Asegurar contraste minimo WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
- [x] 5.4 Verificar que `clamp()` fluid typography funciona correctamente en todos los breakpoints

## 6. Unificacion de Animaciones (UI/UX + Rendimiento)
- [x] 6.1 Eliminar dependencia de ScrollReveal (remover `<script>` del CDN unpkg)
- [x] 6.2 Eliminar configuracion de ScrollReveal de `main.js` (lineas 30-105)
- [x] 6.3 Eliminar handlers de hover inline de JS para feature cards (lineas 126-135 de main.js)
- [x] 6.4 Implementar animaciones de entrada usando solo CSS `@keyframes` + `.animate-in` class
- [x] 6.5 Mantener y optimizar IntersectionObserver existente como unico trigger de animaciones
- [x] 6.6 Asegurar que todas las animaciones usan solo `transform` y `opacity` (GPU-friendly)

## 7. Limpieza CSS
- [x] 7.1 Eliminar reglas CSS para `.form-overlay`, `.form-container`, `.welcome-modal` (no existen en el HTML)
- [x] 7.2 Eliminar regla global de gradient-text en `h1, h2, h3, h4, h5, p, a` (es demasiado amplia)
- [x] 7.3 Eliminar import o reglas de Noto Sans JP si se reemplaza por Public Sans
- [x] 7.4 Consolidar variables CSS redundantes y alinear con style-guide.md
- [x] 7.5 Eliminar la animacion `@keyframes body-bg` si no se usa

## 8. Mejoras Responsive
- [x] 8.1 Implementar breakpoints mobile-first: base (mobile) -> 480px -> 768px -> 1024px -> 1440px -> 1920px
- [x] 8.2 Asegurar que feature cards usan grid responsive: 1 col mobile, 2 cols tablet, 4 cols desktop
- [x] 8.3 Implementar navegacion responsive (hamburger menu o layout simplificado para mobile < 768px)
- [x] 8.4 Hacer newsletter form responsive: stacked vertical en mobile, inline en desktop
- [x] 8.5 Asegurar que el slideshow background usa `object-fit: cover` correctamente en todos los viewports
- [x] 8.6 Verificar touch targets minimos de 44x44px en botones y links interactivos en mobile
- [x] 8.7 Agregar `prefers-reduced-motion` media query para accesibilidad

## 9. Limpieza JS
- [x] 9.1 Eliminar variable `lastScroll` no utilizada en el navbar scroll handler
- [x] 9.2 Consolidar todo el codigo JS en funciones modulares con responsabilidad unica
- [x] 9.3 Agregar `event.preventDefault()` handling adecuado en el formulario newsletter con validacion

## 10. Validacion Final
- [x] 10.1 Auditar accesibilidad: aria-hidden en iconos, skip-link, aria-label con acentos, heading hierarchy
- [x] 10.2 Validar HTML con W3C Validator - 0 errores, 0 warnings
- [x] 10.3 Verificar que no hay errores 404 en recursos locales - 10/10 archivos OK
- [x] 10.4 Agregar `twitter:image` meta tag faltante
- [x] 10.5 Corregir aria-label toggle en hamburger menu (Abrir/Cerrar)

## 11. Correcciones de Accesibilidad (descubiertas en validacion)
- [x] 11.1 Agregar skip-to-main-content link
- [x] 11.2 Agregar `aria-hidden="true"` a todos los iconos decorativos `<i>`
- [x] 11.3 Corregir heading hierarchy: h4 del footer cambiado a h3
- [x] 11.4 Corregir footer-social de `<div>` a `<nav>` con aria-label
- [x] 11.5 Remover `role="navigation"` y `role="contentinfo"` redundantes (implicitos en nav/footer)
- [x] 11.6 Remover `tabindex="0"` de feature cards (no son interactivos)
- [x] 11.7 Agregar `@media (prefers-reduced-motion: reduce)` al CSS
- [x] 11.8 Corregir acentos en aria-labels (Navegacion -> Navegación, Informacion -> Información)
- [x] 11.9 Actualizar aria-label del hamburger toggle (Abrir/Cerrar menu)
