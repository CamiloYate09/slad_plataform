# Change: Retirar el contador de cifras duplicado de layout-animations

## Por qué

El cambio `fix-spec-drift-stats-carousel-sri` dejó el contador de cifras especificado en
`animations` ("Stats Section Entrance Animation") tal como funciona hoy. `layout-animations`
seguía describiendo otra versión del mismo contador, de cuando se hacía con GSAP: sección
`.stats`, atributo `data-target`, 2 s con `power2.out` y sufijo "K". Las dos specs se contradecían.

## Qué cambia

### REMOVED `layout-animations` → "Animated Statistics Counter"
- El contador queda especificado una sola vez, en `animations`.

## Impacto

- Specs: `layout-animations`. Sin cambios de código.
