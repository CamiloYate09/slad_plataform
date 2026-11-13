# Change: Sustituir el sticky scroll de Funcionalidades por un bento de producto

## Por qué

La sección Funcionalidades contaba los cuatro pilares con un scroll narrativo: lista numerada
fija a la izquierda y una escena animada de la app por pilar a la derecha. Tras prototipar
cuatro variantes inspiradas en slash.com (rama `prototype/slash-ideas`), se eligió mostrar el
producto de un vistazo: un bento de tarjetas, cada una con una mini-interfaz de la app y un
texto breve. Se lee sin hacer scroll largo, funciona igual en móvil y no depende de React.

Implementado en el commit `1fb56c2` ("Títulos editoriales y bento de funcionalidades").

## Qué cambia

### REMOVED `sticky-scroll-features` → "Sticky Scroll Narrative — Features Section"
- Fuera la lista numerada `.features-nav`/`.fnav-item`, los `.features-item` y su
  IntersectionObserver en `main.js`.
- Fuera las escenas de pilares de `app-demos/` (`src/pillars/` y sus bundles compilados).

### ADDED `features-bento` → "Bento de Funcionalidades"
- `#features` muestra un bento de cinco tarjetas: Ciudades, Eventos, Conciertos (fila de tres)
  y Avisos, Personas (fila de dos). Una columna por debajo de 860px.
- Cada tarjeta lleva una mini-interfaz decorativa en HTML y CSS (`aria-hidden`, sin elementos
  enfocables) y un `h3` con su `p`.
- El paso 2 del tour apunta a la cabecera de la sección.

## Lo que NO cambia

- El `id="features"`, el enlace "Características" de la barra y el resaltado de sección activa.
- La escena animada del hero (`data-demo="hero"`).
- Los títulos editoriales del mismo commit (serif con una palabra en cursiva) no forman parte de
  este cambio: tocan `visual-theme` y se especifican aparte.

## Impacto

- Specs: `sticky-scroll-features` (requisito retirado), `features-bento` (nueva).
- Código: `index.html`, `static/css/style.css`, `static/js/main.js`, `static/js/tour.js`,
  `app-demos/`, `static/js/app-demos/`, `sw.js` (`CACHE_VERSION` v19).
