# Change: Selector de ciudad en lugar del carrusel y 3 ciudades de lanzamiento

## Por qué

- El carrusel de ciudades (`.trusted-by`) mostraba miniaturas de 96px en gris de cinco ciudades,
  con un anillo girando y repetidas cuatro veces. No ayudaba a entender la app ni a elegir
  ciudad.
- La página decía unas veces 3 ciudades y otras 5. El lanzamiento es en Bogotá, Medellín y
  Cartagena.
- "en una app" se repetía: en el hero, justo debajo en el h2 del bento y en una tarjeta de cifras.

## Qué cambia

- Selector de ciudad (`.city-picker`) con pestañas Bogotá / Medellín / Cartagena y tres planes
  por ciudad, sacados del texto que la página ya tenía (experiencias y próximos eventos). Patrón
  ARIA tabs en `main.js`; sin JS se ven los tres paneles seguidos.
- 3 ciudades: la cifra pasa de 5 a 3; la pregunta frecuente (visible y en el JSON-LD) dice que
  Cali y Barranquilla llegan pronto; el JSON-LD `ItemList`, el pie, `llms.txt` y `llms-full.txt`
  pasan a 3 ciudades.
- "en una app" queda solo en el hero: el h2 del bento pasa a "Así se ve *por dentro*" y la tarjeta
  de cifras a "… en un solo lugar".
- Fuera el CSS del carrusel y `static/img/avatar-09`–`avatar-13` (AVIF, WebP y JPG).

## Lo que NO cambia

- La tarjeta "Carnaval de Barranquilla" de próximos eventos: es un evento nacional, no una ciudad
  cubierta.
- "Cali y Barranquilla, muy pronto." en experiencias y "Cali · Pronto" en el bento.

## Impacto

- Specs: `page-structure`. Código: `index.html`, `static/css/style.css` (y `style.min.css`, CSS
  crítico), `static/js/main.js`, `sw.js` (`CACHE_VERSION` v23), `llms.txt`, `llms-full.txt`.
