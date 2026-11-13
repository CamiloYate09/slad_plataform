# Change: Ciudades con foto en el selector y fuera la banda de cifras

## Por qué

- Las 3 ciudades salían dos veces: en el selector (planes) y en Experiencias (foto y descripción).
- La banda de cifras ("3 ciudades", "100% hecho en Colombia", "La primera red social de
  Colombia") eran afirmaciones, no pruebas, y "hecha en Colombia" ya está en el hero.

## Qué cambia

- Cada panel del selector lleva la foto, la etiqueta y la descripción que tenía su tarjeta de
  Experiencias; fuera la sección Experiencias. Los planes de Medellín y Cartagena que repetían la
  descripción se reescriben.
- Los enlaces de ciudad del hero y del pie apuntan a `#ciudades` con `data-city` y eligen esa
  pestaña. La barra y el pie enlazan "Ciudades" en lugar de "Experiencias".
- Fuera la banda de cifras con su contador, y `.gradient-text` (con su `@property` y su animación),
  que solo usaba la cifra. Fuera también el parallax de las fotos de ciudad.

## Lo que NO cambia

- El duotone de las fotos (ahora en `.city-photo`) y las imágenes `img-01`, `img-02` e `img-08`.
- La foto de Cartagena (`img-08`, flamencos) sigue con el alt "Ciudad amurallada".

## Impacto

- Specs: `page-structure`, `animations`, `visual-theme`, `layout-animations`, `header-footer`,
  `navbar-active-section`.
- Código: `index.html`, `static/css/style.css` (y `style.min.css`, CSS crítico), `static/js/main.js`,
  `sw.js` (`CACHE_VERSION` v24), `llms.txt`.
