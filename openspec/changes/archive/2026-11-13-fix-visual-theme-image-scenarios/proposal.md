# Change: Encuadre y overlay de las fotos según el CSS

## Por qué

La revisión independiente del commit `63f6855` encontró dos afirmaciones de `visual-theme` que el
código no cumple: `object-position: center top` solo lo usaba la imagen de la propuesta de valor,
ya retirada, y la opacidad del overlay duotone no es la que decía la spec.

## Qué cambia

### MODIFIED `visual-theme` → "Image Asset Management"
- Las fotos de experiencias se encuadran con `object-position: center center`.

### MODIFIED `visual-theme` → "Tratamiento Visual de Imagen"
- Overlay con alfa 0.55, `soft-light` y `opacity: 0.5` (0.28 en tema claro).

### Código (mismo commit)
- `.how`, `.stats-band` y `.audience` pasan a `--px-mobile` en 768px o menos, como pide
  "Espaciado y Ancho de la Página" (`layout-animations`).
- `.how-step h3` usa `--fs-h3`; fuera una regla sin efecto de `.hero-actions` y líneas en blanco
  con espacios que dejó el podado del CSS.

## Impacto

- Specs: `visual-theme`. Código: `static/css/style.css` (y `style.min.css`, CSS crítico), `sw.js`.
