# Change: Enriquecer identidad visual — display font, tratamiento de imagen y motion nuevo

## Por qué

La página ya es visualmente sólida y densamente animada (14 efectos, glassmorphism,
particles, view transitions). Para subir el nivel de identidad sin recargarla, se
abordan tres ejes acotados que hoy quedan planos:

1. **Tipografía sin carácter de marca** — todo usa Geist (excelente para UI, pero
   neutra en titulares). Una sola fuente display en h1/h2 da personalidad sin tocar
   legibilidad del cuerpo. Además los contadores numéricos saltan de ancho durante el
   count-up por usar cifras proporcionales.
2. **Imágenes desconectadas de la paleta** — fotos a color plano con `object-fit:cover`
   y radios ad-hoc (16/24/32/36px mezclados). Un overlay duotone sutil morado→cyan y
   una escala de radios fija las integran a la identidad.
3. **Motion sin remate interactivo** — el motion actual es de entrada/scroll; falta
   feedback directo al puntero. Botones magnéticos y un reveal de media ligado al
   scroll nativo añaden dinamismo de calidad.

## Qué cambia

### Tipografía (MODIFIED `visual-theme` → "Geist Sans Typography")
- Añadir UNA fuente display variable solo en h1 (hero) y h2 (section headings),
  self-hosted junto a Geist. Geist permanece en cuerpo, nav, labels y stats.
- `font-variant-numeric: tabular-nums` en `.stat-number` y contadores para que el
  count-up no cause salto de layout.

### Imágenes (ADDED `visual-theme` → "Tratamiento Visual de Imagen")
- Overlay duotone/gradiente sutil (morado→cyan, ~10–15%) sobre imágenes de contenido
  (`.exp-image`, `.features-item-image`, `.value-prop-image`) vía pseudo-elemento.
- Escala de radios consistente con tokens (`--radius-md` cards, `--radius-lg` media),
  reemplazando los radios ad-hoc.

### Motion nuevo (ADDED `animations`)
- **Botones magnéticos**: CTAs primarios siguen sutilmente el cursor en desktop.
- **Reveal de media ligado a scroll**: imágenes clave revelan con scale/opacity usando
  `animation-timeline: view()` nativo (fallback estático).

## Lo que NO cambia

- Geist sigue siendo la fuente de cuerpo/UI; no se reemplaza.
- Paleta, estructura de secciones, stack (sin dependencias JS nuevas — la display font
  es un asset, el reveal es CSS nativo, lo magnético es ~20 líneas vanilla).
- Los 14 efectos existentes se mantienen; esto suma, no rehace.

## Impacto y dependencias

- Specs: `visual-theme` (MODIFIED + ADDED), `animations` (ADDED ×2).
- Código: `index.html` (`@font-face`/preload), `static/css/style.css` (tipografía,
  overlay, radios, reveal nativo), `static/js/main.js` (magnético), `static/fonts/`
  (asset display font).
- **Coordinación con `add-launch-readiness-2026`**: esa change ya self-hostea/subsetea
  Geist (tasks 2.3/2.4). La display font debe usar el mismo mecanismo `@font-face` en
  `static/fonts/` y subset latin para no duplicar infraestructura ni sumar latencia.
  Ver `design.md`.
