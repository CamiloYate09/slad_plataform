# Change: Corregir desfases de specs en cifras, carrusel e integridad de recursos

## Por qué

Al poner las specs al día tras `1fb56c2` quedaron anotados desfases anteriores: requisitos que
describen secciones o recursos que la página ya no tiene así.

1. `animations` describe una entrada escalonada de `.stat-item` en `.stats`: hoy la sección es
   `.stats-band`, sus tarjetas no tienen entrada propia y solo las cifras cuentan hacia arriba.
2. `page-structure` describe las cifras como una fila de 4 métricas con separadores y sufijos
   "K+", y el carrusel con imágenes `img-09`–`img-13` y un desplazamiento de -50%. Hoy las cifras
   son un bento de 4 tarjetas y el carrusel usa `avatar-09`–`avatar-13` en cuatro copias (-25%).
3. `static-hardening` exige SRI en todo recurso de CDN externo, pero el beacon de Cloudflare Web
   Analytics no lo lleva: Cloudflare lo sirve en una URL sin versión, así que un hash fijo dejaría
   de valer en cada actualización. Las librerías de terceros ya se sirven desde `static/vendor/`.

## Qué cambia

### `animations`
- MODIFIED "Stats Section Entrance Animation": las cifras de `.stats-band` cuentan de 0 al valor
  final al entrar en pantalla; las tarjetas no tienen animación de entrada.

### `page-structure`
- MODIFIED "Trusted-By Logo Carousel": ciudades con su foto `avatar-09`–`avatar-13`
  (AVIF/WebP/JPG), cuatro copias y desplazamiento de 0 a -25%.
- REMOVED "Stats Social Proof Section" y ADDED "Banda de Cifras": bento de cuatro tarjetas
  (4 → 2 → 1 columnas).

### `static-hardening`
- REMOVED "Subresource Integrity en todos los recursos CDN externos" y ADDED "Recursos de
  Terceros": librerías desde `static/vendor/` con `integrity`; el beacon de Cloudflare es la única
  excepción y su alcance lo limita la CSP.

## Lo que NO cambia

- Código: la página ya se comporta así. Este cambio solo corrige las specs.

## Impacto

- Specs: `animations`, `page-structure`, `static-hardening`.
