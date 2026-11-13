# Change: Poner al día visual-theme y page-structure tras los títulos editoriales y el bento

## Por qué

El commit `1fb56c2` ("Títulos editoriales y bento de funcionalidades") cambió dos cosas que
estas specs seguían describiendo a la antigua:

1. Los titulares ya no usan la fuente display (Bricolage) ni se animan letra a letra con
   Splitting.js: van en una serif del sistema, peso 400, con una palabra o frase en cursiva.
2. La sección Funcionalidades ya no tiene pestañas ni sticky scroll: es un bento
   (ver `features-bento`, cambio `replace-sticky-features-with-bento`).

## Qué cambia

### `visual-theme`: REMOVED "Geist Sans Typography", ADDED "Tipografía Editorial"
- Titulares (h1 del hero y h2 de sección, value-prop y CTA) en `--font-serif`, peso 400,
  con un `<em>` en cursiva; sin degradado ni animación por letras.
- Geist sigue en cuerpo, UI, nav, labels, h3 y cifras; las cifras siguen tabulares.
- La serif es del sistema: no se descarga ni se precarga ninguna fuente para los titulares.

### MODIFIED `visual-theme` → "Tratamiento Visual de Imagen"
- Fuera `.features-item-image` de la lista de imágenes con overlay: ya no existe.

### MODIFIED `page-structure` → "Factory.ai Section Ordering"
- El orden refleja la página actual: `.stats-band` en lugar de `.stats`, bento de
  funcionalidades en lugar de pestañas y la sección de preguntas frecuentes (`.faq`) antes del CTA.

### REMOVED `page-structure` → "Tabbed Feature Showcase"
- Lo sustituye `features-bento`.

## Lo que NO cambia

- El resto de requisitos de las dos specs.
- Desfases previos que este cambio no toca (la sección de métricas descrita como fila
  horizontal en "Stats Social Proof Section", las imágenes `img-09`–`img-13` del carrusel):
  quedan anotados para otro cambio.

## Impacto

- Specs: `visual-theme`, `page-structure`. Sin cambios de código: documenta lo ya publicado en `1fb56c2`.
