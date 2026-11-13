# Change: El borde del CTA es un brillo que cambia de color, no un degradado que gira

## Por qué

`animations` describía el borde de `.cta-card` como un `conic-gradient` en rotación continua. El
CSS anima un `box-shadow` (`@keyframes cta-border-glow`) que alterna morado, azul y cian. Las
reglas de `.cta-card::before` que quedaban de la versión con degradado no tenían regla base y no
hacían nada.

## Qué cambia

### MODIFIED `animations` → "CTA Card Gradient Border Animation"
- Brillo de borde con `box-shadow` en un ciclo de 5 s; sin animación con movimiento reducido.

### Código (mismo commit)
- Fuera `body.light-theme .cta-card::before` y `.cta-card::before` del bloque de movimiento
  reducido en `style.css`.
- Fuera el evento `themechange` de `theme.js`: nadie lo escuchaba desde que se retiraron las letras
  del hero y el canvas de partículas.
- `CACHE_VERSION` v20.

## Impacto

- Specs: `animations`. Código: `static/css/style.css`, `static/js/theme.js`, `sw.js`.
