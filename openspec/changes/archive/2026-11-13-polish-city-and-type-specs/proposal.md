# Change: Precisar el selector de ciudad y los titulares tras la revisión

## Por qué

La revisión independiente de `merge-cities-drop-stats` encontró que la spec del selector solo
describía el móvil y que "Tipografía de Titulares" nombraba `.gradient-text`, que ya no existe.

## Qué cambia

- MODIFIED `page-structure` → "Selector de Ciudad": escenario de escritorio (foto 5/12 a la
  izquierda, información 7/12 a la derecha).
- MODIFIED `visual-theme` → "Tipografía de Titulares": "sin texto con degradado" en lugar de la
  clase retirada.
- Purpose de `layout-animations` sin el parallax ni los hovers de tarjetas (editado en la spec).

### Código (mismo commit)
- `style.css`: fuera comentarios huérfanos, un `@supports` vacío, los tokens `--glow-cyan` y
  `--bg-dark-band` (sin uso) y líneas en blanco del podado; comentario de `--accent-ink` al día.
- `index.html`: la descripción de Bogotá y dos planes (Monserrate, escena gastronómica de
  Medellín) dejan de repetirse entre sí.

## Impacto

- Specs: `page-structure`, `visual-theme`, `layout-animations` (Purpose).
