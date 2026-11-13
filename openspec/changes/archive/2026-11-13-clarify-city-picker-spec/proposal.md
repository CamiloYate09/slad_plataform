# Change: Precisar el selector de ciudad tras la revisión

## Por qué

La revisión independiente del selector de ciudad encontró que el contorno de foco (cian) no
llegaba a 3:1 en tema claro, que las flechas con Alt/Ctrl/Cmd quitaban al navegador sus atajos,
que en alto contraste no se distinguía la pestaña elegida y que la spec no decía que el título del
panel queda solo para lectores de pantalla.

## Qué cambia

### MODIFIED `page-structure` → "Selector de Ciudad"
- Título del panel oculto a la vista con JS; vuelta solo con ← y →; modificadores para el navegador;
  foco con `--accent-ink`; contorno `CanvasText` en `forced-colors`.

### Código (mismo commit)
- `.city-tab:focus-visible` y `.city-panel:focus-visible` usan `--accent-ink`.
- `@media (forced-colors: active)` para la pestaña elegida.
- `main.js` ignora las teclas con Alt, Ctrl o Cmd.

## Impacto

- Specs: `page-structure`. Código: `static/css/style.css` (y `style.min.css`), `static/js/main.js`.
