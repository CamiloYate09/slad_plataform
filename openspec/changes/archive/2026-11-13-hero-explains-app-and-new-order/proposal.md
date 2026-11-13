# Change: Hero que explica la app y nuevo orden de secciones

## Por qué

Tras comparar con slash.com, la landing no decía qué es CityStream en los primeros segundos: el
titular ("Tu ciudad, tus reglas") era un lema, y antes de enseñar el producto venían el carrusel y
las cifras. Se prototiparon cuatro variantes del hero y del orden (rama `prototype/hero-order`,
commit `3f1bb3b`) y se eligió el hero de la variante C con el orden de la B.

## Qué cambia

### Hero (variante C)
- Titular "Todos los planes de tu ciudad, *en una app*" y subtítulo concreto (eventos, conciertos
  y gente en Bogotá, Medellín y Cartagena; gratis y hecha en Colombia).
- Una sola columna centrada: texto, captura de correo, enlaces "Mira qué hay en: Bogotá ·
  Medellín · Cartagena" y, debajo, la escena de la app.
- Fuera el indicador "Scroll": con el teléfono debajo del texto quedaba fuera de pantalla y encima
  del teléfono.

### Orden (variante B)
- hero → funcionalidades (bento) → **cómo funciona** (nuevo) → carrusel → cifras → para quién →
  experiencias → eventos → preguntas → CTA.
- Fuera "Construido diferente" (`.numbered-features`) y la propuesta de valor (`.value-prop`):
  repetían "hecho en Colombia" y "sin algoritmos", que ya dicen el bento, el subtítulo y las
  preguntas.

### Specs
- `page-structure`: orden, hero y "Cómo funciona" nuevos; carrusel y cifras en su nuevo sitio;
  fuera la propuesta de valor; imágenes según los formatos reales (AVIF, WebP y JPG).
- `dark-contrast-band`: se retira (la banda era "Construido diferente").
- `animations`: fuera el giro 3D (no existe en el código) y el revelado de la imagen de la
  propuesta de valor; brillo y containment sin las secciones retiradas.
- `visual-theme` y `layout-animations`: sin la propuesta de valor ni las tarjetas de números.

## Lo que NO cambia

- El bento, los títulos editoriales, el resto de secciones y el footer.
- Las cifras siguen diciendo "5 ciudades" y el carrusel muestra cinco: el hero nombra tres. Queda
  pendiente decidir una versión.

## Impacto

- Código: `index.html`, `static/css/style.css` (y `style.min.css`, CSS crítico), `static/js/main.js`,
  `sw.js` (`CACHE_VERSION` v21); fuera `static/img/logo-citystream-600.{avif,webp}`, que solo usaba la
  propuesta de valor.
